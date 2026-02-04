import React, { useEffect, useState } from "react";
import { FaPlus, FaTimes, FaTrash } from "react-icons/fa";

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
  initialItem: SelectedItem | null;
  partnerPromoCode: string;
};

const PartnerBookingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialItem,
  partnerPromoCode,
}) => {
  const [patient, setPatient] = useState({
    name: "",
    age: "",
    mobile: "",
    paymentMode: "COLLECT" as "PAID" | "COLLECT",
    promoCode: partnerPromoCode,
  });

  const [items, setItems] = useState<SelectedItem[]>([]);

  // ✅ Add item helper (prevents duplicates)
  const addItem = (item: SelectedItem) => {
    setItems((prev) => {
      if (prev.find((p) => p.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  // ✅ Sync initial item when modal opens / changes
  useEffect(() => {
    if (initialItem) {
      addItem(initialItem);
    }
  }, [initialItem]);

  // ✅ Reset modal state on close
  useEffect(() => {
    if (!isOpen) {
      setItems([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, i) => sum + (i?.b2cPrice ?? 0), 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-bold">Partner Booking</h2>
          <button onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Patient Details */}
          <div className="space-y-3">
            <h3 className="font-semibold">Patient Details</h3>

            <input
              placeholder="Patient Name"
              className="w-full border rounded-lg px-4 py-2"
              value={patient.name}
              onChange={(e) => setPatient({ ...patient, name: e.target.value })}
            />

            <div className="flex gap-3">
              <input
                placeholder="Age"
                className="w-1/3 border rounded-lg px-4 py-2"
                value={patient.age}
                onChange={(e) =>
                  setPatient({ ...patient, age: e.target.value })
                }
              />
              <input
                placeholder="Mobile Number"
                className="w-2/3 border rounded-lg px-4 py-2"
                value={patient.mobile}
                onChange={(e) =>
                  setPatient({ ...patient, mobile: e.target.value })
                }
              />
            </div>
          </div>

          {/* Payment */}
          <div className="space-y-3">
            <h3 className="font-semibold">Payment</h3>

            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={patient.paymentMode === "PAID"}
                  onChange={() =>
                    setPatient({ ...patient, paymentMode: "PAID" })
                  }
                />
                Already Paid
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={patient.paymentMode === "COLLECT"}
                  onChange={() =>
                    setPatient({ ...patient, paymentMode: "COLLECT" })
                  }
                />
                Need to Collect
              </label>
            </div>

            <input
              placeholder="Partner Promo Code"
              className="w-full border rounded-lg px-4 py-2"
              value={patient.promoCode}
              onChange={(e) =>
                setPatient({ ...patient, promoCode: e.target.value })
              }
            />
          </div>

          {/* Selected Items */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Selected Tests / Packages</h3>
              <button
                onClick={onClose}
                className="text-sm text-red-600 flex items-center gap-1 hover:underline"
              >
                <FaPlus /> Add More
              </button>
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border rounded-lg px-4 py-2"
              >
                <span>{item.name}</span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">₹{item.b2cPrice}</span>
                  {items.length > 1 && (
                    <button
                      onClick={() =>
                        setItems((prev) => prev.filter((i) => i.id !== item.id))
                      }
                      className="text-red-500"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-between items-center">
          <span className="font-semibold">Total: ₹{totalAmount}</span>
          <button className="bg-red-600 text-white px-6 py-2 rounded-full">
            Create Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartnerBookingModal;
