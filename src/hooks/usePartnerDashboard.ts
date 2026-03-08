// src/hooks/usePartnerDashboard.ts
import React from "react";
import { Preferences } from "@capacitor/preferences";
import {
  calculateCommission, currentMilestone, nextMilestone, getMilestoneIndex,
  loadPartnerDataFromPrefs, DEFAULT_CYCLE_START, DEFAULT_CYCLE_LENGTH_DAYS, MILESTONES,
  buildMilestonesFromSlabs,  // NEW
  fetchPartnerDashboard, fetchPartnerCycles, mapBackendCyclesToHistoryItems, loadPartnerDataFromAPI,
  fetchMyBank, upsertMyBank, BackendBankResponse,
  type Milestone,            // NEW
  type CycleHistoryItem as ServiceCycleHistoryItem,
} from "../services/partnerService";

export type PaymentStatus = "paid" | "pending" | "unpaid";

export interface CycleHistoryItem {
  id: string; workingCycleId: string; startDate: string; endDate: string;
  totalPatients: number; totalRevenue?: number; totalBonus?: number; totalCommission: number;
  paymentStatus: PaymentStatus; paymentRef?: string | null; paidAt?: string | null;
}

export type BankVerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

// ------------------- Countdown helpers -------------------
const calcTimeLeft = (endTime: number) => {
  const diff = endTime - new Date().getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true } as const;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    ended: false,
  } as const;
};

export const useCountdown = (endDate: Date, onEnd: () => void) => {
  const [timeLeft, setTimeLeft] = React.useState(() => calcTimeLeft(endDate.getTime()));
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

const HISTORY_PREFS_KEY = "partner_history";

async function loadPartnerHistory(): Promise<CycleHistoryItem[]> {
  try {
    const data = await fetchPartnerCycles();
    if (data?.success) {
      const mapped = mapBackendCyclesToHistoryItems(data) as CycleHistoryItem[];
      try { await Preferences.set({ key: HISTORY_PREFS_KEY, value: JSON.stringify(mapped) }); } catch {}
      return mapped;
    }
  } catch {}
  try {
    const { value } = await Preferences.get({ key: HISTORY_PREFS_KEY });
    if (value) { const parsed = JSON.parse(value) as CycleHistoryItem[]; if (Array.isArray(parsed)) return parsed; }
  } catch {}
  return [];
}

async function savePartnerHistory(cycles: CycleHistoryItem[]) {
  try { await Preferences.set({ key: HISTORY_PREFS_KEY, value: JSON.stringify(cycles) }); } catch {}
}

export const usePartnerDashboard = () => {
  const [patients, setPatients] = React.useState<number>(0);
  const [revenue, setRevenue] = React.useState<number>(0);
  const [bonus, setBonus] = React.useState<number>(0);
  const [bonusPercent, setBonusPercent] = React.useState<number>(0);          // NEW
  const [commission, setCommission] = React.useState<number>(0);
  const [baseCommission, setBaseCommission] = React.useState<number>(0);      // NEW
  const [bonusEarned, setBonusEarned] = React.useState<number>(0);            // NEW
  const [totalCommissionEarned, setTotalCommissionEarned] = React.useState<number>(0); // NEW
  const [isBonusApplied, setIsBonusApplied] = React.useState<boolean>(false); // NEW
  const [nextBonusMilestone, setNextBonusMilestone] = React.useState<{ nextTarget: number; unlockPercent: number; remaining: number } | null>(null); // NEW

  // NEW: dynamic milestones built from backend slabs
  const [dynamicMilestones, setDynamicMilestones] = React.useState<Milestone[]>(MILESTONES);

  const [copied, setCopied] = React.useState(false);
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [isTncOpen, setIsTncOpen] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [windowSize, setWindowSize] = React.useState({ width: typeof window !== "undefined" ? window.innerWidth : 0, height: typeof window !== "undefined" ? window.innerHeight : 0 });
  const [promoCode, setPromoCode] = React.useState<string>("LSAVE123");

  // derived — now use dynamicMilestones
  const milestone = React.useMemo(() => currentMilestone(revenue, dynamicMilestones), [revenue, dynamicMilestones]);
  const next = React.useMemo(() => nextMilestone(revenue, dynamicMilestones), [revenue, dynamicMilestones]);

  const [offerStart, setOfferStart] = React.useState<Date>(DEFAULT_CYCLE_START);
  const [offerEnd, setOfferEnd] = React.useState<Date>(new Date(DEFAULT_CYCLE_START.getTime() + DEFAULT_CYCLE_LENGTH_DAYS * 24 * 60 * 60 * 1000));

  const resetOffer = React.useCallback(() => {
    const nextStart = new Date(offerEnd);
    const nextEnd = new Date(nextStart.getTime() + DEFAULT_CYCLE_LENGTH_DAYS * 24 * 60 * 60 * 1000);
    setOfferStart(nextStart);
    setOfferEnd(nextEnd);
  }, [offerEnd]);

  const [history, setHistory] = React.useState<CycleHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);
  const openHistory = React.useCallback(() => setIsHistoryOpen(true), []);
  const closeHistory = React.useCallback(() => setIsHistoryOpen(false), []);

  const [bankStatus, setBankStatus] = React.useState<BankVerificationStatus>("PENDING");
  const [bankVerifiedAt, setBankVerifiedAt] = React.useState<string | null>(null);
  const [bankRejectionReason, setBankRejectionReason] = React.useState<string | null>(null);
  const [bankLastUpdatedAt, setBankLastUpdatedAt] = React.useState<string | null>(null);
  const bankNeedsAction = React.useMemo(() => bankStatus === "PENDING" || bankStatus === "REJECTED", [bankStatus]);

  const [bankLoading, setBankLoading] = React.useState(false);
  const [bankSubmitting, setBankSubmitting] = React.useState(false);
  const [bankError, setBankError] = React.useState<string | null>(null);
  const [bankSuccess, setBankSuccess] = React.useState<string | null>(null);
  const [holderName, setHolderName] = React.useState("");
  const [bankName, setBankName] = React.useState("");
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
    setBankError(null); setBankSuccess(null); setBankLoading(true);
    try {
      const res: BackendBankResponse = await fetchMyBank();
      if (res?.bank) {
        setHolderName(res.bank.holderName || "");
        setBankName((res.bank as any).bankName || "");
        setIfsc((res.bank.ifsc || "").toUpperCase());
        setAccountNoMasked(res.bank.accountNoMasked || "");
        setAccountNo("");
        setBankStatus((res.bank.status as BankVerificationStatus) || "PENDING");
        setBankRejectionReason(res.bank.rejectionReason ?? null);
        setBankVerifiedAt(res.bank.verifiedAt ?? null);
        setBankLastUpdatedAt(res.bank.updatedAt ?? null);
      } else {
        setHolderName(""); setBankName(""); setIfsc(""); setAccountNo(""); setAccountNoMasked("");
      }
    } catch (e: any) {
      setBankError(e?.response?.data?.message || "Failed to load bank details");
    } finally {
      setBankLoading(false);
    }
  }, []);

  const submitBankDetails = React.useCallback(async () => {
    setBankError(null); setBankSuccess(null);
    const v = validateBank();
    if (v) { setBankError(v); return; }
    setBankSubmitting(true);
    try {
      const res = await upsertMyBank({ holderName: holderName.trim(), bankName: bankName.trim(), accountNo: accountNo.replace(/\s+/g, ""), ifsc: ifsc.trim().toUpperCase() });
      if (res.success) {
        setBankSuccess(res.message || "Bank details submitted. Awaiting verification.");
        setAccountNo("");
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

  const refreshDashboard = React.useCallback(async () => {
    setIsRefreshing(true);
    try {
      const d = await fetchPartnerDashboard();
      setPromoCode(d.promoCode || "LSAVE123");
      setOfferStart(new Date(d.cycle.start));
      setOfferEnd(new Date(d.cycle.end));
      setPatients(d.patients ?? 0);
      setRevenue(d.revenue ?? 0);
      setBonus(d.bonus ?? 0);
      setBonusPercent(d.bonusPercent ?? 0);                  // NEW
      setCommission(d.commission ?? calculateCommission(d.revenue ?? 0));
      setBaseCommission(d.baseCommission ?? 0);              // NEW
      setBonusEarned(d.bonusEarned ?? 0);                    // NEW
      setTotalCommissionEarned(d.totalCommissionEarned ?? 0);// NEW
      setIsBonusApplied(d.isBonusApplied ?? false);          // NEW
      setNextBonusMilestone(d.nextBonusMilestone ?? null);   // NEW

      // NEW: build dynamic milestones from backend slabs
      if (d.bonusBreakdown?.slabs?.length) {
        setDynamicMilestones(buildMilestonesFromSlabs(d.bonusBreakdown.slabs));
      }

      if (typeof d.bankStatus === "string") setBankStatus(d.bankStatus as BankVerificationStatus);
      else setBankStatus("PENDING");
      setBankVerifiedAt(d.bankVerifiedAt ?? null);
      setBankRejectionReason(d.bankRejectionReason ?? null);
      setBankLastUpdatedAt(d.bankLastUpdatedAt ?? null);

      const cycles = await fetchPartnerCycles();
      const mapped = mapBackendCyclesToHistoryItems(cycles) as ServiceCycleHistoryItem[];
      setHistory(mapped);
      savePartnerHistory(mapped as CycleHistoryItem[]);
    } catch (err) {
      console.warn("Refresh failed; falling back to local prefs", err);
      try {
        const data = await loadPartnerDataFromAPI();
        setPromoCode(data.promoCode); setOfferStart(data.offerStart); setOfferEnd(data.offerEnd);
      } catch {
        const local = await loadPartnerDataFromPrefs();
        setPromoCode(local.promoCode); setOfferStart(local.offerStart); setOfferEnd(local.offerEnd);
      }
      const cached = await loadPartnerHistory();
      setHistory(cached);
      setRevenue(0); setBonus(0); setCommission(0);
      setBankStatus("PENDING"); setBankVerifiedAt(null); setBankRejectionReason(null); setBankLastUpdatedAt(null);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
  refreshDashboard();
}, [refreshDashboard]);

  // milestone confetti
  const getIndex = React.useCallback((value: number) => getMilestoneIndex(value, dynamicMilestones), [dynamicMilestones]);
  const [, setLastMilestoneIndex] = React.useState<number>(-1);
  const lastMilestoneIndexRef = React.useRef<number>(-1);
  const confettiInitRef = React.useRef(false);
  const confettiTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const idx = getIndex(revenue);
    if (!confettiInitRef.current) {
      // Baseline on first load/refresh: do not celebrate initial tier.
      setLastMilestoneIndex(idx);
      lastMilestoneIndexRef.current = idx;
      confettiInitRef.current = true;
      return;
    }

    // Celebrate only upward tier movement, and never for the 0% base tier.
    if (idx > lastMilestoneIndexRef.current && idx > 0) {
      setShowConfetti(true); setLastMilestoneIndex(idx); lastMilestoneIndexRef.current = idx;
      if (confettiTimerRef.current) { window.clearTimeout(confettiTimerRef.current); confettiTimerRef.current = null; }
      confettiTimerRef.current = window.setTimeout(() => { setShowConfetti(false); confettiTimerRef.current = null; }, 5000);
    } else if (idx !== lastMilestoneIndexRef.current) {
      setLastMilestoneIndex(idx);
      lastMilestoneIndexRef.current = idx;
    }
    return () => { if (confettiTimerRef.current) { window.clearTimeout(confettiTimerRef.current); confettiTimerRef.current = null; } };
  }, [revenue, getIndex]);

  React.useEffect(() => { if (!copied) return; const t = window.setTimeout(() => setCopied(false), 2500); return () => window.clearTimeout(t); }, [copied]);

  React.useEffect(() => {
    const updateSize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", updateSize); updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const decPatients = React.useCallback(() => setPatients((p) => Math.max(0, p - 1)), []);
  const openTnc = React.useCallback(() => setIsTncOpen(true), []);
  const closeTnc = React.useCallback(() => setIsTncOpen(false), []);

  return {
    patients, revenue, bonus, bonusPercent,              // bonusPercent NEW
    copied, showConfetti, isTncOpen, windowSize, promoCode, offerStart, offerEnd, isRefreshing,
    commission, baseCommission, bonusEarned,             // NEW
    totalCommissionEarned, isBonusApplied,               // NEW
    nextBonusMilestone,                                  // NEW
    milestone, next,
    dynamicMilestones,                                   // NEW — pass to stepper
    MILESTONES,
    history, isHistoryOpen,
    bankStatus, bankVerifiedAt, bankRejectionReason, bankLastUpdatedAt, bankNeedsAction,
    bankLoading, bankSubmitting, bankError, bankSuccess,
    holderName, setHolderName, bankName, setBankName,
    accountNo, setAccountNo, accountNoMasked,
    ifsc, setIfsc, loadBankDetails, submitBankDetails,
    setCopied, decPatients, openTnc, closeTnc, resetOffer, refreshDashboard,
    openHistory, closeHistory, setHistory,
  } as const;
};
