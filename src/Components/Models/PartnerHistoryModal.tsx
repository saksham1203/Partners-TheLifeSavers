import React from "react";
import {
  FaTimes,
  FaRupeeSign,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaReceipt,
  FaAngleDoubleDown,
} from "react-icons/fa";
import { fetchPartnerReferralsByCycle } from "../../services/partnerService";

export type PaymentStatus = "paid" | "pending" | "cancelled" | "unpaid";

export interface CycleHistoryItem {
  id: string;
  workingCycleId?: string;
  startDate: string;
  endDate: string;
  totalPatients: number;
  totalCommission: number;
  paymentStatus: PaymentStatus;
  paymentRef?: string | null;
  paidAt?: string | null;
}

export interface PartnerHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  cycles: CycleHistoryItem[];
}

type ReferralItem = {
  id: string;
  orderId: string;
  patientName: string;
  status: string;
  total: number;
  partnerMargin?: number;
  commissionGranted?: number;
  commissionState?: string;
  createdAt: string;
};

const INITIAL_REFERRALS_LIMIT = 5;
const LOAD_MORE_REFERRALS_LIMIT = 10;

const statusClasses: Record<PaymentStatus, string> = {
  paid: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  cancelled: "bg-gray-100 text-gray-700 border-gray-200",
  unpaid: "bg-red-100 text-red-700 border-red-200",
};

const statusIcon: Record<PaymentStatus, React.ReactNode> = {
  paid: <FaCheckCircle className="inline -mt-0.5" />,
  pending: <FaClock className="inline -mt-0.5" />,
  cancelled: <FaTimesCircle className="inline -mt-0.5" />,
  unpaid: <FaTimesCircle className="inline -mt-0.5" />,
};

const referralStatusClasses = (status?: string) => {
  switch ((status ?? "").toUpperCase()) {
    case "COMPLETED":
      return "bg-green-100 text-green-700 border-green-200";
    case "CANCELLED":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
  }
};

const commissionStateClasses = (state?: string) => {
  switch ((state ?? "").toUpperCase()) {
    case "GRANTED":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "PENDING":
      return "bg-amber-100 text-amber-700 border-amber-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
};

const formatDate = (iso?: string | null) =>
  iso ? new Date(iso).toDateString() : "-";
const formatDateTime = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "-";
const formatPaymentRef = (ref?: string | null) =>
  ref === "AUTO_ZERO_EARNING_CYCLE" ? "Auto-cancelled (0 earning)" : ref;

const currency = (n: number) => `Rs ${n.toLocaleString("en-IN")}`;

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <FaCalendarAlt className="text-red-300" size={36} />
    <p className="mt-2 text-sm text-gray-500">No previous cycles yet.</p>
  </div>
);

const PartnerHistoryModal: React.FC<PartnerHistoryModalProps> = ({
  isOpen,
  onClose,
  cycles,
}) => {
  const [expandedCycleId, setExpandedCycleId] = React.useState<string | null>(null);
  const [referrals, setReferrals] = React.useState<ReferralItem[]>([]);
  const [nextCursor, setNextCursor] = React.useState<string | null>(null);
  const [loadingReferrals, setLoadingReferrals] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [referralsError, setReferralsError] = React.useState<string | null>(null);
  const requestCounterRef = React.useRef(0);

  const sorted = [...cycles].sort(
    (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
  );

  const totals = sorted.reduce(
    (acc, c) => {
      acc.patients += c.totalPatients;
      acc.commission += c.totalCommission;
      return acc;
    },
    { patients: 0, commission: 0 }
  );

  const loadReferrals = React.useCallback(async (workingCycleId: string, cursor?: string) => {
    const requestId = ++requestCounterRef.current;
    if (cursor) setLoadingMore(true);
    else setLoadingReferrals(true);
    setReferralsError(null);
    try {
      const limit = cursor ? LOAD_MORE_REFERRALS_LIMIT : INITIAL_REFERRALS_LIMIT;
      const res = await fetchPartnerReferralsByCycle(workingCycleId, limit, cursor);
      if (requestId !== requestCounterRef.current) return;
      const incoming = res.referrals ?? [];
      setReferrals((prev) => (cursor ? [...prev, ...incoming] : incoming));
      setNextCursor(res.nextCursor ?? null);
    } catch {
      if (requestId !== requestCounterRef.current) return;
      if (!cursor) setReferrals([]);
      setReferralsError("Failed to load referrals for this cycle.");
    } finally {
      if (requestId !== requestCounterRef.current) return;
      setLoadingReferrals(false);
      setLoadingMore(false);
    }
  }, []);

  const onCycleClick = React.useCallback(
    (cycle: CycleHistoryItem) => {
      if (expandedCycleId === cycle.id) {
        setExpandedCycleId(null);
        setReferrals([]);
        setNextCursor(null);
        setReferralsError(null);
        return;
      }
      setExpandedCycleId(cycle.id);
      setReferrals([]);
      setNextCursor(null);
      setReferralsError(null);
      void loadReferrals(cycle.workingCycleId ?? cycle.id);
    },
    [expandedCycleId, loadReferrals]
  );

  const onLoadMore = React.useCallback(() => {
    if (!expandedCycleId || !nextCursor || loadingReferrals || loadingMore) return;
    const cycle = sorted.find((item) => item.id === expandedCycleId);
    if (!cycle) return;
    void loadReferrals(cycle.workingCycleId ?? cycle.id, nextCursor);
  }, [expandedCycleId, nextCursor, loadingReferrals, loadingMore, sorted, loadReferrals]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur">
      <div className="w-full max-w-2xl sm:max-w-3xl h-[86vh] sm:h-[82vh] mt-6 sm:mt-0 bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-2xl border border-red-100 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b bg-gradient-to-br from-white to-red-50">
          <h2 className="text-base sm:text-lg font-extrabold text-red-700 flex items-center gap-2">
            <FaCalendarAlt className="text-red-600" />
            Referral Cycle History
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-red-100 hover:bg-red-200"
          >
            <FaTimes size={18} className="text-red-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4">
          {sorted.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {sorted.map((c) => (
                <div
                  key={c.id}
                  className="relative rounded-xl border border-red-100 bg-white shadow-sm hover:shadow-md transition"
                >
                  <span className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-gradient-to-b from-red-400 to-orange-300" />

                  <button
                    type="button"
                    onClick={() => onCycleClick(c)}
                    className="w-full p-3 sm:p-4 text-left"
                  >
                    <div className="flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-4">
                      <div className="sm:col-span-5">
                        <div className="text-[11px] sm:text-xs text-gray-500 uppercase tracking-wide">
                          Cycle
                        </div>
                        <div className="mt-0.5 font-semibold text-gray-900 text-sm sm:text-base">
                          {formatDate(c.startDate)}
                          <span className="text-gray-400"> - </span>
                          {formatDate(c.endDate)}
                        </div>
                      </div>

                      <div className="sm:hidden flex justify-between items-center">
                        <div>
                          <div className="text-[11px] text-gray-500 uppercase">Patients</div>
                          <div className="text-base font-bold text-red-700">{c.totalPatients}</div>
                        </div>
                        <div>
                          <div className="text-[11px] text-gray-500 uppercase">Commission</div>
                          <div className="text-base font-extrabold text-green-700 flex items-center gap-1">
                            <FaRupeeSign />
                            {currency(c.totalCommission).replace("Rs ", "")}
                          </div>
                        </div>
                      </div>

                      <div className="hidden sm:block sm:col-span-2">
                        <div className="text-xs text-gray-500 uppercase">Patients</div>
                        <div className="text-lg font-bold text-red-700">{c.totalPatients}</div>
                      </div>

                      <div className="hidden sm:block sm:col-span-3">
                        <div className="text-xs text-gray-500 uppercase">Commission</div>
                        <div className="text-lg font-extrabold text-green-700 flex items-center gap-1">
                          <FaRupeeSign />
                          {currency(c.totalCommission).replace("Rs ", "")}
                        </div>
                      </div>

                      <div className="sm:col-span-2 sm:flex sm:justify-end">
                        <div
                          className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full border text-xs sm:text-sm font-semibold ${statusClasses[c.paymentStatus]}`}
                        >
                          {statusIcon[c.paymentStatus]}
                          <span className="capitalize">{c.paymentStatus}</span>
                        </div>
                      </div>
                    </div>

                    {(c.paymentRef || c.paidAt) && (
                      <div className="mt-2 px-1 text-[11px] sm:text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                        {c.paymentRef && (
                          <span>
                            Ref:{" "}
                            <span className="font-mono text-gray-700 break-all">
                              {formatPaymentRef(c.paymentRef)}
                            </span>
                          </span>
                        )}
                        {c.paidAt && (
                          <span>
                            Paid on:{" "}
                            <span className="text-gray-700">{formatDate(c.paidAt)}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </button>

                  {expandedCycleId === c.id && (
                    <div className="border-t border-red-100 px-3 sm:px-4 pb-5 sm:pb-6 bg-gradient-to-br from-rose-50/70 via-white to-orange-50/60">
                      <div className="pt-4 pb-3 flex items-center justify-between gap-2">
                        <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-red-700">Cycle Referrals</div>
                        {nextCursor ? (
                          <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-orange-700">
                            More records
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                            Up to date
                          </span>
                        )}
                      </div>

                      {loadingReferrals ? (
                        <div className="py-8 flex flex-col items-center justify-center gap-3 text-center">
                          <div className="h-8 w-8 rounded-full border-2 border-red-200 border-t-red-600 animate-spin" />
                          <div className="text-sm font-medium text-gray-600">Loading referrals...</div>
                        </div>
                      ) : referralsError ? (
                        <div className="py-6 text-center text-sm text-red-600">{referralsError}</div>
                      ) : referrals.length === 0 ? (
                        <div className="py-6 text-center text-sm text-gray-500">No referrals found for this cycle.</div>
                      ) : (
                        <div className="mt-2 grid grid-cols-1 gap-3">
                          {referrals.map((r) => (
                            <div key={r.id} className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-red-100/70 transition hover:shadow-md hover:ring-red-200">
                              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-400" />
                              <div className="p-4 sm:p-5">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                  <div className="min-w-0">
                                    <div className="text-[11px] uppercase tracking-[0.15em] text-gray-500">Patient Name</div>
                                    <div className="mt-0.5 text-base sm:text-lg font-bold text-slate-900 truncate">{r.patientName}</div>
                                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
                                      <span className="inline-flex items-center gap-1.5">
                                        <FaReceipt className="text-red-500" />
                                        <span className="font-mono text-slate-700">{r.orderId}</span>
                                      </span>
                                      <span className="text-gray-300">•</span>
                                      <span>{formatDateTime(r.createdAt)}</span>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${referralStatusClasses(r.status)}`}>
                                      {r.status}
                                    </span>
                                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${commissionStateClasses(r.commissionState)}`}>
                                      {r.commissionState ?? "NA"}
                                    </span>
                                  </div>
                                </div>

                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                  <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                                    <div className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Total</div>
                                    <div className="mt-1 text-base font-extrabold text-slate-900">{currency(r.total)}</div>
                                  </div>
                                  <div className="rounded-xl bg-orange-50 px-3 py-2.5">
                                    <div className="text-[10px] uppercase tracking-[0.12em] text-orange-700">Partner Margin</div>
                                    <div className="mt-1 text-base font-extrabold text-orange-800">{currency(r.partnerMargin ?? 0)}</div>
                                  </div>
                                  <div className="rounded-xl bg-emerald-50 px-3 py-2.5">
                                    <div className="text-[10px] uppercase tracking-[0.12em] text-emerald-700">Commission Granted</div>
                                    <div className="mt-1 text-base font-extrabold text-emerald-800">{currency(r.commissionGranted ?? 0)}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {nextCursor && !loadingReferrals && !referralsError && (
                        <div className="mt-5 mb-4 flex justify-center">
                          <button
                            type="button"
                            onClick={onLoadMore}
                            disabled={loadingMore}
                            className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold tracking-wide transition-all ${
                              loadingMore
                                ? "cursor-wait bg-red-200 text-white shadow-inner"
                                : "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                            }`}
                          >
                            {loadingMore ? (
                              <>
                                <span className="h-4 w-4 rounded-full border-2 border-white/60 border-t-white animate-spin" />
                                Loading...
                              </>
                            ) : (
                              <>
                                <FaAngleDoubleDown className="text-[13px]" />
                                Load More
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 sm:px-6 py-3 border-t bg-gradient-to-br from-white to-red-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-xs sm:text-sm text-gray-600">
              Cycles: <span className="font-semibold">{sorted.length}</span>
              <span className="mx-2 hidden sm:inline">|</span>
              <span className="block sm:inline">
                Patients:{" "}
                <span className="font-semibold text-red-700">{totals.patients}</span>
              </span>
              <span className="mx-2 hidden sm:inline">|</span>
              <span className="block sm:inline">
                Commission:{" "}
                <span className="font-extrabold text-green-700">{currency(totals.commission)}</span>
              </span>
            </div>

            <div className="text-[11px] sm:text-xs text-gray-500">
              * Payments reflect settlement status per cycle
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PartnerHistoryModal);
