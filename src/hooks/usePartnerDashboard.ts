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
} from "../services/partnerService";

// ------------------- Shared types for history -------------------
export type PaymentStatus = "paid" | "pending" | "unpaid";

export interface CycleHistoryItem {
  id: string;                 // backend id or synthetic `${startDate}-${endDate}`
  startDate: string;          // ISO date
  endDate: string;            // ISO date
  totalPatients: number;
  totalCommission: number;    // rupees
  paymentStatus: PaymentStatus;
  paymentRef?: string | null; // txn id / UTR
  paidAt?: string | null;     // ISO date if paid
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
 * Try backend first, then Preferences, then sample.
 * You can replace the fetch URL with your real endpoint.
 */
async function loadPartnerHistory(): Promise<CycleHistoryItem[]> {
  // 1) Backend (happy path)
  try {
    const res = await fetch("/api/partner/history", { credentials: "include" });
    if (res.ok) {
      const data = (await res.json()) as CycleHistoryItem[];
      if (Array.isArray(data)) return data;
    }
  } catch {
    // ignore; fall through to prefs
  }

  // 2) Capacitor Preferences
  try {
    const { value } = await Preferences.get({ key: HISTORY_PREFS_KEY });
    if (value) {
      const parsed = JSON.parse(value) as CycleHistoryItem[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore; fall through to sample
  }

  // 3) Sample (safe demo content)
  const today = new Date();
  const d = (days: number) => {
    const t = new Date(today);
    t.setDate(t.getDate() + days);
    return t.toISOString();
  };

  return [
    {
      id: "demo-1",
      startDate: d(-45), // 45 days ago
      endDate: d(-30),   // 30 days ago
      totalPatients: 7,
      totalCommission: 7 * 75,
      paymentStatus: "paid",
      paymentRef: "UTR1234567",
      paidAt: d(-25),
    },
    {
      id: "demo-2",
      startDate: d(-30),
      endDate: d(-15),
      totalPatients: 4,
      totalCommission: 4 * 50,
      paymentStatus: "pending",
    },
    {
      id: "demo-3",
      startDate: d(-15),
      endDate: d(0),
      totalPatients: 12,
      totalCommission: 12 * 100,
      paymentStatus: "unpaid",
    },
  ];
}

/** Optionally persist to Preferences after successful fetch/merge */
async function savePartnerHistory(cycles: CycleHistoryItem[]) {
  try {
    await Preferences.set({
      key: HISTORY_PREFS_KEY,
      value: JSON.stringify(cycles),
    });
  } catch {
    // non-fatal
  }
}

// ------------------- Core dashboard hook -------------------
export const usePartnerDashboard = () => {
  // state (matches original)
  const [patients, setPatients] = React.useState<number>(0);
  const [copied, setCopied] = React.useState(false);
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [isTncOpen, setIsTncOpen] = React.useState(false);

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

  // offer cycle (default to same start/end as original)
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

  // ---------- History state & modal controls ----------
  const [history, setHistory] = React.useState<CycleHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);
  const openHistory = React.useCallback(() => setIsHistoryOpen(true), []);
  const closeHistory = React.useCallback(() => setIsHistoryOpen(false), []);

  // Load history once (backend -> prefs -> sample). Save to prefs for quick subsequent loads.
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const cycles = await loadPartnerHistory();
      if (!mounted) return;
      setHistory(cycles);
      // store for offline/demo convenience
      savePartnerHistory(cycles);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // ---------- Milestone confetti (index-based) ----------
  const getIndex = React.useCallback(
    (count: number) => getMilestoneIndex(count),
    []
  );

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

  // ✅ Load promo code & createdAt from Preferences (same behavior as original)
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await loadPartnerDataFromPrefs();
        if (!mounted) return;
        setPromoCode(data.promoCode);
        setOfferStart(data.offerStart);
        setOfferEnd(data.offerEnd);
      } catch {
        // fall back handled by defaults already set
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // copy feedback reset (same timing)
  React.useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2500);
    return () => window.clearTimeout(t);
  }, [copied]);

  // ✅ Responsive window size
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
  const incPatients = React.useCallback(() => setPatients((p) => p + 1), []);
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
    incPatients,
    openTnc,
    closeTnc,
    resetOffer,

    // history actions
    openHistory,
    closeHistory,
    setHistory, // exposed in case you refresh after paying a cycle
  } as const;
};
