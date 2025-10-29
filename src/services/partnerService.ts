// src/services/partnerService.ts
import axios from "axios";
import { Preferences } from "@capacitor/preferences";

/* ------------------------- EXISTING CODE (unchanged) ------------------------- */

export interface Milestone {
  min: number;
  max: number;
  rate: number;
}

export const MILESTONES: Milestone[] = [
  { min: 0, max: 5, rate: 50 },
  { min: 6, max: 10, rate: 75 },
  { min: 11, max: Number.POSITIVE_INFINITY, rate: 100 },
];

export const DEFAULT_PROMO_CODE = "LSAVE123";
export const DEFAULT_CYCLE_LENGTH_DAYS = 15;
export const DEFAULT_CYCLE_START = new Date("2025-09-01T00:00:00");

export const calculateCommission = (totalPatients: number): number => {
  if (totalPatients <= 0) return 0;
  const milestone = MILESTONES.find(
    (m) => totalPatients >= m.min && totalPatients <= m.max
  );
  return milestone ? totalPatients * milestone.rate : 0;
};

export const currentMilestone = (totalPatients: number): Milestone | null =>
  MILESTONES.find((m) => totalPatients >= m.min && totalPatients <= m.max) ?? null;

export const nextMilestone = (totalPatients: number): Milestone | null =>
  MILESTONES.find((m) => totalPatients < m.min) ?? null;

export const getMilestoneIndex = (count: number) =>
  MILESTONES.findIndex((m) => count >= m.min && count <= m.max);

const addDays = (d: Date, days: number) => new Date(d.getTime() + days * 24 * 60 * 60 * 1000);

export type LoadedPartnerData = {
  promoCode: string;
  offerStart: Date;
  offerEnd: Date;
};

/**
 * Loads promo code and 15-day cycle dates from Capacitor Preferences.
 * Mirrors the logic used in your original component.
 */
export async function loadPartnerDataFromPrefs(): Promise<LoadedPartnerData> {
  try {
    const [{ value: promoValue }, { value: userJson }] = await Promise.all([
      Preferences.get({ key: "promocode" }),
      Preferences.get({ key: "user" }),
    ]);

    let promoCode = promoValue && promoValue.length > 0 ? promoValue : DEFAULT_PROMO_CODE;
    let offerStart = DEFAULT_CYCLE_START;
    let offerEnd = addDays(DEFAULT_CYCLE_START, DEFAULT_CYCLE_LENGTH_DAYS);

    if (userJson) {
      try {
        const user = JSON.parse(userJson);

        // promocode fallback from user object
        if (!promoValue || promoValue.length === 0) {
          if (user?.promocode) promoCode = user.promocode;
          else if (user?.referralCode) promoCode = user.referralCode;
        }

        // derive cycle from createdAt (date-only midnight local)
        if (user?.createdAt) {
          const parsed = new Date(user.createdAt);
          if (!isNaN(parsed.getTime())) {
            const dateOnly = new Date(parsed);
            dateOnly.setHours(0, 0, 0, 0);
            offerStart = dateOnly;
            offerEnd = addDays(dateOnly, DEFAULT_CYCLE_LENGTH_DAYS);
          }
        }
      } catch {
        // ignore parse errors
      }
    }

    return { promoCode, offerStart, offerEnd };
  } catch {
    return {
      promoCode: DEFAULT_PROMO_CODE,
      offerStart: DEFAULT_CYCLE_START,
      offerEnd: addDays(DEFAULT_CYCLE_START, DEFAULT_CYCLE_LENGTH_DAYS),
    };
  }
}

/* ----------------------------- NEW: API LAYER ----------------------------- */

const API_BASE = "https://dev-service-thelifesavers-in.onrender.com/api";

/** Try Capacitor Preferences first, then fall back to localStorage (web). */
async function getAuthToken(): Promise<string | null> {
  try {
    const { value } = await Preferences.get({ key: "token" });
    if (value) return value;
  } catch {}
  try {
    // direct key
    const direct = window?.localStorage?.getItem?.("token");
    if (direct) return direct.replace(/^"|"$/g, "");

    // Capacitor web prefix (varies), find by name
    const key = Object.keys(window?.localStorage ?? {}).find((k) =>
      k.toLowerCase().includes("capacitorstorage:token")
    );
    if (key) {
      const raw = window.localStorage.getItem(key);
      if (raw) return raw.replace(/^"|"$/g, "");
    }
  } catch {}
  return null;
}

function mapPayoutStatusToPaymentStatus(s?: string): "paid" | "pending" | "unpaid" {
  switch ((s ?? "").toUpperCase()) {
    case "PAID":
      return "paid";
    case "PENDING":
      return "pending";
    default:
      return "unpaid";
  }
}

/* ---------- Types that mirror your backend responses ---------- */

export type BackendTier = { min: number; max: number; rate: number };

export type BackendDashboard = {
  success: boolean;
  promoCode: string;
  cycle: {
    start: string;
    end: string;
    index: number;
    number: number;
    label: string;
    payout?: {
      id: string;
      status: "PAID" | "PENDING" | "UNPAID";
      commission: number;
      patients: number;
      paidAt?: string;
      note?: string;
    };
  };
  patients: number;
  commission: number;
  tier: BackendTier;
  nextTier?: { rate: number; need: number } | null;
  breakdown: Array<{ range: string; rate: number; count: number; commission: number }>;
  recentReferrals: Array<{
    id: string;
    orderId: string;
    patientName: string;
    status: string;
    total: number;
    createdAt: string;
  }>;
  updatedAt: string;
};

export type BackendCycles = {
  success: boolean;
  cycles: Array<{
    start: string;
    end: string;
    patients: number;
    commission: number;
    tier: BackendTier;
    payout?: {
      id: string;
      status: "PAID" | "PENDING" | "UNPAID";
      commission: number;
      patients: number;
      paidAt?: string;
      note?: string;
    } | null;
  }>;
};

export type BackendReferrals = {
  success: boolean;
  referrals: Array<{
    id: string;
    orderId: string;
    patientName: string;
    status: string;
    total: number;
    createdAt: string;
  }>;
  nextCursor: string | null;
};

/* ----------------- Public service functions (axios inside) ----------------- */

/** GET /partners/me/dashboard */
export async function fetchPartnerDashboard(): Promise<BackendDashboard> {
  const token = await getAuthToken();
  const res = await axios.get<BackendDashboard>(`${API_BASE}/partners/me/dashboard`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    withCredentials: true,
  });
  return res.data;
}

/** GET /partners/me/cycles */
export async function fetchPartnerCycles(): Promise<BackendCycles> {
  const token = await getAuthToken();
  const res = await axios.get<BackendCycles>(`${API_BASE}/partners/me/cycles`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    withCredentials: true,
  });
  return res.data;
}

/** GET /partners/me/referrals?limit=5&cursor=... */
export async function fetchPartnerReferrals(
  limit = 5,
  cursor?: string
): Promise<BackendReferrals> {
  const token = await getAuthToken();
  const res = await axios.get<BackendReferrals>(
    `${API_BASE}/partners/me/referrals`,
    {
      params: { limit, cursor },
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      withCredentials: true,
    }
  );
  return res.data;
}

/* -------- Helpers to map backend cycles -> UI modal type (history) -------- */

export type PaymentStatus = "paid" | "pending" | "unpaid";
export interface CycleHistoryItem {
  id: string;                 // If backend has no id per cycle, derive from start-end label
  startDate: string;
  endDate: string;
  totalPatients: number;
  totalCommission: number;
  paymentStatus: PaymentStatus;
  paymentRef?: string | null;
  paidAt?: string | null;
}

/** Map backend cycles to your PartnerHistoryModal items */
export function mapBackendCyclesToHistoryItems(data: BackendCycles): CycleHistoryItem[] {
  return (data.cycles ?? []).map((c) => {
    const payout = c.payout ?? undefined;
    return {
      id: `${c.start}-${c.end}`,
      startDate: c.start,
      endDate: c.end,
      totalPatients: c.patients,
      totalCommission: c.commission,
      paymentStatus: mapPayoutStatusToPaymentStatus(payout?.status),
      paymentRef: payout?.note ?? null, // storing UTR/note here; adjust if you add a dedicated field
      paidAt: payout?.paidAt ?? null,
    };
  });
}

/** Convenience: returns { promoCode, offerStart, offerEnd } from backend dashboard */
export async function loadPartnerDataFromAPI(): Promise<LoadedPartnerData> {
  const d = await fetchPartnerDashboard();
  return {
    promoCode: d.promoCode || DEFAULT_PROMO_CODE,
    offerStart: new Date(d.cycle.start),
    offerEnd: new Date(d.cycle.end),
  };
}
