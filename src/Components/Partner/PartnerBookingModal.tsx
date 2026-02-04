import React, { useEffect, useMemo, useState } from "react";
import {
  FaPlus,
  FaTimes,
  FaTrash,
  FaCheckCircle,
} from "react-icons/fa";

export type SelectedItem = {
  id: string;
  name: string;
  type: "test" | "package";
  b2pPrice: number;
  b2cPrice: number;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: SelectedItem[];
  setSelectedItems: React.Dispatch<React.SetStateAction<SelectedItem[]>>;
  partnerPromoCode: string;
};

const PartnerBookingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedItems,
  setSelectedItems,
  partnerPromoCode,
}) => {
  /* ---------------- PATIENT STATE ---------------- */
  const [patient, setPatient] = useState({
    name: "",
    age: "",
    mobile: "",
    paymentMode: "COLLECT" as "PAID" | "COLLECT",
    promoCode: partnerPromoCode,
    amount: "",
  });

  /* keep promo code synced */
  useEffect(() => {
    setPatient((p) => ({ ...p, promoCode: partnerPromoCode }));
  }, [partnerPromoCode]);

  /* ---------------- TOTAL ---------------- */
  const totalAmount = useMemo(
    () => selectedItems.reduce((sum, i) => sum + i.b2cPrice, 0),
    [selectedItems],
  );

  /* ---------------- VALIDATION ---------------- */
  const isFormValid = useMemo(() => {
    return (
      patient.name.trim() !== "" &&
      patient.age.trim() !== "" &&
      patient.mobile.trim() !== "" &&
      patient.amount.trim() !== "" &&
      selectedItems.length > 0
    );
  }, [patient, selectedItems]);

  /* ---------------- UI ---------------- */
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-all duration-200
        ${
          isOpen
            ? "bg-black/60 backdrop-blur-sm opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
    >
      <div
        className={`bg-white w-full max-w-xl h-[80vh] rounded-3xl shadow-2xl 
        flex flex-col overflow-hidden transform transition-all duration-200
        ${isOpen ? "scale-100" : "scale-95"}`}
      >
        {/* HEADER */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-red-600 via-red-500 to-red-400 text-white">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,white,transparent)]" />
          <div className="relative flex justify-between items-center">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">
                Partner Booking
              </h2>
              <p className="text-xs opacity-90 mt-1">
                Create booking on behalf of patient
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-gradient-to-b from-gray-50 to-white">
          {/* PATIENT DETAILS */}
          <section className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-red-500 space-y-4">
            <h3 className="font-bold text-gray-800">Patient Details</h3>

            <input
              placeholder="Patient Name *"
              className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-400"
              value={patient.name}
              onChange={(e) =>
                setPatient({ ...patient, name: e.target.value })
              }
            />

            <div className="flex gap-3">
              <input
                placeholder="Age *"
                className="w-1/3 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-400"
                value={patient.age}
                onChange={(e) =>
                  setPatient({ ...patient, age: e.target.value })
                }
              />
              <input
                placeholder="Mobile Number *"
                className="w-2/3 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-400"
                value={patient.mobile}
                onChange={(e) =>
                  setPatient({ ...patient, mobile: e.target.value })
                }
              />
            </div>
          </section>

          {/* PAYMENT */}
          <section className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-red-500 space-y-4">
            <h3 className="font-bold text-gray-800">Payment Details</h3>

            <div className="flex gap-4">
              {[
                { key: "PAID", label: "Already Paid" },
                { key: "COLLECT", label: "Need to Collect" },
              ].map((opt) => (
                <label
                  key={opt.key}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer border transition-all
                    ${
                      patient.paymentMode === opt.key
                        ? "border-red-600 bg-red-50 text-red-700 shadow-sm"
                        : "border-gray-300 text-gray-600 hover:border-red-300"
                    }`}
                >
                  <input
                    type="radio"
                    className="hidden"
                    checked={patient.paymentMode === opt.key}
                    onChange={() =>
                      setPatient({
                        ...patient,
                        paymentMode: opt.key as "PAID" | "COLLECT",
                      })
                    }
                  />
                  <FaCheckCircle
                    className={
                      patient.paymentMode === opt.key
                        ? "text-red-600"
                        : "text-gray-300"
                    }
                  />
                  {opt.label}
                </label>
              ))}
            </div>

            <input
              type="number"
              placeholder={
                patient.paymentMode === "PAID"
                  ? "Amount Collected *"
                  : "Amount to Collect *"
              }
              className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-400"
              value={patient.amount}
              onChange={(e) =>
                setPatient({ ...patient, amount: e.target.value })
              }
            />

            <input
              placeholder="Partner Promo Code"
              className="w-full border rounded-xl px-4 py-2.5 bg-gray-50"
              value={patient.promoCode}
              disabled
            />
          </section>

          {/* SELECTED ITEMS */}
          <section className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-red-500 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-800">
                Selected Tests / Packages
              </h3>
              <button
                onClick={onClose}
                className="text-sm text-red-600 flex items-center gap-1 hover:underline"
              >
                <FaPlus /> Add More
              </button>
            </div>

            {selectedItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border rounded-xl px-4 py-2.5 hover:bg-red-50 transition"
              >
                <span className="font-medium">{item.name}</span>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-800">
                    ₹{item.b2cPrice}
                  </span>
                  <button
                    onClick={() =>
                      setSelectedItems((prev) =>
                        prev.filter((i) => i.id !== item.id),
                      )
                    }
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t bg-white flex justify-between items-center">
          <span className="font-extrabold text-lg text-gray-800">
            Total: ₹{totalAmount}
          </span>
          <button
            disabled={!isFormValid}
            className={`px-8 py-2.5 rounded-full font-bold tracking-wide transition-all
              ${
                isFormValid
                  ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg hover:scale-[1.02]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            Create Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartnerBookingModal;
