import React, { useMemo, useState, ReactNode } from "react";
import {
  FaArrowLeft,
  FaClipboard,
  FaClock,
  FaEdit,
  FaFileAlt,
  FaFlask,
  FaMapMarkerAlt,
  FaPhone,
  FaPrint,
  FaSave,
  FaUser,
  FaUserMd,
  FaCheckCircle,
  FaCog,
  FaTruck,
  FaWhatsapp,
  FaEnvelope,
  FaTimes,
  FaPaperclip,
  // added for filters:
  FaSearch,
  FaFilter,
  FaSort,
} from "react-icons/fa";

// ---- Types reused from customer app ----
type OrderStatus =
  | "PLACED"
  | "SAMPLE_COLLECTED"
  | "IN_PROGRESS"
  | "REPORT_READY"
  | "COMPLETED"
  | "CANCELLED";

const ORDER_STEPS: { key: OrderStatus; label: string }[] = [
  { key: "PLACED", label: "Order Placed" },
  { key: "SAMPLE_COLLECTED", label: "Sample Collected" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "REPORT_READY", label: "Report Ready" },
  { key: "COMPLETED", label: "Completed" },
  { key: "CANCELLED", label: "Cancelled" },
];


// ---- Additional merchant-side types ----
interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

interface Patient {
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email?: string;
}

interface Item {
  id: string;
  name: string;
  type: "package" | "test";
  price: number;
}

interface Payment {
  method: "COD" | "UPI" | "Card" | "NetBanking";
  status: "Pending" | "Paid" | "Refunded";
  txnId?: string;
}

interface Phlebotomist {
  id: string;
  name: string;
  phone: string;
}

interface ActivityEvent {
  ts: string; // ISO
  message: string;
}

interface Order {
  id: string;
  placedAt: string; // ISO
  labName: string;
  patient: Patient;
  address: Address;
  items: Item[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  payment: Payment;
  pickupWindow?: { start: string; end: string }; // ISO
  phlebotomist?: Phlebotomist;
  reportUrl?: string;
  notes?: string; // internal notes
  instructions?: string; // customer notes
  activity: ActivityEvent[];
}

// ---- Mock orders ----
const MOCK_ORDER: Order = {
  id: "ORD-2025-00073",
  placedAt: new Date().toISOString(),
  labName: "City Diagnostic Lab",
  patient: {
    name: "Aarav Sharma",
    age: 32,
    gender: "Male",
    phone: "+91 98XXXXXX21",
    email: "aarav@example.com",
  },
  address: {
    line1: "Flat 402, Green Meadows",
    line2: "Near River Park",
    city: "Pune",
    state: "MH",
    pincode: "411045",
  },
  items: [
    { id: "pkg1", name: "Basic Health Checkup", type: "package", price: 999 },
    { id: "test8", name: "HbA1c (Diabetes Test)", type: "test", price: 499 },
  ],
  subtotal: 1498,
  discount: 100,
  deliveryFee: 49,
  total: 1447,
  status: "PLACED",
  payment: { method: "UPI", status: "Pending" },
  instructions: "Fasting since 8 hours. Preferred morning pickup.",
  activity: [
    { ts: new Date().toISOString(), message: "Order created by user" },
  ],
};

const MOCK_ORDER_B: Order = {
  ...MOCK_ORDER,
  id: "ORD-2025-00074",
  patient: {
    name: "Neha Verma",
    age: 28,
    gender: "Female",
    phone: "+91 98XXXXXX11",
    email: "neha@example.com",
  },
  status: "IN_PROGRESS",
  payment: { method: "Card", status: "Paid", txnId: "TXN-987654" },
  activity: [
    { ts: new Date().toISOString(), message: "Order created by user" },
    { ts: new Date().toISOString(), message: "Sample received at lab" },
  ],
};

// ---- UI helpers ----
const pill = (text: string, cls = "bg-red-100 text-red-700 border-red-200") => (
  <span
    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${cls}`}
  >
    {text}
  </span>
);

const humanize = (s: string) => s.replace(/_/g, " ");

function formatDateTimeIST(date: string | Date): string {
  const d = new Date(date);
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const ist = new Date(utc + 5.5 * 60 * 60 * 1000);

  const dd = String(ist.getDate()).padStart(2, "0");
  const mm = String(ist.getMonth() + 1).padStart(2, "0");
  const yyyy = ist.getFullYear();

  let hours = ist.getHours();
  const minutes = String(ist.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${dd}/${mm}/${yyyy}, ${hours}:${minutes} ${ampm}`;
}

interface SectionCardProps {
  title: ReactNode;
  right?: ReactNode;
  className?: string;
  children?: ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  right,
  className,
  children,
}) => (
  <div
    className={`rounded-2xl border border-red-100 bg-white/70 backdrop-blur shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition ${
      className ?? ""
    }`}
  >
    <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-gradient-to-r from-red-50/80 to-red-100/80 rounded-t-2xl">
      <h3 className="text-sm sm:text-base font-bold text-red-700 flex items-center gap-2">
        {title}
      </h3>
      {right}
    </div>
    <div className="p-4 sm:p-6">{children}</div>
  </div>
);

const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const map: Record<OrderStatus, string> = {
    PLACED: "bg-blue-50 text-blue-700 border-blue-200",
    SAMPLE_COLLECTED: "bg-purple-50 text-purple-700 border-purple-200",
    IN_PROGRESS: "bg-amber-50 text-amber-700 border-amber-200",
    REPORT_READY: "bg-emerald-50 text-emerald-700 border-emerald-200",
    COMPLETED: "bg-green-50 text-green-700 border-green-200",
    CANCELLED: "bg-gray-50 text-gray-700 border-gray-200",
  };
  return pill(humanize(status), map[status]);
};

const icons = [
  <FaClipboard />,
  <FaFlask />,
  <FaCog />,
  <FaFileAlt />,
  <FaCheckCircle />,
  <FaTimes />,
];

const Stepper: React.FC<{ status: OrderStatus }> = ({ status }) => {
  // If cancelled, render a track that excludes "Completed"
  const steps =
    status === "CANCELLED"
      ? ORDER_STEPS.filter((s) => s.key !== "COMPLETED") // Placed → … → Cancelled
      : ORDER_STEPS.filter((s) => s.key !== "CANCELLED"); // Placed → … → Completed

  const idx = steps.findIndex((s) => s.key === status);

  return (
    <div className="w-full flex items-center">
      {steps.map((s, i) => {
        const reached = i <= idx;
        const isCurrent = i === idx;
        const isCancelled = s.key === "CANCELLED";

        return (
          <React.Fragment key={s.key}>
            <div className="flex flex-col items-center text-center min-w-0 flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 shadow-md transition-all ${
                  reached
                    ? isCancelled
                      ? "bg-gray-200 text-gray-600 border-gray-300"
                      : "bg-gradient-to-br from-red-600 to-orange-500 text-white border-red-600"
                    : "bg-gray-200 text-gray-500 border-gray-300"
                } ${isCurrent ? "ring-4 ring-red-200" : ""}`}
              >
                {icons[ORDER_STEPS.findIndex((os) => os.key === s.key)]}
              </div>
              <span
                className={`mt-2 text-[10px] sm:text-xs md:text-sm font-medium leading-tight truncate ${
                  reached && !isCancelled ? "text-red-700" : "text-gray-600"
                }`}
              >
                {s.label}
              </span>
            </div>

            {i < steps.length - 1 && (
              <div
                className={`h-1 flex-1 mx-1 sm:mx-2 rounded-full self-center ${
                  i < idx && status !== "CANCELLED"
                    ? "bg-gradient-to-r from-red-600 to-orange-500"
                    : "bg-gray-300"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};


// ---- Small sub-components ----
const PickupEditor: React.FC<{
  onSave: (start: string, end: string) => void;
  onCancel: () => void;
}> = ({ onSave, onCancel }) => {
  const [start, setStart] = useState<string>(
    new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [end, setEnd] = useState<string>(
    new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );

  return (
    <div className="mt-4 grid sm:grid-cols-3 gap-3">
      <div className="text-sm">
        <label className="block text-xs text-gray-600 mb-1">Start</label>
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>
      <div className="text-sm">
        <label className="block text-xs text-gray-600 mb-1">End</label>
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>
      <div className="flex items-end gap-2">
        <button
          onClick={() =>
            onSave(new Date(start).toISOString(), new Date(end).toISOString())
          }
          className="rounded-full bg-red-600 text-white px-4 py-2 text-sm font-semibold hover:bg-red-700"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="rounded-full bg-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const AddNote: React.FC<{ onAdd: (msg: string) => void }> = ({ onAdd }) => {
  const [msg, setMsg] = useState("");
  return (
    <div className="flex gap-2">
      <input
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Add internal note or activity…"
        className="flex-1 rounded-xl border px-3 py-2 text-sm"
      />
      <button
        onClick={() => {
          if (!msg.trim()) return;
          onAdd(msg.trim());
          setMsg("");
        }}
        className="rounded-full bg-red-600 text-white px-4 py-2 text-sm font-semibold hover:bg-red-700"
      >
        Add
      </button>
    </div>
  );
};

const CancelForm: React.FC<{ onCancel: (reason: string) => void }> = ({
  onCancel,
}) => {
  const [reason, setReason] = useState("");
  return (
    <div>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="w-full rounded-xl border px-3 py-2 text-sm min-h-[100px]"
        placeholder="Reason for cancellation"
      />
      <div className="mt-3 flex justify-end gap-2">
        <button
          onClick={() => onCancel(reason || "No reason provided")}
          className="rounded-full bg-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-300"
        >
          Confirm Cancel
        </button>
      </div>
    </div>
  );
};

// ---- Small order card for list view ----
const OrderCard: React.FC<{ order: Order; onOpen: () => void }> = ({
  order,
  onOpen,
}) => {
  const totalItems = order.items.length;
  return (
    <div className="rounded-2xl border border-red-100 bg-white p-5 flex flex-col gap-4 shadow-sm hover:shadow-xl hover:border-red-200 transition-all duration-300">
      {/* Top Row: ID + Status */}
      <div className="flex items-center justify-between">
        <div className="font-mono text-sm sm:text-base font-semibold text-gray-800">
          #{order.id}
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Patient + Placed Info */}
      <div>
        <div className="text-base font-semibold text-gray-900">
          {order.patient.name}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">
          Placed on{" "}
          <span className="font-medium text-gray-600">
            {formatDateTimeIST(order.placedAt)}
          </span>
        </div>
      </div>

      {/* Footer: Items + Total + Action */}
      <div className="flex items-center justify-between text-sm sm:text-base">
        <span className="text-gray-700">
          {totalItems} {totalItems > 1 ? "items" : "item"} •{" "}
          <span className="font-semibold text-gray-900">₹{order.total}</span>
        </span>
        <button
          onClick={onOpen}
          className="rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-1.5 text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg hover:from-red-700 hover:to-red-600 transition-all"
        >
          Open
        </button>
      </div>
    </div>
  );
};

// ---- Main component ----
const MerchantOrderManager: React.FC = () => {
  // MULTI-ORDER: list -> click to open detail
  const [orders, setOrders] = useState<Order[]>([MOCK_ORDER, MOCK_ORDER_B]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // detail view local toggles
  const [editPickup, setEditPickup] = useState(false);
  const [editPayment, setEditPayment] = useState(false);
  const [reportFileNameByOrder, setReportFileNameByOrder] = useState<
    Record<string, string | undefined>
  >({});
  const [showCancel, setShowCancel] = useState(false);

  // -------- NEW: list filters/sort/search (kept to your visual style) --------
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [sortKey, setSortKey] = useState<"placedAt" | "total">("placedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const order = useMemo(
    () => orders.find((o) => o.id === selectedId) ?? null,
    [orders, selectedId]
  );

  const updateOrder = (mutator: (o: Order) => Order) =>
    setOrders((prev) =>
      prev.map((o) => (o.id === selectedId ? mutator(o) : o))
    );

  const pushActivity = (msg: string) => {
    if (!order) return;
    updateOrder((o) => ({
      ...o,
      activity: [{ ts: new Date().toISOString(), message: msg }, ...o.activity],
    }));
  };

  const updateStatus = (s: OrderStatus) => {
    if (!order) return;
    updateOrder((o) => ({ ...o, status: s }));
    pushActivity(`Status updated to ${humanize(s)}`);
  };

  const assignPhleb = (p: Phlebotomist) => {
    if (!order) return;
    updateOrder((o) => ({ ...o, phlebotomist: p }));
    pushActivity(`Phlebotomist assigned: ${p.name}`);
  };

  const markPaid = () => {
    if (!order) return;
    updateOrder((o) => ({
      ...o,
      payment: { ...o.payment, status: "Paid", txnId: `TXN-${Date.now()}` },
    }));
    pushActivity("Payment marked as Paid");
  };

  const uploadReport = (file: File) => {
    if (!order) return;
    const fakeUrl = URL.createObjectURL(file); // demo
    updateOrder((o) => ({ ...o, reportUrl: fakeUrl }));
    setReportFileNameByOrder((m) => ({ ...m, [order.id]: file.name }));
    if (order.status === "IN_PROGRESS") updateStatus("REPORT_READY");
    pushActivity(`Report uploaded: ${file.name}`);
  };

  const savePickupWindow = (start: string, end: string) => {
    if (!order) return;
    updateOrder((o) => ({ ...o, pickupWindow: { start, end } }));
    pushActivity(
      `Pickup window set: ${formatDateTimeIST(start)} - ${formatDateTimeIST(
        end
      )}`
    );
    setEditPickup(false);
  };

  const cancelOrder = (reason: string) => {
    if (!order) return;

    // Prevent cancelling terminal states
    if (order.status === "COMPLETED") {
      pushActivity(`Cancel attempted but blocked: Order already Completed.`);
      setShowCancel(false);
      return;
    }
    if (order.status === "CANCELLED") {
      setShowCancel(false);
      return;
    }

    updateOrder((o) => {
      const paymentNext: Payment =
        o.payment.status === "Paid"
          ? { ...o.payment, status: "Refunded" }
          : o.payment; // keep Pending if not paid
      return {
        ...o,
        status: "CANCELLED",
        payment: paymentNext,
        phlebotomist: undefined,
      };
    });

    pushActivity(`Order cancelled. Reason: ${reason}`);
    setShowCancel(false);
  };

// steps that participate in the normal forward flow (no CANCELLED)
const FLOW_STEPS: { key: OrderStatus; label: string }[] = ORDER_STEPS.filter(
  (s) => s.key !== "CANCELLED"
);

const FLOW_INDEX: Record<OrderStatus, number> = FLOW_STEPS.reduce(
  (acc, s, idx) => ((acc[s.key] = idx), acc),
  {} as Record<OrderStatus, number>
);

// Only advance within FLOW_STEPS; never advance to CANCELLED via "Next"
const nextStatus: OrderStatus | null = useMemo(() => {
  if (!order) return null;
  if (order.status === "CANCELLED") return null; // terminal
  const i = FLOW_INDEX[order.status];
  const next = FLOW_STEPS[i + 1]?.key ?? null;
  return next; // will be null after COMPLETED (so no Next→Cancelled button)
}, [order?.status]);


  const totals = useMemo(() => {
    if (!order) return null;
    return {
      subtotal: order.subtotal,
      discount: order.discount,
      deliveryFee: order.deliveryFee,
      total: order.total,
    };
  }, [order]);

  // demo phlebotomists list
  const PHLEBS: Phlebotomist[] = [
    { id: "p1", name: "Rohit Kulkarni", phone: "+91 98XXXXXX01" },
    { id: "p2", name: "Sneha Iyer", phone: "+91 98XXXXXX02" },
    { id: "p3", name: "Manish Gupta", phone: "+91 98XXXXXX03" },
  ];

  // -------- NEW: derive visible orders by filters/sort/search --------
  const visibleOrders = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = orders.filter((o) => {
      const inStatus = statusFilter === "ALL" || o.status === statusFilter;
      const hit =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.patient.name.toLowerCase().includes(q) ||
        o.patient.phone.toLowerCase().includes(q) ||
        o.labName.toLowerCase().includes(q);
      return inStatus && hit;
    });

    list.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "placedAt") {
        return (
          (new Date(a.placedAt).getTime() - new Date(b.placedAt).getTime()) *
          dir
        );
      }
      return (a.total - b.total) * dir;
    });

    return list;
  }, [orders, query, statusFilter, sortKey, sortDir]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-0 sm:p-6 bg-white"
      style={{ paddingTop: "4rem", paddingBottom: "10rem" }}
    >
      <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl max-w-6xl w-full overflow-hidden relative ring-1 ring-red-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-400 text-white py-5 px-4 sm:px-6 shadow-md relative after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/40">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <button
              className="p-2 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition"
              aria-label="Back"
              onClick={() => {
                setSelectedId(null);
                setEditPickup(false);
                setEditPayment(false);
              }}
              title={selectedId ? "Back to Orders" : "Back"}
            >
              <FaArrowLeft size={18} />
            </button>

            {/* Heading with Total Orders */}
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl sm:text-3xl font-extrabold">
                {selectedId ? "Order" : "Orders"}
              </h1>
              {!selectedId && (
                <span className="text-lg sm:text-xl font-medium text-white mt-1">
                  Total Orders{" "}
                  <span className="font-bold text-yellow-300">
                    {orders.length}
                  </span>
                </span>
              )}
            </div>

            {/* Right-side buttons */}
            <div className="flex gap-2 sm:gap-3">
              {selectedId && (
                <>
                  <button
                    className="px-3 sm:px-4 py-2 bg-red-600 rounded-full shadow hover:bg-red-700 flex items-center"
                    onClick={() => window.print()}
                  >
                    <FaPrint className="mr-2" /> Print
                  </button>
                  <button
                    className="px-3 sm:px-4 py-2 bg-red-600 rounded-full shadow hover:bg-red-700 flex items-center"
                    onClick={() => alert("Saved (demo)")}
                  >
                    <FaSave className="mr-2" /> Save
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Order details (when selectedId is true) */}
          {selectedId && order && (
            <div className="mt-3 w-full flex flex-wrap items-center gap-3 justify-center text-center">
              <div className="text-lg sm:text-xl font-medium text-white">
                Order ID{" "}
                <span className="font-mono font-bold text-yellow-300">
                  {order.id}
                </span>
              </div>
              <div className="text-lg sm:text-xl font-medium text-white">
                Placed{" "}
                <span className="font-bold text-yellow-300">
                  {formatDateTimeIST(order.placedAt)}
                </span>
              </div>
              <div className="text-lg sm:text-xl font-medium text-white">
                Lab{" "}
                <span className="font-bold text-yellow-300">
                  {order.labName}
                </span>
              </div>
              <div className="text-lg sm:text-xl font-medium text-white">
                Status <StatusBadge status={order.status} />
              </div>
            </div>
          )}
        </div>

        {/* Decorative sheen */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/60 to-transparent" />

        {/* CONTENT */}
        {!orders.length && (
          <div className="p-12 text-center">
            <div className="text-3xl mb-2">😌 No orders right now</div>
            <div className="text-gray-600">New orders will appear here.</div>
          </div>
        )}

        {/* List view (small cards) */}
        {!selectedId && orders.length > 0 && (
          <div className="p-4 sm:p-6">
            {/* -------- Toolbar -------- */}
            <div className="mb-6 rounded-2xl border border-red-100 bg-gradient-to-r from-white/80 to-red-50/60 backdrop-blur-lg shadow-sm p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Left: Search + filters */}
              <div className="flex-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                {/* Search */}
                <div className="relative w-full sm:flex-1">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="🔎 Search by ID, name, phone, lab…"
                    className="w-full pl-9 pr-4 py-2.5 rounded-full border bg-white/90 border-gray-200 text-sm focus:ring-2 focus:ring-red-300 focus:border-red-300 transition"
                  />
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <FaFilter className="text-gray-400 hidden sm:block" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full sm:w-auto rounded-lg border bg-white/90 border-gray-200 text-sm px-3 py-2 focus:ring-2 focus:ring-red-300 focus:border-red-300 transition"
                    title="Filter by status"
                  >
                    <option value="ALL">All</option>
                    {ORDER_STEPS.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <FaSort className="text-gray-400 hidden sm:block" />
                  <select
                    value={`${sortKey}:${sortDir}`}
                    onChange={(e) => {
                      const [k, d] = e.target.value.split(":") as any;
                      setSortKey(k);
                      setSortDir(d);
                    }}
                    className="w-full sm:w-auto rounded-lg border bg-white/90 border-gray-200 text-sm px-3 py-2 focus:ring-2 focus:ring-red-300 focus:border-red-300 transition"
                    title="Sort"
                  >
                    <option value="placedAt:desc">Newest</option>
                    <option value="placedAt:asc">Oldest</option>
                    <option value="total:desc">Amount (high→low)</option>
                    <option value="total:asc">Amount (low→high)</option>
                  </select>
                </div>
              </div>

              {/* Right: Count */}
              <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-right">
                Showing{" "}
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">
                  {visibleOrders.length}
                </span>
                of{" "}
                <span className="font-semibold text-gray-700">
                  {orders.length}
                </span>
              </div>
            </div>
            {/* -------- /Toolbar -------- */}

            {visibleOrders.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-500">
                No results found. Try adjusting your search or filters.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {visibleOrders.map((o) => (
                  <OrderCard
                    key={o.id}
                    order={o}
                    onOpen={() => setSelectedId(o.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Detail view */}
        {selectedId && order && totals && (
          <div className="p-4 sm:p-6 space-y-6">
            {/* Stepper */}
            <SectionCard
              title={
                <span className="flex items-center gap-2">
                  <FaClipboard /> Order Progress
                </span>
              }
            >
              <Stepper status={order.status} />
              <div className="mt-4 flex flex-wrap gap-2">
                {nextStatus && order.status !== "CANCELLED" && (
                  <button
                    onClick={() => updateStatus(nextStatus)}
                    className="rounded-full bg-red-600 px-4 py-2 text-white font-semibold shadow hover:bg-red-700"
                  >
                    Move to: {humanize(nextStatus)}
                  </button>
                )}
                {order.status === "REPORT_READY" && (
                  <button
                    onClick={() => updateStatus("COMPLETED")}
                    className="rounded-full bg-green-600 px-4 py-2 text-white font-semibold shadow hover:bg-green-700"
                  >
                    Mark Completed
                  </button>
                )}
                {/* Cancel button removed from here */}
              </div>
            </SectionCard>

            {/* Left/Right grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Patient & Contact */}
                <SectionCard
                  title={
                    <span className="flex items-center gap-2">
                      <FaUser /> Patient
                    </span>
                  }
                  right={<StatusBadge status={order.status} />}
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <div className="font-semibold text-gray-800">
                        {order.patient.name} {pill(`${order.patient.age} yrs`)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.patient.gender}
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FaPhone className="mt-1" />
                      <div className="text-sm">
                        <div>{order.patient.phone}</div>
                        {order.patient.email && (
                          <div className="truncate">{order.patient.email}</div>
                        )}
                        <div className="mt-2 flex gap-2">
                          <button className="rounded-full border px-3 py-1 text-xs flex items-center gap-2 hover:bg-red-50">
                            <FaWhatsapp /> WhatsApp
                          </button>
                          <button className="rounded-full border px-3 py-1 text-xs flex items-center gap-2 hover:bg-red-50">
                            <FaEnvelope /> Email
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </SectionCard>

                {/* Address & Pickup */}
                <SectionCard
                  title={
                    <span className="flex items-center gap-2">
                      <FaMapMarkerAlt /> Address & Pickup
                    </span>
                  }
                  right={
                    order.status !== "CANCELLED" && (
                      <button
                        onClick={() => setEditPickup((v) => !v)}
                        className="rounded-full bg-red-600 text-white px-3 py-1 text-xs font-semibold flex items-center gap-2 hover:bg-red-700"
                      >
                        <FaEdit /> {editPickup ? "Close" : "Edit"}
                      </button>
                    )
                  }
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="text-sm">
                      <div className="font-semibold">
                        Delivery / Collection Address
                      </div>
                      <div>{order.address.line1}</div>
                      {order.address.line2 && <div>{order.address.line2}</div>}
                      <div>
                        {order.address.city}, {order.address.state} -{" "}
                        {order.address.pincode}
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold flex items-center gap-2">
                        <FaClock /> Sample Pickup Window
                      </div>
                      {order.pickupWindow ? (
                        <div className="mt-1">
                          {formatDateTimeIST(order.pickupWindow.start)} —{" "}
                          {formatDateTimeIST(order.pickupWindow.end)}
                        </div>
                      ) : (
                        <div className="mt-1 text-gray-500">Not set</div>
                      )}
                    </div>
                  </div>
                  {editPickup && order.status !== "CANCELLED" && (
                    <PickupEditor
                      onSave={savePickupWindow}
                      onCancel={() => setEditPickup(false)}
                    />
                  )}
                </SectionCard>

                {/* Items */}
                <SectionCard
                  title={
                    <span className="flex items-center gap-2">
                      <FaFlask /> Items in Order
                    </span>
                  }
                >
                  <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-red-50 to-red-100 text-red-700">
                          <th className="px-5 py-3 text-left font-semibold">
                            Name
                          </th>
                          <th className="px-5 py-3 text-left font-semibold">
                            Type
                          </th>
                          <th className="px-5 py-3 text-right font-semibold">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {order.items.map((it, idx) => (
                          <tr
                            key={`${it.type}-${it.id}-${idx}`}
                            className={
                              idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }
                          >
                            <td className="px-5 py-3 font-medium text-gray-800">
                              {it.name}
                            </td>
                            <td className="px-5 py-3">{pill(it.type)}</td>
                            <td className="px-5 py-3 text-right font-bold text-red-600">
                              ₹{it.price}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </SectionCard>

                {/* Activity Log */}
                <SectionCard
                  title={
                    <span className="flex items-center gap-2">
                      <FaTruck /> Activity
                    </span>
                  }
                >
                  <div className="space-y-3">
                    <AddNote onAdd={(msg) => pushActivity(msg)} />
                    <ul className="divide-y divide-red-100 border border-red-100 rounded-xl overflow-hidden">
                      {order.activity.map((a, i) => (
                        <li
                          key={i}
                          className="px-4 py-3 bg-white hover:bg-red-50 transition"
                        >
                          <div className="text-xs text-gray-500">
                            {formatDateTimeIST(a.ts)}
                          </div>
                          <div className="text-sm text-gray-800">
                            {a.message}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </SectionCard>
              </div>

              {/* Right column */}
              <div className="space-y-6">
                {/* Assign Phlebotomist */}
                <SectionCard
                  title={
                    <span className="flex items-center gap-2">
                      <FaUserMd /> Assign Phlebotomist
                    </span>
                  }
                >
                  {order.phlebotomist ? (
                    <div className="flex items-start justify-between">
                      <div className="text-sm">
                        <div className="font-semibold">
                          {order.phlebotomist.name}
                        </div>
                        <div className="text-gray-600">
                          {order.phlebotomist.phone}
                        </div>
                      </div>
                      {order.status !== "CANCELLED" && (
                        <button
                          className="rounded-full border px-3 py-1 text-xs hover:bg-red-50"
                          onClick={() =>
                            updateOrder((o) => ({
                              ...o,
                              phlebotomist: undefined,
                            }))
                          }
                        >
                          Change
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      {PHLEBS.map((p) => (
                        <button
                          key={p.id}
                          className="rounded-xl border px-3 py-2 text-left hover:bg-red-50 disabled:opacity-50"
                          onClick={() => assignPhleb(p)}
                          disabled={order.status === "CANCELLED"}
                        >
                          <div className="text-sm font-semibold">{p.name}</div>
                          <div className="text-xs text-gray-600">{p.phone}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </SectionCard>

                {/* Payment */}
                <SectionCard
                  title={
                    <span className="flex items-center gap-2">
                      <FaFileAlt /> Payment
                    </span>
                  }
                  right={
                    order.status !== "CANCELLED" && (
                      <button
                        onClick={() => setEditPayment((v) => !v)}
                        className="rounded-full bg-red-600 text-white px-3 py-1 text-xs font-semibold flex items-center gap-2 hover:bg-red-700"
                      >
                        <FaEdit /> {editPayment ? "Close" : "Edit"}
                      </button>
                    )
                  }
                >
                  <div className="text-sm space-y-1">
                    <div>
                      Method:{" "}
                      <span className="font-semibold">
                        {order.payment.method}
                      </span>
                    </div>
                    <div>
                      Status:{" "}
                      {pill(
                        order.payment.status,
                        order.payment.status === "Paid"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : order.payment.status === "Refunded"
                          ? "bg-gray-50 text-gray-700 border-gray-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      )}
                    </div>
                    {order.payment.txnId && (
                      <div>
                        Txn ID:{" "}
                        <span className="font-mono">{order.payment.txnId}</span>
                      </div>
                    )}
                  </div>
                  {editPayment && order.status !== "CANCELLED" && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={markPaid}
                        className="rounded-full bg-green-600 text-white px-4 py-2 text-sm font-semibold hover:bg-green-700"
                      >
                        Mark Paid
                      </button>
                      <button
                        onClick={() =>
                          updateOrder((o) => ({
                            ...o,
                            payment: { ...o.payment, status: "Refunded" },
                          }))
                        }
                        className="rounded-full bg-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-300"
                      >
                        Mark Refunded
                      </button>
                    </div>
                  )}
                </SectionCard>

                {/* Upload Report */}
                <SectionCard
                  title={
                    <span className="flex items-center gap-2">
                      <FaPaperclip /> Upload Report
                    </span>
                  }
                >
                  {order.status === "CANCELLED" ? (
                    <div className="text-sm text-gray-600">
                      Order is cancelled. Uploads are disabled.
                    </div>
                  ) : order.reportUrl ? (
                    <div className="text-sm">
                      <div className="mb-2">
                        Uploaded:{" "}
                        <span className="font-semibold">
                          {reportFileNameByOrder[order.id] ?? "report.pdf"}
                        </span>
                      </div>
                      <a
                        className="underline text-red-600"
                        href={order.reportUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open report
                      </a>
                      <div className="mt-3 flex gap-2">
                        <button
                          className="rounded-full border px-3 py-1 text-xs hover:bg-red-50"
                          onClick={() =>
                            updateOrder((o) => ({ ...o, reportUrl: undefined }))
                          }
                        >
                          Replace
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-red-200 rounded-xl p-6 cursor-pointer hover:bg-red-50">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) uploadReport(f);
                        }}
                      />
                      <div className="text-sm text-gray-700">
                        Drag & drop or click to upload PDF/Image
                      </div>
                    </label>
                  )}
                </SectionCard>

                {/* Totals */}
                <SectionCard
                  title={
                    <span className="flex items-center gap-2">
                      <FaCheckCircle /> Summary
                    </span>
                  }
                >
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold">₹{totals.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span className="font-semibold text-green-700">
                        -₹{totals.discount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Collection/Delivery</span>
                      <span className="font-semibold">
                        ₹{totals.deliveryFee}
                      </span>
                    </div>
                    <div className="h-px bg-gray-200" />
                    <div className="flex justify-between text-lg font-extrabold">
                      <span>Total</span>
                      <span className="text-red-600">₹{totals.total}</span>
                    </div>
                  </div>
                </SectionCard>

                {/* Customer Instructions */}
                {order.instructions && (
                  <SectionCard
                    title={
                      <span className="flex items-center gap-2">
                        <FaEdit /> Customer Instructions
                      </span>
                    }
                  >
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                      {order.instructions}
                    </div>
                  </SectionCard>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Screen-level floating quick actions — ONLY in detail view */}
      {selectedId && order && (
        <div className="fixed bottom-14 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-xs sm:max-w-md px-3">
          <div className="bg-white/85 backdrop-blur shadow-lg ring-1 ring-red-100 rounded-full px-2 py-1.5 flex gap-2 justify-center">
            {nextStatus && order.status !== "CANCELLED" && (
              <button
                onClick={() => updateStatus(nextStatus)}
                className="flex-1 rounded-full bg-red-600 text-white 
                     px-3 sm:px-4 py-1.5 sm:py-2 
                     text-xs sm:text-sm font-medium 
                     shadow hover:bg-red-700 transition"
              >
                Next: {humanize(nextStatus)}
              </button>
            )}

            {order.status === "REPORT_READY" && (
              <button
                onClick={() => updateStatus("COMPLETED")}
                className="flex-1 rounded-full bg-green-600 text-white 
                     px-3 sm:px-4 py-1.5 sm:py-2 
                     text-xs sm:text-sm font-medium 
                     shadow hover:bg-green-700 transition"
              >
                Complete
              </button>
            )}

            {order.status !== "COMPLETED" && order.status !== "CANCELLED" && (
              <button
                onClick={() => setShowCancel(true)}
                className="flex-1 rounded-full bg-white text-red-700 
                     px-3 sm:px-4 py-1.5 sm:py-2 
                     text-xs sm:text-sm font-medium 
                     shadow-inner ring-1 ring-red-200 
                     hover:bg-red-50 transition"
                title="Cancel this order"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* Cancel modal */}
      {showCancel && order && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-red-100 hover:bg-red-200"
              onClick={() => setShowCancel(false)}
              aria-label="Close"
            >
              <FaTimes />
            </button>
            <h3 className="text-xl font-bold text-red-700 mb-2">
              Cancel Order
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Add a brief reason to keep the audit trail clean.
            </p>
            <CancelForm onCancel={(r) => cancelOrder(r)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantOrderManager;
