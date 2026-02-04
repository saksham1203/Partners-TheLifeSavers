import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaBox, FaFlask, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { usePartnerPricing } from "../../hooks/usePartnerPricing";
import { LabType } from "../../services/pricingService";
import PartnerBookingModal, {
  SelectedItem,
} from "../../Components/Partner/PartnerBookingModal";

/* ---------------------------------------------
   Helper: get partner promo code from storage
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

  /* ---------------------------------------------
     State
  ---------------------------------------------- */
  const [activeLab, setActiveLab] = useState<LabType>("thyrocare");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [partnerPromoCode, setPartnerPromoCode] = useState("");

  const { type, setType, items, loading, error, search, setSearch } =
    usePartnerPricing(activeLab);

  /* ---------------------------------------------
     Load partner promo code once
  ---------------------------------------------- */
  useEffect(() => {
    setPartnerPromoCode(getPartnerPromoCode());
  }, []);

  /* ---------------------------------------------
     Row click → add item & open modal
  ---------------------------------------------- */
  const openBookingModal = (item: any) => {
    setSelectedItems((prev) => {
      if (prev.some((p) => p.id === item.id)) return prev;

      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          type,
          b2pPrice: item.b2bPrice,
          b2cPrice: item.b2cPrice,
        },
      ];
    });

    setIsBookingOpen(true);
  };

  /* ---------------------------------------------
     UI
  ---------------------------------------------- */
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
            B2P, B2C & potential earnings
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Labs */}
          <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
            {["thyrocare", "healthians", "dr_mittal"].map((lab) => (
              <button
                key={lab}
                onClick={() => setActiveLab(lab as LabType)}
                className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-sm sm:text-base font-semibold transition-all ${
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-between items-center">
            {/* Test / Package */}
            <div className="flex gap-2">
              <button
                onClick={() => setType("test")}
                className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold transition ${
                  type === "test"
                    ? "bg-red-500 text-white shadow"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <FaFlask size={12} />
                TESTS
              </button>

              <button
                onClick={() => setType("package")}
                className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold transition ${
                  type === "package"
                    ? "bg-red-500 text-white shadow"
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
                className="w-full pl-10 pr-4 py-2 text-sm border rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border rounded-xl bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs uppercase text-gray-600">
                    Name
                  </th>
                  <th className="px-4 py-3 text-right text-xs uppercase text-gray-600">
                    B2P Price
                  </th>
                  <th className="px-4 py-3 text-right text-xs uppercase text-gray-600">
                    B2C Price
                  </th>
                  <th className="px-4 py-3 text-right text-xs uppercase text-gray-600">
                    Margin (up to)
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative h-10 w-10">
                          <div className="absolute inset-0 rounded-full border-4 border-red-200" />
                          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-600 animate-spin" />
                        </div>
                        <span className="text-sm font-semibold text-red-600">
                          Loading pricing…
                        </span>
                      </div>
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
                    const margin = i.b2cPrice - i.b2bPrice;
                    const isSelected = selectedItems.some(
                      (s) => s.id === i.id,
                    );

                    return (
                      <tr
                        key={i.id}
                        onClick={() => openBookingModal(i)}
                        className={`border-t cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-red-50"
                            : "hover:bg-red-50"
                        }`}
                      >
                        <td className="px-4 py-3 font-semibold text-gray-800">
                          {i.name}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600">
                          ₹{i.b2bPrice}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900">
                          ₹{i.b2cPrice}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                            ↑ ₹{margin}
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
