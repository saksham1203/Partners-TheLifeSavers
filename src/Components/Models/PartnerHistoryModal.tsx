// src/components/modals/PartnerHistoryModal.tsx
import React from "react";
import {
  FaTimes,
  FaRupeeSign,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";

export type PaymentStatus = "paid" | "pending" | "unpaid";

export interface CycleHistoryItem {
  id: string; // stable id from backend (or `${start}-${end}` fallback)
  startDate: string; // ISO date
  endDate: string; // ISO date
  totalPatients: number;
  totalCommission: number; // in rupees
  paymentStatus: PaymentStatus;
  paymentRef?: string | null; // txn id / UTR
  paidAt?: string | null; // ISO date if paid
}

export interface PartnerHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  cycles: CycleHistoryItem[];
}

/* ----------------------------- helpers ---------------------------------- */

const statusClasses: Record<PaymentStatus, string> = {
  paid: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  unpaid: "bg-red-100 text-red-700 border-red-200",
};

const statusIcon: Record<PaymentStatus, React.ReactNode> = {
  paid: <FaCheckCircle className="inline -mt-0.5" />,
  pending: <FaClock className="inline -mt-0.5" />,
  unpaid: <FaTimesCircle className="inline -mt-0.5" />,
};

const formatDate = (iso?: string | null) =>
  iso ? new Date(iso).toDateString() : "—";

const currency = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <FaCalendarAlt className="text-red-300" size={36} />
    <p className="mt-2 text-sm text-gray-500">No previous cycles yet.</p>
  </div>
);

/* ------------------------------ component -------------------------------- */

const PartnerHistoryModal: React.FC<PartnerHistoryModalProps> = ({
  isOpen,
  onClose,
  cycles,
}) => {
  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur">
      {/* fixed height container; only body scrolls */}
      <div className="w-full max-w-2xl sm:max-w-3xl h-[86vh] sm:h-[82vh] bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-2xl border border-red-100 flex flex-col overflow-hidden">
        {/* header (non-scrollable) */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b bg-gradient-to-br from-white to-red-50">
          <h2 className="text-base sm:text-lg font-extrabold text-red-700 tracking-tight flex items-center gap-2">
            <FaCalendarAlt className="text-red-600" />
            <span>Referral Cycle History</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-red-100 hover:bg-red-200 focus:outline-none"
            aria-label="Close history"
          >
            <FaTimes size={18} className="text-red-600" />
          </button>
        </div>

        {/* body (scrollable) */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4">
          {sorted.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {sorted.map((c, _idx) => (
                <div
                  key={c.id}
                  className="relative rounded-xl border border-red-100 bg-white shadow-sm hover:shadow-md transition"
                >
                  {/* subtle accent bar on the left for visual interest */}
                  <span className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-gradient-to-b from-red-400 to-orange-300" />

                  <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4">
                    {/* Dates */}
                    <div className="sm:col-span-5 order-1">
                      <div className="text-[11px] sm:text-xs text-gray-500 uppercase tracking-wide">
                        Cycle
                      </div>
                      <div className="mt-0.5 font-semibold text-gray-900 text-sm sm:text-base">
                        {formatDate(c.startDate)}{" "}
                        <span className="text-gray-400">→</span>{" "}
                        {formatDate(c.endDate)}
                      </div>
                    </div>

                    {/* Patients */}
                    <div className="sm:col-span-2 order-3 sm:order-2">
                      <div className="text-[11px] sm:text-xs text-gray-500 uppercase tracking-wide">
                        Patients
                      </div>
                      <div className="mt-0.5 text-base sm:text-lg font-bold text-red-700">
                        {c.totalPatients}
                      </div>
                    </div>

                    {/* Commission */}
                    <div className="sm:col-span-3 order-4 sm:order-3">
                      <div className="text-[11px] sm:text-xs text-gray-500 uppercase tracking-wide">
                        Commission
                      </div>
                      <div className="mt-0.5 text-base sm:text-lg font-extrabold text-green-700 flex items-center gap-1">
                        <FaRupeeSign />
                        <span>{currency(c.totalCommission).replace("₹", "")}</span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="sm:col-span-2 order-2 sm:order-4 sm:flex sm:justify-end">
                      <div
                        className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full border text-xs sm:text-sm font-semibold ${statusClasses[c.paymentStatus]}`}
                        title={c.paymentStatus}
                      >
                        {statusIcon[c.paymentStatus]}
                        <span className="capitalize">{c.paymentStatus}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer meta row */}
                  {(c.paymentRef || c.paidAt) && (
                    <div className="px-3 sm:px-4 pb-3 text-[11px] sm:text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                      {c.paymentRef && (
                        <span>
                          Ref:{" "}
                          <span className="font-mono text-gray-700 break-all">
                            {c.paymentRef}
                          </span>
                        </span>
                      )}
                      {c.paidAt && (
                        <span>
                          Paid on:{" "}
                          <span className="text-gray-700">
                            {formatDate(c.paidAt)}
                          </span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* footer (non-scrollable) */}
        <div className="px-4 sm:px-6 py-3 sm:py-3 border-t bg-gradient-to-br from-white to-red-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-xs sm:text-sm text-gray-600">
              Cycles:{" "}
              <span className="font-semibold text-gray-800">{sorted.length}</span>
              <span className="mx-2 hidden sm:inline">•</span>
              <span className="block sm:inline">
                Patients:{" "}
                <span className="font-semibold text-red-700">
                  {totals.patients}
                </span>
              </span>
              <span className="mx-2 hidden sm:inline">•</span>
              <span className="block sm:inline">
                Commission:{" "}
                <span className="font-extrabold text-green-700">
                  {currency(totals.commission)}
                </span>
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
