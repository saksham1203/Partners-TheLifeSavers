// src/services/partnerService.ts
import axios from "axios";
import { Preferences } from "@capacitor/preferences";

/* -------------------------------------------------------------------------- */
/*                        REVENUE BONUS SLAB STEPPER                          */
/* -------------------------------------------------------------------------- */

export interface Milestone {
  min: number;
  max: number;
  rate: number; // now represents BONUS %
}

/**
 * We keep same stepper structure,
 * but now it represents revenue bonus %
 */
export const MILESTONES: Milestone[] = [
  { min: 0, max: 4999, rate: 0 },
  { min: 5000, max: 7999, rate: 5 },
  { min: 8000, max: 9999, rate: 8 },
  { min: 10000, max: Number.POSITIVE_INFINITY, rate: 10 },
];

export const DEFAULT_PROMO_CODE = "LSAVE123";

/**
 * Cycle length is now controlled fully by backend (7 days).
 * These defaults are only fallback values.
 */
export const DEFAULT_CYCLE_LENGTH_DAYS = 7;
export const DEFAULT_CYCLE_START = new Date("2025-09-01T00:00:00");

/**
 * Commission is now FULLY backend-driven.
 * This function is kept only for fallback safety.
 */
export const calculateCommission = (revenue: number): number => {
  return revenue;
};

export const currentMilestone = (revenue: number): Milestone | null =>
  MILESTONES.find((m) => revenue >= m.min && revenue <= m.max) ?? null;

export const nextMilestone = (revenue: number): Milestone | null =>
  MILESTONES.find((m) => revenue < m.min) ?? null;

export const getMilestoneIndex = (revenue: number) =>
  MILESTONES.findIndex((m) => revenue >= m.min && revenue <= m.max);

const addDays = (d: Date, days: number) =>
  new Date(d.getTime() + days * 24 * 60 * 60 * 1000);

export type LoadedPartnerData = {
  promoCode: string;
  offerStart: Date;
  offerEnd: Date;
};

/* -------------------------------------------------------------------------- */
/*                           LOAD FROM CAPACITOR PREFS                        */
/* -------------------------------------------------------------------------- */

export async function loadPartnerDataFromPrefs(): Promise<LoadedPartnerData> {
  try {
    const [{ value: promoValue }, { value: userJson }] = await Promise.all([
      Preferences.get({ key: "promocode" }),
      Preferences.get({ key: "user" }),
    ]);

    let promoCode =
      promoValue && promoValue.length > 0 ? promoValue : DEFAULT_PROMO_CODE;

    let offerStart = DEFAULT_CYCLE_START;
    let offerEnd = addDays(DEFAULT_CYCLE_START, DEFAULT_CYCLE_LENGTH_DAYS);

    if (userJson) {
      try {
        const user = JSON.parse(userJson);

        if (!promoValue || promoValue.length === 0) {
          if (user?.promocode) promoCode = user.promocode;
          else if (user?.referralCode) promoCode = user.referralCode;
        }

        if (user?.createdAt) {
          const parsed = new Date(user.createdAt);
          if (!isNaN(parsed.getTime())) {
            offerStart = new Date(parsed);
            offerEnd = addDays(offerStart, DEFAULT_CYCLE_LENGTH_DAYS);
          }
        }
      } catch {}
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

/* -------------------------------------------------------------------------- */
/*                                API CONFIG                                  */
/* -------------------------------------------------------------------------- */

const API_BASE = "https://services.thelifesavers.in/api";

async function getAuthToken(): Promise<string | null> {
  try {
    const { value } = await Preferences.get({ key: "token" });
    if (value) return value;
  } catch {}

  try {
    const direct = window?.localStorage?.getItem?.("token");
    if (direct) return direct.replace(/^"|"$/g, "");
  } catch {}

  return null;
}

function mapPayoutStatusToPaymentStatus(
  s?: string
): "paid" | "pending" | "unpaid" {
  switch ((s ?? "").toUpperCase()) {
    case "PAID":
      return "paid";
    case "PENDING":
      return "pending";
    default:
      return "unpaid";
  }
}

/* -------------------------------------------------------------------------- */
/*                              BACKEND TYPES                                 */
/* -------------------------------------------------------------------------- */

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
  revenue: number;
  bonus: number;
  commission: number;

  recentReferrals: Array<{
    id: string;
    orderId: string;
    patientName: string;
    status: string;
    total: number;
    createdAt: string;
  }>;

  bankStatus?: "PENDING" | "VERIFIED" | "REJECTED";
  bankVerifiedAt?: string | null;
  bankRejectionReason?: string | null;
  bankLastUpdatedAt?: string | null;

  updatedAt: string;
};

export type BackendCycles = {
  success: boolean;
  cycles: Array<{
    start: string;
    end: string;
    patients: number;
    revenue: number;
    bonus: number;
    commission: number;
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

/* -------------------------------------------------------------------------- */
/*                               MAIN API CALLS                               */
/* -------------------------------------------------------------------------- */

export async function fetchPartnerDashboard(): Promise<BackendDashboard> {
  const token = await getAuthToken();
  const res = await axios.get<BackendDashboard>(
    `${API_BASE}/partners/me/dashboard`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      withCredentials: true,
    }
  );
  return res.data;
}

export async function fetchPartnerCycles(): Promise<BackendCycles> {
  const token = await getAuthToken();
  const res = await axios.get<BackendCycles>(
    `${API_BASE}/partners/me/cycles`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      withCredentials: true,
    }
  );
  return res.data;
}

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

/* -------------------------------------------------------------------------- */
/*                        MAP CYCLES → HISTORY MODAL                          */
/* -------------------------------------------------------------------------- */

export type PaymentStatus = "paid" | "pending" | "unpaid";

export interface CycleHistoryItem {
  id: string;
  startDate: string;
  endDate: string;
  totalPatients: number;
  totalRevenue: number;
  totalBonus: number;
  totalCommission: number;
  paymentStatus: PaymentStatus;
  paymentRef?: string | null;
  paidAt?: string | null;
}

export function mapBackendCyclesToHistoryItems(
  data: BackendCycles
): CycleHistoryItem[] {
  return (data.cycles ?? []).map((c) => {
    const payout = c.payout ?? undefined;
    return {
      id: `${c.start}-${c.end}`,
      startDate: c.start,
      endDate: c.end,
      totalPatients: c.patients,
      totalRevenue: c.revenue,
      totalBonus: c.bonus,
      totalCommission: c.commission,
      paymentStatus: mapPayoutStatusToPaymentStatus(payout?.status),
      paymentRef: payout?.note ?? null,
      paidAt: payout?.paidAt ?? null,
    };
  });
}

export async function loadPartnerDataFromAPI(): Promise<LoadedPartnerData> {
  const d = await fetchPartnerDashboard();
  return {
    promoCode: d.promoCode || DEFAULT_PROMO_CODE,
    offerStart: new Date(d.cycle.start),
    offerEnd: new Date(d.cycle.end),
  };
}

/* -------------------------------------------------------------------------- */
/*                            ✅ BANK API                                     */
/* -------------------------------------------------------------------------- */

export type BankVerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export type BackendBankResponse = {
  success: boolean;
  message?: string;
  bank: null | {
    holderName: string;
    bankName?: string | null;
    accountNoMasked?: string;
    accountNo?: string;
    ifsc: string;
    status: BankVerificationStatus;
    rejectionReason?: string | null;
    verifiedAt?: string | null;
    updatedAt?: string | null;
  };
};

export async function fetchMyBank(): Promise<BackendBankResponse> {
  const token = await getAuthToken();
  const res = await axios.get<BackendBankResponse>(
    `${API_BASE}/partners/me/bank`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      withCredentials: true,
    }
  );
  return res.data;
}

export async function upsertMyBank(input: {
  holderName: string;
  bankName: string;
  accountNo: string;
  ifsc: string;
}): Promise<BackendBankResponse> {
  const token = await getAuthToken();
  const payload = {
    holderName: input.holderName?.trim(),
    bankName: input.bankName?.trim(),
    accountNo: String(input.accountNo ?? "").trim(),
    ifsc: String(input.ifsc ?? "").trim().toUpperCase(),
  };

  const res = await axios.put<BackendBankResponse>(
    `${API_BASE}/partners/me/bank`,
    payload,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      withCredentials: true,
    }
  );

  return res.data;
}