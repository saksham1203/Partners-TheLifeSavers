// src/hooks/usePartnerDashboard.ts
import React from "react";
import { Preferences } from "@capacitor/preferences";
import {
  calculateCommission,
  currentMilestone,
  nextMilestone,
  getMilestoneIndex,
  loadPartnerDataFromPrefs,
  DEFAULT_CYCLE_START,
  DEFAULT_CYCLE_LENGTH_DAYS,
  MILESTONES,
  // Live API helpers
  fetchPartnerDashboard,
  fetchPartnerCycles,
  mapBackendCyclesToHistoryItems,
  loadPartnerDataFromAPI,
  // Bank API helpers
  fetchMyBank,
  upsertMyBank,
  BackendBankResponse,
} from "../services/partnerService";

// ------------------- Shared types for history -------------------
export type PaymentStatus = "paid" | "pending" | "unpaid";

export interface CycleHistoryItem {
  id: string;
  startDate: string;
  endDate: string;
  totalPatients: number;
  totalCommission: number;
  paymentStatus: PaymentStatus;
  paymentRef?: string | null;
  paidAt?: string | null;
}

// ------------------- Bank status type (from backend) -------------------
export type BankVerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

// ------------------- Countdown helpers -------------------
const calcTimeLeft = (endTime: number) => {
  const now = new Date().getTime();
  const diff = endTime - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true } as const;
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    ended: false,
  } as const;
};

export const useCountdown = (endDate: Date, onEnd: () => void) => {
  const [timeLeft, setTimeLeft] = React.useState(() =>
    calcTimeLeft(endDate.getTime())
  );

  const onEndRef = React.useRef(onEnd);
  onEndRef.current = onEnd;

  React.useEffect(() => {
    const interval = window.setInterval(() => {
      const newTime = calcTimeLeft(endDate.getTime());
      setTimeLeft(newTime);
      if (newTime.ended) onEndRef.current();
    }, 1000);
    return () => window.clearInterval(interval);
  }, [endDate]);

  return timeLeft;
};

// ------------------- Helpers: history load/save -------------------
const HISTORY_PREFS_KEY = "partner_history";

/**
 * Load history from backend first (live), then prefs fallback, then empty.
 */
async function loadPartnerHistory(): Promise<CycleHistoryItem[]> {
  // 1) Backend (live)
  try {
    const data = await fetchPartnerCycles();
    if (data?.success) {
      const mapped = mapBackendCyclesToHistoryItems(data);
      // Persist for offline/demo convenience
      try {
        await Preferences.set({
          key: HISTORY_PREFS_KEY,
          value: JSON.stringify(mapped),
        });
      } catch {}
      return mapped;
    }
  } catch {
    // ignore and fallback
  }

  // 2) Capacitor Preferences fallback
  try {
    const { value } = await Preferences.get({ key: HISTORY_PREFS_KEY });
    if (value) {
      const parsed = JSON.parse(value) as CycleHistoryItem[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}

  // 3) Empty fallback
  return [];
}

/** Persist to Preferences after successful fetch/merge */
async function savePartnerHistory(cycles: CycleHistoryItem[]) {
  try {
    await Preferences.set({
      key: HISTORY_PREFS_KEY,
      value: JSON.stringify(cycles),
    });
  } catch {}
}

// ------------------- Core dashboard hook -------------------
export const usePartnerDashboard = () => {
  // state
  const [patients, setPatients] = React.useState<number>(0);
  const [copied, setCopied] = React.useState(false);
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [isTncOpen, setIsTncOpen] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const [windowSize, setWindowSize] = React.useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  // promo code state - default fallback to placeholder
  const [promoCode, setPromoCode] = React.useState<string>("LSAVE123");

  // derived
  const commission = React.useMemo(() => calculateCommission(patients), [patients]);
  const milestone = React.useMemo(() => currentMilestone(patients), [patients]);
  const next = React.useMemo(() => nextMilestone(patients), [patients]);

  // offer cycle defaults
  const [offerStart, setOfferStart] = React.useState<Date>(DEFAULT_CYCLE_START);
  const [offerEnd, setOfferEnd] = React.useState<Date>(
    new Date(DEFAULT_CYCLE_START.getTime() + DEFAULT_CYCLE_LENGTH_DAYS * 24 * 60 * 60 * 1000)
  );

  const resetOffer = React.useCallback(() => {
    const nextStart = new Date(offerEnd);
    const nextEnd = new Date(nextStart.getTime() + DEFAULT_CYCLE_LENGTH_DAYS * 24 * 60 * 60 * 1000);
    setOfferStart(nextStart);
    setOfferEnd(nextEnd);
  }, [offerEnd]);

  // history state & modal controls
  const [history, setHistory] = React.useState<CycleHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);
  const openHistory = React.useCallback(() => setIsHistoryOpen(true), []);
  const closeHistory = React.useCallback(() => setIsHistoryOpen(false), []);

  // 🔔 Bank snapshot from dashboard (lightweight, read-only)
  const [bankStatus, setBankStatus] = React.useState<BankVerificationStatus>("PENDING");
  const [bankVerifiedAt, setBankVerifiedAt] = React.useState<string | null>(null);
  const [bankRejectionReason, setBankRejectionReason] = React.useState<string | null>(null);
  const [bankLastUpdatedAt, setBankLastUpdatedAt] = React.useState<string | null>(null);
  const bankNeedsAction = React.useMemo(
    () => bankStatus === "PENDING" || bankStatus === "REJECTED",
    [bankStatus]
  );

  // 🏦 Full bank form state/handlers (for modal)
  const [bankLoading, setBankLoading] = React.useState(false);
  const [bankSubmitting, setBankSubmitting] = React.useState(false);
  const [bankError, setBankError] = React.useState<string | null>(null);
  const [bankSuccess, setBankSuccess] = React.useState<string | null>(null);

  const [holderName, setHolderName] = React.useState("");
  const [bankName, setBankName] = React.useState("");           // 🔹 NEW
  const [accountNo, setAccountNo] = React.useState("");
  const [accountNoMasked, setAccountNoMasked] = React.useState<string>("");
  const [ifsc, setIfsc] = React.useState("");

  const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/i;

  const validateBank = React.useCallback((): string | null => {
    if (!holderName.trim()) return "Please enter account holder name.";
    if (!bankName.trim() || bankName.trim().length < 2) return "Please enter bank name.";
    const ac = accountNo.replace(/\s+/g, "");
    if (!ac) return "Please enter account number.";
    if (ac.length < 9 || ac.length > 20) return "Account number must be 9–20 digits.";
    if (!IFSC_REGEX.test(ifsc.trim())) return "Please enter a valid IFSC (e.g., HDFC0001234).";
    return null;
  }, [holderName, bankName, accountNo, ifsc]);

  const loadBankDetails = React.useCallback(async () => {
    setBankError(null);
    setBankSuccess(null);
    setBankLoading(true);
    try {
      const res: BackendBankResponse = await fetchMyBank();
      if (res?.bank) {
        setHolderName(res.bank.holderName || "");
        setBankName((res.bank as any).bankName || ""); // tolerant during migration
        setIfsc((res.bank.ifsc || "").toUpperCase());
        setAccountNoMasked(res.bank.accountNoMasked || "");
        setAccountNo(""); // never prefill raw number
        // keep snapshot fields also aligned:
        setBankStatus((res.bank.status as BankVerificationStatus) || "PENDING");
        setBankRejectionReason(res.bank.rejectionReason ?? null);
        setBankVerifiedAt(res.bank.verifiedAt ?? null);
        setBankLastUpdatedAt(res.bank.updatedAt ?? null);
      } else {
        setHolderName("");
        setBankName("");
        setIfsc("");
        setAccountNo("");
        setAccountNoMasked("");
      }
    } catch (e: any) {
      setBankError(e?.response?.data?.message || "Failed to load bank details");
    } finally {
      setBankLoading(false);
    }
  }, []);

  const submitBankDetails = React.useCallback(async () => {
    setBankError(null);
    setBankSuccess(null);
    const v = validateBank();
    if (v) {
      setBankError(v);
      return;
    }
    setBankSubmitting(true);
    try {
      const res = await upsertMyBank({
        holderName: holderName.trim(),
        bankName: bankName.trim(),                       // 🔹 pass bankName
        accountNo: accountNo.replace(/\s+/g, ""),
        ifsc: ifsc.trim().toUpperCase(),
      });
      if (res.success) {
        setBankSuccess(res.message || "Bank details submitted. Awaiting verification.");
        setAccountNo(""); // clear raw number after save
        setAccountNoMasked(res.bank?.accountNoMasked || accountNoMasked);
        setBankStatus(res.bank?.status || "PENDING");
        setBankRejectionReason(res.bank?.rejectionReason ?? null);
        setBankVerifiedAt(res.bank?.verifiedAt ?? null);
        setBankLastUpdatedAt(res.bank?.updatedAt ?? null);
      } else {
        setBankError(res.message || "Failed to save bank details");
      }
    } catch (e: any) {
      setBankError(e?.response?.data?.message || "Failed to save bank details");
    } finally {
      setBankSubmitting(false);
    }
  }, [holderName, bankName, accountNo, ifsc, accountNoMasked, validateBank]);

  // ✅ Refresh function (public)
  const refreshDashboard = React.useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Dashboard
      const d = await fetchPartnerDashboard();
      setPromoCode(d.promoCode || "LSAVE123");
      setOfferStart(new Date(d.cycle.start));
      setOfferEnd(new Date(d.cycle.end));
      setPatients(d.patients ?? 0);

      // Bank snapshot from dashboard payload (optional)
      if (typeof d.bankStatus === "string") {
        setBankStatus(d.bankStatus as BankVerificationStatus);
      } else {
        setBankStatus("PENDING");
      }
      setBankVerifiedAt(d.bankVerifiedAt ?? null);
      setBankRejectionReason(d.bankRejectionReason ?? null);
      setBankLastUpdatedAt(d.bankLastUpdatedAt ?? null);

      // History
      const cycles = await fetchPartnerCycles();
      const mapped = mapBackendCyclesToHistoryItems(cycles);
      setHistory(mapped);
      savePartnerHistory(mapped);
    } catch (err) {
      console.warn("Refresh failed; falling back to local prefs", err);
      // minimal fallback for promo/cycle if backend is down
      try {
        const data = await loadPartnerDataFromAPI();
        setPromoCode(data.promoCode);
        setOfferStart(data.offerStart);
        setOfferEnd(data.offerEnd);
      } catch {
        const local = await loadPartnerDataFromPrefs();
        setPromoCode(local.promoCode);
        setOfferStart(local.offerStart);
        setOfferEnd(local.offerEnd);
      }
      // history fallback
      const cached = await loadPartnerHistory();
      setHistory(cached);

      // bank fallbacks (unknown)
      setBankStatus("PENDING");
      setBankVerifiedAt(null);
      setBankRejectionReason(null);
      setBankLastUpdatedAt(null);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Load on mount
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      await refreshDashboard();
      if (!mounted) return;
    })();
    return () => {
      mounted = false;
    };
  }, [refreshDashboard]);

  // ---------- Milestone confetti ----------
  const getIndex = React.useCallback((count: number) => getMilestoneIndex(count), []);

  const initialIndex = getIndex(patients);
  const [, setLastMilestoneIndex] = React.useState<number>(
    initialIndex >= 0 ? initialIndex : -1
  );
  const lastMilestoneIndexRef = React.useRef<number>(
    initialIndex >= 0 ? initialIndex : -1
  );
  const confettiTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const idx = getIndex(patients);

    if (idx > lastMilestoneIndexRef.current) {
      setShowConfetti(true);
      setLastMilestoneIndex(idx);
      lastMilestoneIndexRef.current = idx;

      if (confettiTimerRef.current) {
        window.clearTimeout(confettiTimerRef.current);
        confettiTimerRef.current = null;
      }
      confettiTimerRef.current = window.setTimeout(() => {
        setShowConfetti(false);
        confettiTimerRef.current = null;
      }, 5000);
    }

    return () => {
      if (confettiTimerRef.current) {
        window.clearTimeout(confettiTimerRef.current);
        confettiTimerRef.current = null;
      }
    };
  }, [patients, getIndex]);

  // copy feedback reset
  React.useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2500);
    return () => window.clearTimeout(t);
  }, [copied]);

  // responsive window size
  React.useEffect(() => {
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // stable handlers for buttons
  const decPatients = React.useCallback(
    () => setPatients((p) => Math.max(0, p - 1)),
    []
  );
  const openTnc = React.useCallback(() => setIsTncOpen(true), []);
  const closeTnc = React.useCallback(() => setIsTncOpen(false), []);

  return {
    // state
    patients,
    copied,
    showConfetti,
    isTncOpen,
    windowSize,
    promoCode,
    offerStart,
    offerEnd,
    isRefreshing,

    // derived
    commission,
    milestone,
    next,
    MILESTONES,

    // history
    history,
    isHistoryOpen,

    // bank snapshot (header)
    bankStatus,
    bankVerifiedAt,
    bankRejectionReason,
    bankLastUpdatedAt,
    bankNeedsAction,

    // bank modal state/handlers
    bankLoading,
    bankSubmitting,
    bankError,
    bankSuccess,
    holderName, setHolderName,
    bankName, setBankName,                // 🔹 expose bankName
    accountNo, setAccountNo,
    accountNoMasked,
    ifsc, setIfsc,
    loadBankDetails,
    submitBankDetails,

    // actions
    setCopied,
    decPatients,
    openTnc,
    closeTnc,
    resetOffer,
    refreshDashboard,

    // history actions
    openHistory,
    closeHistory,
    setHistory,
  } as const;
};
