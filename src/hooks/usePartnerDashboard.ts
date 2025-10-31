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
 * (Your UI already handles empty gracefully.)
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

  // 3) Empty fallback (you can keep the old sample if you prefer demo data)
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
