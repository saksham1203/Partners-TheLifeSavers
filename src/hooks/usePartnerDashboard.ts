// src/hooks/usePartnerDashboard.ts
import React from "react";
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

// ------------------- Core dashboard hook -------------------
export const usePartnerDashboard = () => {
  // state (matches original)
  const [patients, setPatients] = React.useState<number>(0);
  const [copied, setCopied] = React.useState(false);
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [isTncOpen, setIsTncOpen] = React.useState(false);

  const [windowSize, setWindowSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
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

    // actions
    setCopied,
    decPatients,
    incPatients,
    openTnc,
    closeTnc,
    resetOffer,
  } as const;
};
