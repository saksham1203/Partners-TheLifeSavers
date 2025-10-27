// src/services/partnerService.ts
import { Preferences } from "@capacitor/preferences";

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
