import axios from "axios";
import { Preferences } from "@capacitor/preferences";

const API_BASE = "https://service.thelifesavers.in/api/partner/pricing";

/* ---------------- Types ---------------- */
export type LabType = "thyrocare" | "healthians" | "dr_mittal";

export interface PricingItem {
  id: string;
  lab: LabType;
  partnerType: "chemist" | "clinic" | "gym";
  name: string;
  b2bPrice: number;
  b2cPrice: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

type PricingResponse = {
  success: boolean;
  data: PricingItem[];
};

/* ---------------- Token Helper ---------------- */
async function getAuthToken(): Promise<string | null> {
  try {
    const { value } = await Preferences.get({ key: "token" });
    if (value) return value;
  } catch {}

  try {
    const raw = localStorage.getItem("token");
    if (raw) return raw.replace(/^"|"$/g, "");
  } catch {}

  return null;
}

/* ---------------- API Calls ---------------- */

export async function fetchPricingTests(
  lab: LabType
): Promise<PricingItem[]> {
  const token = await getAuthToken();

  const res = await axios.get<PricingResponse>(
    `${API_BASE}/tests`,
    {
      params: { lab },
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }
  );

  return res.data.data ?? [];
}

export async function fetchPricingPackages(
  lab: LabType
): Promise<PricingItem[]> {
  const token = await getAuthToken();

  const res = await axios.get<PricingResponse>(
    `${API_BASE}/packages`,
    {
      params: { lab },
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }
  );

  return res.data.data ?? [];
}
