import React from "react";
import {
  FaUserMd,
  FaPhoneAlt,
  FaFlask,
  FaRupeeSign,
} from "react-icons/fa";

/* -------------------------------- TYPES -------------------------------- */

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SAMPLE_COLLECTED"
  | "COMPLETED"
  | "CANCELLED";

type PartnerOrder = {
  id: string;
  partnerName: string;
  partnerCode: string;
  patientName: string;
  patientMobile: string;
  items: string[];
  totalAmount: number;
  paymentMode: "PAID" | "COLLECT";
  paymentAmount: number;
  status: OrderStatus;
  createdAt: string;
};

/* ---------------------------- MOCK DATA --------------------------------- */

const MOCK_ORDERS: PartnerOrder[] = [
  {
    id: "ORD-1001",
    partnerName: "Himanshu Medicos",
    partnerCode: "HIMANSHUMEDICOSE02",
    patientName: "Rahul Sharma",
    patientMobile: "9876543210",
    items: ["CBC", "Thyroid Profile"],
    totalAmount: 850,
    paymentMode: "COLLECT",
    paymentAmount: 850,
    status: "PENDING",
    createdAt: "2026-02-05",
  },
];

/* ------------------------------- UTIL ----------------------------------- */

const statusColor = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "CONFIRMED":
      return "bg-blue-100 text-blue-800";
    case "SAMPLE_COLLECTED":
      return "bg-purple-100 text-purple-800";
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
  }
};

/* -------------------------------- COMPONENT ----------------------------- */

const PartnersOrders: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-16">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-400 text-white rounded-3xl p-8 shadow-xl mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">
            My Orders
          </h1>
          <p className="opacity-90 mt-2">
            Orders placed by you for patients
          </p>
        </div>

        {/* ORDERS */}
        <div className="space-y-6">
          {MOCK_ORDERS.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition"
            >
              {/* TOP */}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">
                    {order.patientName}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <FaPhoneAlt />
                    {order.patientMobile}
                  </div>
                </div>

                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold ${statusColor(
                    order.status,
                  )}`}
                >
                  {order.status.replace("_", " ")}
                </span>
              </div>

              {/* DETAILS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 text-sm">
                {/* PARTNER */}
                <div>
                  <p className="font-semibold flex items-center gap-2 text-gray-700">
                    <FaUserMd /> Partner
                  </p>
                  <p>{order.partnerName}</p>
                  <p className="text-xs text-gray-500">
                    Code: {order.partnerCode}
                  </p>
                </div>

                {/* ITEMS */}
                <div>
                  <p className="font-semibold flex items-center gap-2 text-gray-700">
                    <FaFlask /> Tests / Packages
                  </p>
                  <ul className="list-disc list-inside">
                    {order.items.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </div>

                {/* PAYMENT */}
                <div>
                  <p className="font-semibold flex items-center gap-2 text-gray-700">
                    <FaRupeeSign /> Payment
                  </p>
                  <p>Mode: {order.paymentMode}</p>
                  <p>
                    Amount:{" "}
                    <span className="font-bold">
                      ₹{order.paymentAmount}
                    </span>
                  </p>
                </div>
              </div>

              {/* FOOTER */}
              <div className="mt-6 flex justify-between text-xs text-gray-500">
                <span>Order ID: {order.id}</span>
                <span>Placed on {order.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnersOrders;
