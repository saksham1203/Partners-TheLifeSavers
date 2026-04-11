import React, { useState } from "react";
import { FaArrowLeft, FaBox, FaFlask, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { usePartnerPricing } from "../../hooks/usePartnerPricing";
import { LabType } from "../../services/pricingService";

const Pricing: React.FC = () => {
  const navigate = useNavigate();

  /* ---------------- State ---------------- */
  const [activeLab, setActiveLab] = useState<LabType>("thyrocare");

  const { type, setType, items, loading, error, search, setSearch } =
    usePartnerPricing(activeLab);

  const hasValidAmount = (value: unknown, allowZero = false) => {
    const num = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(num)) return false;
    return allowZero ? num >= 0 : num > 0;
  };

  const visibleItems = items.filter(
    (item) =>
      hasValidAmount(item.mrp) &&
      hasValidAmount(item.b2p) &&
      hasValidAmount(item.margin, true)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex justify-center p-4 sm:p-6 pt-20 sm:pt-24 lg:pt-20 mb-8">
      <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-400 text-white text-center py-8 px-6 relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 top-4 p-2 bg-red-600 rounded-full hover:bg-red-700 transition"
          >
            <FaArrowLeft />
          </button>

          <h1 className="text-3xl sm:text-3xl font-bold tracking-tight">
            Partner Pricing
          </h1>

          <p className="mt-2 text-base sm:text-sm opacity-90">
            B2P pricing & partner earnings
          </p>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          
          {/* Labs */}
          <div className="flex justify-center gap-3 flex-wrap">
            {["thyrocare", "healthians", "dr_mittal", "maxx_path_diagnostics"].map((lab) => (
              <button
                key={lab}
                onClick={() => setActiveLab(lab as LabType)}
                className={`px-4 sm:px-5 py-2 rounded-full text-base sm:text-sm font-semibold transition ${
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
            
            {/* Type Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setType("test")}
                className={`px-4 py-2 rounded-full flex items-center gap-2 text-base sm:text-sm font-bold ${
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
                className={`px-4 py-2 rounded-full flex items-center gap-2 text-base sm:text-sm font-bold ${
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
                className="w-full pl-10 pr-4 py-2 text-base sm:text-sm border rounded-full focus:ring-2 focus:ring-red-400"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
            <table className="w-full table-fixed text-xs sm:text-sm border-collapse">
              
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="w-[40px] sm:w-auto px-2 sm:px-4 py-3 text-left uppercase tracking-wide whitespace-nowrap">
                    S.No
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left uppercase tracking-wide">
                    Name
                  </th>
                  <th className="w-[56px] sm:w-auto px-2 sm:px-4 py-3 text-right uppercase whitespace-nowrap">
                    MRP
                  </th>
                  <th className="w-[56px] sm:w-auto px-2 sm:px-4 py-3 text-right uppercase whitespace-nowrap">
                    B2P
                  </th>
                  <th className="w-[64px] sm:w-auto px-2 sm:px-4 py-3 text-right uppercase whitespace-nowrap">
                    <span className="sm:hidden">Mg</span>
                    <span className="hidden sm:inline">Margin</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                
                {/* ✅ Loading */}
                {loading && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-8 w-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
                        <span className="text-sm font-semibold text-red-600">
                          Loading pricing…
                        </span>
                      </div>
                    </td>
                  </tr>
                )}

                {/* ✅ Error */}
                {!loading && error && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-red-500 font-medium"
                    >
                      {error}
                    </td>
                  </tr>
                )}

                {/* ✅ Empty State */}
                {!loading && !error && visibleItems.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-gray-400"
                    >
                      No pricing available
                    </td>
                  </tr>
                )}

                {/* ✅ Data */}
                {!loading &&
                  !error &&
                  visibleItems.map((i, index) => (
                    <tr key={i.name} className="hover:bg-gray-50 transition">
                      <td className="px-2 sm:px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="px-2 sm:px-4 py-3 font-medium text-gray-800 break-words">
                        {i.name}
                      </td>

                      <td className="px-2 sm:px-4 py-3 text-right font-semibold whitespace-nowrap">
                        ₹{i.mrp}
                      </td>

                      <td className="px-2 sm:px-4 py-3 text-right whitespace-nowrap">
                        ₹{i.b2p}
                      </td>

                      <td className="px-2 sm:px-4 py-3 text-right">
                        <span className="inline-flex items-center justify-center px-1.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-green-100 text-green-800 whitespace-nowrap">
                          ₹{i.margin}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
