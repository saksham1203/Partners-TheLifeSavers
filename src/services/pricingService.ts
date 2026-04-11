import axios from "axios";
import { Preferences } from "@capacitor/preferences";

const API_BASE = "https://services.thelifesavers.in/api/partner/pricing";

/* ---------------- Types ---------------- */

export type LabType = "thyrocare" | "healthians" | "dr_mittal" | "maxx_path_diagnostics";

export interface PricingItem {
  name: string;
  mrp: number;     // B2C
  b2p: number;     // Partner price
  margin: number;  // earning
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