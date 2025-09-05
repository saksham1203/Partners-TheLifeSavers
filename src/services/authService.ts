import axios, { AxiosResponse } from "axios";
import { Preferences } from "@capacitor/preferences";

// Choose API URL based on environment
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Async helper to get token from Capacitor Preferences
const getAuthToken = async (): Promise<string | null> => {
  const { value } = await Preferences.get({ key: "token" });
  return value;
};

// Login Request
export const loginRequest = async (data: {
  identifier: string;
  password: string;
  rememberMe: boolean;
}) => {
  try {
    const response: AxiosResponse<any> = await axios.post(
      `${API_URL}/partners/login`,
      data,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Login request failed:", error);
    const errorMessage = error.response?.data?.message || "Failed to login";
    throw new Error(errorMessage);
  }
};

// Send OTP
export const sendOtp = (
  email: string
): Promise<AxiosResponse<any>> => {
  return axios
    .post(
      `${API_URL}/send-verification-otp`,
      { email },
      { withCredentials: true }
    )
    .catch((error) => {
      console.error("Failed to send OTP:", error);
      throw error;
    });
};

// Verify OTP
export const verifyOtp = (
  email: string,
  otp: string
): Promise<AxiosResponse<any>> => {
  return axios
    .post(
      `${API_URL}/verify-otp`,
      { email, otp },
      { withCredentials: true }
    )
    .catch((error) => {
      console.error("Failed to verify OTP:", error);
      throw error;
    });
};

// ✅ Register Partner User
export interface NewUser {
  // Keep both options so caller can send either:
  // - firstName & lastName (preferred for partner API), or
  // - name (older flow that concatenates first+last)
  firstName?: string;
  lastName?: string;
  name?: string;

  email: string;
  password: string;
  mobileNumber: string; // raw number like "9876543210" or "+919876543210"
  dob: string;
  gender: string;
  address: string;
  pincode: string;
  partnerType: string;
  otherPartnerType?: string;
  shopName?: string;
  termsAccepted?: boolean;
}

/**
 * Helper: convert incoming newUser into the exact API body required by
 * POST /api/partners/register
 */
const buildPartnerPayload = (newUser: NewUser) => {
  // Derive firstName/lastName: prefer explicit firstName/lastName, otherwise split `name`
  let firstName = newUser.firstName ?? "";
  let lastName = newUser.lastName ?? "";

  if (!firstName && newUser.name) {
    const parts = newUser.name.trim().split(" ");
    firstName = parts.shift() ?? "";
    lastName = parts.join(" ");
  }

  // Mobile: API example uses "mobile" without country code.
  // If caller passed +91..., strip it; otherwise send as-is.
  let mobile = newUser.mobileNumber ?? "";
  if (mobile.startsWith("+91")) {
    mobile = mobile.replace(/^\+91/, "");
  } else if (mobile.startsWith("91") && mobile.length === 12) {
    // handle "919876543210" -> "9876543210"
    mobile = mobile.replace(/^91/, "");
  }

  return {
    firstName,
    lastName,
    email: newUser.email,
    password: newUser.password,
    mobile,
    dob: newUser.dob,
    gender: newUser.gender,
    partnerType: newUser.partnerType,
    shopName: newUser.shopName,
    pincode: newUser.pincode,
    address: newUser.address,
    // include other fields if backend needs them
    otherPartnerType: newUser.otherPartnerType,
  };
};

export const registerUser = (
  newUser: NewUser
): Promise<AxiosResponse<any>> => {
  // Build payload matching the example you provided
  const payload = buildPartnerPayload(newUser);

  // Use '/partners/register' to match your API endpoint
  return axios
    .post(`${API_URL}/partners/register`, payload, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    })
    .catch((error) => {
      console.error("User registration failed:", error);
      throw error;
    });
};

// Verify Password
export const verifyPassword = async (password: string) => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error("No authentication token found");

    const response = await axios.post(
      `${API_URL}/verify-password`,
      { password },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Password verification failed:", error);
    const errorMessage =
      error.response?.data?.message || "Failed to verify password";
    throw new Error(errorMessage);
  }
};
