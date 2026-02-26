import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaBox, FaFlask, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { usePartnerPricing } from "../../hooks/usePartnerPricing";
import { LabType } from "../../services/pricingService";
import PartnerBookingModal, {
  SelectedItem,
} from "../../Components/Partner/PartnerBookingModal";

/* ---------------------------------------------
   Helper: get partner promo code
---------------------------------------------- */
const getPartnerPromoCode = (): string => {
  try {
    const raw =
      localStorage.getItem("user") ||
      localStorage.getItem("CapacitorStorage.user");

    if (!raw) return "";

    const parsed = JSON.parse(raw);
    return parsed?.referralCode || "";
  } catch {
    return "";
  }
};

const Pricing: React.FC = () => {
  const navigate = useNavigate();

  /* ---------------- State ---------------- */
  const [activeLab, setActiveLab] = useState<LabType>("thyrocare");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [partnerPromoCode, setPartnerPromoCode] = useState("");

  const { type, setType, items, loading, error, search, setSearch } =
    usePartnerPricing(activeLab);

  /* ---------------- Load promo code ---------------- */
  useEffect(() => {
    setPartnerPromoCode(getPartnerPromoCode());
  }, []);

  /* ---------------- Row Click ---------------- */
  const openBookingModal = (item: any) => {
    setSelectedItems((prev) => {
      if (prev.some((p) => p.id === item.name)) return prev;

      return [
        ...prev,
        {
          id: item.name, // ✅ name as unique id
          name: item.name,
          type,
          b2pPrice: item.b2p,
          b2cPrice: item.mrp,
        },
      ];
    });

    setIsBookingOpen(true);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex justify-center p-6 pt-16 mb-8">
      <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-400 text-white text-center py-8 px-6 relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 top-4 p-2 bg-red-600 rounded-full hover:bg-red-700 transition"
          >
            <FaArrowLeft />
          </button>

          <h1 className="text-3xl font-bold tracking-tight">
            Partner Pricing
          </h1>

          <p className="mt-2 text-sm opacity-90">
            B2P pricing & partner earnings
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* Labs */}
          <div className="flex justify-center gap-3 flex-wrap">
            {["thyrocare", "healthians", "dr_mittal"].map((lab) => (
              <button
                key={lab}
                onClick={() => setActiveLab(lab as LabType)}
                className={`px-5 py-2 rounded-full font-semibold transition ${
                  activeLab === lab
                    ? "bg-red-600 text-white shadow-md scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {lab.replace("_", " ").toUpperCase()}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex justify-center">
            <div className="h-[1px] w-full max-w-3xl bg-gradient-to-r from-transparent via-red-300 to-transparent" />
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">

            {/* Type */}
            <div className="flex gap-2">
              <button
                onClick={() => setType("test")}
                className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold ${
                  type === "test"
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <FaFlask size={12} />
                TESTS
              </button>

              <button
                onClick={() => setType("package")}
                className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold ${
                  type === "package"
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <FaBox size={12} />
                PACKAGES
              </button>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search test or package"
                className="w-full pl-10 pr-4 py-2 text-sm border rounded-full focus:ring-2 focus:ring-red-400"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-sm">

              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs uppercase">Name</th>
                  <th className="px-4 py-3 text-right text-xs uppercase">
                    B2P Price
                  </th>
                  <th className="px-4 py-3 text-right text-xs uppercase">
                    MRP
                  </th>
                  <th className="px-4 py-3 text-right text-xs uppercase">
                    Margin
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-red-600">
                      Loading pricing…
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400">
                      No pricing available
                    </td>
                  </tr>
                ) : (
                  items.map((i) => {
                    const isSelected = selectedItems.some(
                      (s) => s.id === i.name
                    );

                    return (
                      <tr
                        key={i.name}
                        onClick={() => openBookingModal(i)}
                        className={`border-t cursor-pointer ${
                          isSelected
                            ? "bg-red-50"
                            : "hover:bg-red-50"
                        }`}
                      >
                        <td className="px-4 py-3 font-semibold">
                          {i.name}
                        </td>

                        <td className="px-4 py-3 text-right text-gray-700">
                          ₹{i.b2p}
                        </td>

                        <td className="px-4 py-3 text-right font-semibold">
                          ₹{i.mrp}
                        </td>

                        <td className="px-4 py-3 text-right">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                            ↑ ₹{i.margin}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <PartnerBookingModal
        isOpen={isBookingOpen}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        partnerPromoCode={partnerPromoCode}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
};

export default Pricing;