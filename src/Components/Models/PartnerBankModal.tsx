// src/Components/Models/PartnerBankModal.tsx
import React from "react";
import {
  FaTimes,
  FaUniversity,
  FaIdCard,
  FaHashtag,
  FaInfoCircle,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaBuilding,
} from "react-icons/fa";

type Status = "PENDING" | "VERIFIED" | "REJECTED";

function StatusChip({ status }: { status: Status }) {
  if (status === "VERIFIED") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-sm rounded-full bg-green-100 text-green-700 border border-green-200">
        <FaCheckCircle /> Verified
      </span>
    );
  }
  if (status === "REJECTED") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-sm rounded-full bg-red-100 text-red-700 border border-red-200">
        <FaTimesCircle /> Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 text-sm rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
      <FaClock /> Pending
    </span>
  );
}

export interface PartnerBankModalProps {
  isOpen: boolean;
  onClose: () => void;

  // state from hook (passed by Dashboard)
  loading: boolean;
  submitting: boolean;
  error: string | null;
  success: string | null;

  statusChipStatus: Status;
  rejectionReasonFromServer?: string;

  holderName: string;
  setHolderName: (v: string) => void;

  bankName: string;
  setBankName: (v: string) => void;

  accountNo: string;
  setAccountNo: (v: string) => void;

  accountNoMasked?: string;

  ifsc: string;
  setIfsc: (v: string) => void;

  onSubmit: () => void;
}

const PartnerBankModal: React.FC<PartnerBankModalProps> = ({
  isOpen,
  onClose,

  loading,
  submitting,
  error,
  success,

  statusChipStatus,
  rejectionReasonFromServer,

  holderName,
  setHolderName,

  bankName,
  setBankName,

  accountNo,
  setAccountNo,

  accountNoMasked,

  ifsc,
  setIfsc,

  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur">
      <div className="w-full max-w-lg bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-2xl border border-red-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-br from-white to-red-50 rounded-t-2xl">
          <h2 className="text-lg sm:text-xl font-extrabold text-red-700 tracking-tight flex items-center gap-2">
            <FaUniversity className="text-red-600" /> Bank Details
          </h2>
          <div className="flex items-center gap-2">
            <StatusChip status={statusChipStatus} />
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-red-100 hover:bg-red-200 focus:outline-none"
              aria-label="Close"
            >
              <FaTimes size={18} className="text-red-600" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* server messages */}
          {rejectionReasonFromServer && !loading && (
            <div className="mb-3 text-sm px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700">
              <FaInfoCircle className="inline mr-1" />
              <strong>Rejected:</strong> {rejectionReasonFromServer}
            </div>
          )}
          {success && !loading && (
            <div className="mb-3 text-sm px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-green-700">
              <FaCheckCircle className="inline mr-1" />
              {success}
            </div>
          )}
          {error && !loading && (
            <div className="mb-3 text-sm px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700">
              <FaTimesCircle className="inline mr-1" />
              {error}
            </div>
          )}

          {/* Skeleton or Form */}
          {loading ? (
            // ---- Skeleton loader ----
            <div className="animate-pulse space-y-4">
              {/* Holder Name */}
              <div className="space-y-2">
                <div className="h-3 w-32 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded-lg"></div>
              </div>
              {/* Bank Name */}
              <div className="space-y-2">
                <div className="h-3 w-28 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded-lg"></div>
              </div>
              {/* Account Number */}
              <div className="space-y-2">
                <div className="h-3 w-40 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded-lg"></div>
                <div className="h-3 w-64 bg-gray-200 rounded"></div>
              </div>
              {/* IFSC */}
              <div className="space-y-2">
                <div className="h-3 w-20 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded-lg"></div>
              </div>
              {/* Info text */}
              <div className="h-3 w-56 bg-gray-200 rounded"></div>
            </div>
          ) : (
            // ---- Form ----
            <div className="space-y-3">
              {/* Holder Name */}
              <label className="block">
                <span className="text-xs text-gray-600">Account Holder Name</span>
                <div className="mt-1 flex items-center gap-2">
                  <FaIdCard className="text-gray-400" />
                  <input
                    type="text"
                    className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-300"
                    placeholder="e.g., Ramesh Kumar"
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                  />
                </div>
              </label>

              {/* Bank Name */}
              <label className="block">
                <span className="text-xs text-gray-600">Bank Name</span>
                <div className="mt-1 flex items-center gap-2">
                  <FaBuilding className="text-gray-400" />
                  <input
                    type="text"
                    className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-300"
                    placeholder="e.g., HDFC Bank"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>
              </label>

              {/* Account Number */}
              <label className="block">
                <span className="text-xs text-gray-600">
                  Account Number{" "}
                  {accountNoMasked ? (
                    <em className="text-gray-400">(saved: {accountNoMasked})</em>
                  ) : null}
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <FaHashtag className="text-gray-400" />
                  <input
                    type="text"
                    className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-300"
                    placeholder="Enter full account number"
                    value={accountNo}
                    onChange={(e) => setAccountNo(e.target.value)}
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  For security, please re-enter the complete number when updating.
                </p>
              </label>

              {/* IFSC */}
              <label className="block">
                <span className="text-xs text-gray-600">IFSC</span>
                <div className="mt-1 flex items-center gap-2">
                  <FaUniversity className="text-gray-400" />
                  <input
                    type="text"
                    className="flex-1 rounded-lg border px-3 py-2 text-sm uppercase outline-none focus:ring-2 focus:ring-red-300"
                    placeholder="HDFC0001234"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                  />
                </div>
              </label>

              <div className="text-[11px] text-gray-500 mt-1 flex items-start gap-2">
                <FaInfoCircle className="mt-0.5" />
                <span>
                  Submitting changes sets status to <strong>Pending</strong> until a SuperAdmin verifies.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t bg-gradient-to-br from-white to-red-50 rounded-b-2xl flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            disabled={submitting}
          >
            Close
          </button>
          <button
            onClick={onSubmit}
            disabled={submitting || loading}
            className={`rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow ${
              submitting || loading ? "opacity-70 cursor-wait" : "hover:bg-red-700"
            }`}
          >
            {submitting ? "Saving..." : loading ? "Loading..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PartnerBankModal);
