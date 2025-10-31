// src/pages/PartnerDashboard.tsx
import React, { useRef } from "react";
import {
  FaCheckCircle,
  FaGift,
  FaChartLine,
  FaUserFriends,
  FaRupeeSign,
  FaCopy,
  FaTimes,
  FaFileContract,
  FaHistory,
  FaSyncAlt, // ⬅️ NEW
} from "react-icons/fa";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Confetti from "react-confetti";
import { motion } from "framer-motion";

// moved logic to service/hooks but keeping UI the same
import { MILESTONES } from "../../services/partnerService";
import { usePartnerDashboard, useCountdown } from "../../hooks/usePartnerDashboard";

// NEW: History modal
import PartnerHistoryModal from "../../Components/Models/PartnerHistoryModal";

// ------------------- CountdownTimer (same markup) -------------------
const CountdownTimer: React.FC<{
  endDate: Date;
  startDate: Date;
  onEnd: () => void;
}> = React.memo(({ endDate, startDate, onEnd }) => {
  const timeLeft = useCountdown(endDate, onEnd);

  if (timeLeft.ended) return null;

  return (
    <div className="flex flex-col items-center text-center">
      <div
        className="bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-white 
                      px-3 py-0.5 rounded-t-md text-[9px] sm:text-[11px] font-bold 
                      tracking-wide shadow-md uppercase"
      >
        Referral Offer Ends In
      </div>

      <div
        className="flex items-center justify-center space-x-1 sm:space-x-1.5 bg-white 
                      rounded-b-md shadow-md px-2.5 sm:px-3 py-1 border-t-2 border-red-500"
      >
        {[
          { v: timeLeft.days, l: "D" },
          { v: timeLeft.hours, l: "H" },
          { v: timeLeft.minutes, l: "M" },
          { v: timeLeft.seconds, l: "S" },
        ].map(({ v, l }, i) => (
          <React.Fragment key={l}>
            <div
              className="bg-gradient-to-br from-red-500 to-orange-500 text-white 
                            px-1.5 sm:px-2 py-0.5 rounded-md shadow-inner font-mono font-extrabold 
                            text-xs sm:text-sm min-w-[24px] sm:min-w-[28px] text-center"
            >
              {v.toString().padStart(2, "0")}
              <span className="text-[7px] sm:text-[8px] ml-0.5 font-normal">
                {l}
              </span>
            </div>
            {i < 3 && (
              <span className="text-red-600 font-extrabold text-sm sm:text-base">
                :
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      <p className="text-[10px] sm:text-xs text-gray-700 font-semibold mt-1">
        Cycle:{" "}
        <span className="text-red-600 font-bold">
          {startDate.toDateString()}
        </span>{" "}
        →{" "}
        <span className="text-green-700 font-bold">
          {endDate.toDateString()}
        </span>
      </p>
    </div>
  );
});
CountdownTimer.displayName = "CountdownTimer";

// ------------------- UI HELPERS (same JSX/classes) -------------------
const SectionCard: React.FC<{
  title: React.ReactNode;
  right?: React.ReactNode;
  children?: React.ReactNode;
}> = React.memo(({ title, right, children }) => (
  <div className="rounded-2xl border border-red-100 bg-white/90 backdrop-blur shadow-md hover:shadow-lg transition">
    <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-gradient-to-r from-red-50/90 to-orange-50/90 rounded-t-2xl">
      <h3 className="text-sm sm:text-base font-bold text-red-700 flex items-center gap-2">
        {title}
      </h3>
      {right}
    </div>
    <div className="p-4 sm:p-6">{children}</div>
  </div>
));
SectionCard.displayName = "SectionCard";

// ------------------- Stepper (same JSX/classes) -------------------
const MilestoneStepper: React.FC<{ patients: number }> = React.memo(
  ({ patients }) => {
    const idx = MILESTONES.findIndex(
      (m) => patients >= m.min && patients <= m.max
    );
    return (
      <div className="w-full flex items-center">
        {MILESTONES.map((m, i) => {
          const reached = i <= idx;
          const isCurrent = i === idx;
          return (
            <React.Fragment key={i}>
              <motion.div
                animate={{ scale: isCurrent ? [1, 1.1, 1] : 1 }}
                transition={{ repeat: isCurrent ? Infinity : 0, duration: 1 }}
                className="flex flex-col items-center text-center min-w-0 flex-1"
              >
                <div
                  className={`flex items-center justify-center w-14 h-14 rounded-full border-2 shadow-md text-sm font-bold
                  ${
                    reached
                      ? "bg-gradient-to-br from-red-600 to-orange-500 text-white border-red-600"
                      : "bg-gray-100 text-gray-400 border-gray-300"
                  }`}
                >
                  ₹{m.rate}
                </div>
                <span
                  className={`mt-1 text-xs font-semibold ${
                    reached ? "text-red-700" : "text-gray-500"
                  }`}
                >
                  {m.max === Infinity ? `${m.min}+` : `${m.min}–${m.max}`}
                </span>
                <span className="text-[10px] text-gray-400">Patients</span>
              </motion.div>
              {i < MILESTONES.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 rounded-full ${
                    i < idx
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
  }
);
MilestoneStepper.displayName = "MilestoneStepper";

// ------------------- Main (UI preserved) -------------------
const PartnerDashboardInner: React.FC = () => {
  const {
    patients,
    promoCode,
    copied,
    isTncOpen,
    offerStart,
    offerEnd,
    windowSize,
    showConfetti,
    commission,
    milestone,
    next,
    setCopied,
    openTnc,
    closeTnc,
    resetOffer,

    // NEW: history wiring from hook
    history,
    isHistoryOpen,
    openHistory,
    closeHistory,

    // ⬅️ NEW: refresh API wiring
    refreshDashboard,
    isRefreshing,
  } = usePartnerDashboard();

  const fhcDialogRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="min-h-screen flex items-center justify-center "
      style={{ paddingTop: "4rem", paddingBottom: "12rem" }}
    >
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={600}
          gravity={0.3}
        />
      )}

      <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl max-w-7xl w-full overflow-hidden ring-1 ring-red-100 relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-6 px-6 flex items-center justify-between">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold drop-shadow">
              Partner Dashboard
            </h1>
            <span className="text-base sm:text-lg font-medium text-yellow-300 mt-1">
              Track your referrals & earnings
            </span>
          </div>

          {/* Header actions */}
          <div className="ml-auto flex items-center gap-2">
            {/* ⬅️ NEW: Refresh Button */}
            <button
              onClick={refreshDashboard}
              disabled={isRefreshing}
              className={`text-sm px-4 py-2 rounded-full bg-white/20 text-white font-semibold shadow transition flex items-center gap-2 ${
                isRefreshing ? "opacity-70 cursor-wait" : "hover:bg-white/30"
              }`}
              aria-label="Refresh data"
              title="Refresh data"
            >
              <FaSyncAlt className={isRefreshing ? "animate-spin" : ""} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>

            {/* NEW: History Button */}
            <button
              onClick={openHistory}
              className="text-sm px-4 py-2 rounded-full bg-white/20 text-white font-semibold shadow hover:bg-white/30 transition flex items-center gap-2"
              aria-label="View history"
            >
              <FaHistory /> History
            </button>

            {/* T&C Button in Header */}
            <button
              onClick={openTnc}
              className="text-sm px-4 py-2 rounded-full bg-white/20 text-white font-semibold shadow hover:bg-white/30 transition flex items-center gap-2"
            >
              <FaFileContract /> T&C
            </button>
          </div>
        </div>

        {/* Content - landscape-friendly: two-column on lg */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* LEFT COLUMN: Promo + Stats */}
          <div className="space-y-6">
            {/* Promo Code */}
            <SectionCard
              title={
                <span className="flex items-center gap-2">
                  🎟️ Your Promo Code
                </span>
              }
              right={
                <CopyToClipboard text={promoCode} onCopy={() => setCopied(true)}>
                  <button className="px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm shadow hover:scale-105 transition flex items-center gap-2">
                    <FaCopy /> {copied ? "Copied!" : "Copy"}
                  </button>
                </CopyToClipboard>
              }
            >
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-extrabold text-red-600 tracking-widest">
                  {promoCode}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Share this code with patients to get rewards!
                </p>
              </div>
            </SectionCard>

            {/* Stats Cards - make larger on lg */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 text-white p-6 lg:p-8 shadow-md flex flex-col items-center justify-center hover:scale-105 transform transition">
                <FaUserFriends size={28} className="mb-2" />
                <div className="text-4xl lg:text-5xl font-extrabold">
                  {patients}
                </div>
                <div className="text-sm uppercase tracking-wider">
                  Patients Referred
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-400 text-white p-6 lg:p-8 shadow-md flex flex-col items-center justify-center hover:scale-105 transform transition">
                <FaRupeeSign size={28} className="mb-2" />
                <div className="text-4xl lg:text-5xl font-extrabold">
                  ₹{commission}
                </div>
                <div className="text-sm uppercase tracking-wider">
                  Commission Earned
                </div>
              </div>
            </div>

            {/* Rewards Card - keep full width of left column */}
            <SectionCard
              title={
                <span className="flex items-center gap-2">
                  <FaGift /> Rewards & Bonuses
                </span>
              }
            >
              <div className="w-full mt-2">
                <div className="w-full px-6 py-6 bg-gradient-to-r from-yellow-100 via-pink-100 to-purple-100 rounded-xl shadow-md border border-yellow-200 text-center">
                  <div className="text-lg lg:text-xl font-bold text-gray-800">
                    🎁 Coming Soon
                  </div>
                  <p className="text-sm lg:text-base text-gray-700 mt-1 leading-relaxed">
                    ✨ Extra <span className="font-bold text-red-600">cashback</span> +
                    <span className="font-bold text-indigo-600"> badges</span> <br />
                    for top-performing partners! 🏆
                  </p>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* RIGHT COLUMN: Stepper + Summary + CTA */}
          <div className="space-y-6">
            <SectionCard
              title={
                <span className="flex items-center gap-2">
                  <FaCheckCircle /> Milestone Progress
                </span>
              }
            >
              <MilestoneStepper patients={patients} />
              {next ? (
                <div className="mt-4 text-center">
                  <div className="inline-block px-4 py-2 bg-gradient-to-r from-red-100 via-yellow-50 to-green-100 rounded-xl shadow-md border border-red-200">
                    <span className="text-sm lg:text-base text-gray-800 font-medium">
                      🚀 You need{" "}
                      <span className="font-bold text-red-600 text-lg">
                        {next.min - patients}
                      </span>{" "}
                      more patients to unlock{" "}
                      <span className="font-bold text-green-700 text-lg">
                        ₹{next.rate}/patient
                      </span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-4 text-base text-green-700 font-bold text-center">
                  You’ve reached the highest milestone!
                </div>
              )}
            </SectionCard>

            <SectionCard
              title={
                <span className="flex items-center gap-2">
                  <FaChartLine /> Your Summary
                </span>
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100 shadow">
                  <div className="text-2xl lg:text-lg font-extrabold text-red-700">
                    {patients}
                  </div>
                  <div className="text-xs text-gray-600">Patients Referred</div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 shadow">
                  <div className="text-2xl lg:text-lg font-extrabold text-green-700">
                    ₹{commission}
                  </div>
                  <div className="text-xs text-gray-600">Total Commission</div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 shadow">
                  {milestone ? (
                    <>
                      <div className="text-2xl lg:text-lg font-extrabold text-yellow-700">
                        ₹{milestone.rate}
                      </div>
                      <div className="text-xs text-gray-600">Per Patient</div>
                    </>
                  ) : (
                    <div className="text-xs text-gray-600">No milestone</div>
                  )}
                </div>
              </div>
            </SectionCard>

            {/* Optional CTA / Promo copy area - wider on large screens */}
            <div className="rounded-2xl border border-red-100 bg-white/90 p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h4 className="font-bold text-lg">Share & Earn</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Use your promo code on socials or send directly to patients. Higher tiers unlock better rewards.
                  </p>
                </div>
                <CopyToClipboard text={promoCode} onCopy={() => setCopied(true)}>
                  <button className="px-3 py-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm shadow">
                    Copy Code
                  </button>
                </CopyToClipboard>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Countdown Timer */}
      {offerStart && offerEnd && (
        <div className="fixed bottom-14 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl px-4 py-3 border border-red-200">
            <CountdownTimer
              endDate={offerEnd}
              startDate={offerStart}
              onEnd={resetOffer}
            />
          </div>
        </div>
      )}

      {/* Terms & Conditions Modal */}
      {isTncOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div
            ref={fhcDialogRef}
            className="bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] flex flex-col relative border border-red-100"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-gradient-to-br from-white to-red-50 z-10 rounded-t-2xl">
              <h2 className="text-lg sm:text-xl font-extrabold text-red-700 tracking-tight flex items-center gap-2">
                <FaFileContract className="text-red-600" /> Referral Offer — T&C
              </h2>
              <button
                onClick={closeTnc}
                className="p-2 rounded-full bg-red-100 hover:bg-red-200 focus:outline-none"
              >
                <FaTimes size={20} className="text-red-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3 text-sm text-gray-700">
              <ul className="space-y-2 list-disc pl-5">
                <li>Offer runs in recurring 15-day cycles.</li>
                <li>Promo code must be used by referred patients.</li>
                <li>Commission slabs reset each cycle.</li>
                <li>Rewards and bonuses apply only during active cycles.</li>
                <li>The offer may be modified or withdrawn without prior notice.</li>
              </ul>

              <p className="mt-4 text-xs leading-relaxed text-gray-500">
                By participating, you agree to these terms and our partner policy.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-6 py-4 bg-gradient-to-br from-white to-red-50 rounded-b-2xl">
              <button
                onClick={closeTnc}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={closeTnc}
                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 shadow"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW: Partner History Modal */}
      <PartnerHistoryModal
        isOpen={isHistoryOpen}
        onClose={closeHistory}
        cycles={history}
      />
    </div>
  );
};

const PartnerDashboard = React.memo(PartnerDashboardInner);
PartnerDashboard.displayName = "PartnerDashboard";
export default PartnerDashboard;
