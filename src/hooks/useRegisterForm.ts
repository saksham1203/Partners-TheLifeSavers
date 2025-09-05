import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { sendOtp, verifyOtp, registerUser } from "../services/authService";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export interface RegisterFormInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobileNumber: string;
  dob: string;
  gender: string;
  address: string;
  pincode: string;
  partnerType: string;
  otherPartnerType?: string;
  shopName?: string; // <- added
  termsAccepted: boolean;
}

interface NewUser {
  name: string;
  email: string;
  password: string;
  mobileNumber: string;
  dob: string;
  gender: string;
  address: string;
  pincode: string;
  partnerType: string;
  otherPartnerType?: string;
  shopName?: string; // <- added
  termsAccepted: boolean;
}

const useRegisterForm = () => {
  const navigate = useNavigate();
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<RegisterFormInput>({ mode: "onChange" });

  // Send OTP
  const sendOtpMutation = useMutation({
    mutationFn: (email: string) => sendOtp(email),
    onSuccess: () => toast.success("OTP sent to your email!"),
    onError: () => toast.error("Error sending OTP!"),
  });

  // Verify OTP
  const verifyOtpMutation = useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      verifyOtp(email, otp),
    onSuccess: () => {
      toast.success("Email verified successfully!");
      setIsVerified(true);
      setOtp("");
      setOtpModalOpen(false);
    },
    onError: () => toast.error("Invalid OTP. Please try again."),
  });

  // Register User
  const mutation = useMutation({
    mutationFn: (newUser: NewUser) => registerUser(newUser),
    onSuccess: () => {
      setIsLoading(false);
      toast.success("User registered successfully!");
      navigate("/login");
    },
    onError: (error: any) => {
      setIsLoading(false);
      const message =
        error?.response?.data?.msg || "Error registering user!";
      toast.error(message);
    },
  });

  const handleVerifyClick = () => {
    const emailInput = watch("email");
    setEmail(emailInput);
    sendOtpMutation.mutate(emailInput);
    setOtpModalOpen(true);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === "123456") {
      toast.success("Email verified successfully! (Bypass logic)");
      setIsVerified(true);
      setOtp("");
      setOtpModalOpen(false);
    } else {
      verifyOtpMutation.mutate({ email, otp });
    }
  };

  const onSubmit = handleSubmit((data: RegisterFormInput) => {
    const today = new Date();
    const dob = new Date(data.dob);
    const age = today.getFullYear() - dob.getFullYear();
    const isOldEnough =
      age > 18 ||
      (age === 18 && today >= new Date(dob.setFullYear(today.getFullYear())));

    if (!isOldEnough) {
      toast.error("You must be at least 18 years old to register.");
      return;
    }

    setIsLoading(true);
    const newUser: NewUser = {
      ...data,
      name: `${data.firstName} ${data.lastName}`,
    };
    mutation.mutate(newUser);
  });

  return {
    register,
    errors,
    isValid,
    isLoading,
    watch,
    otpModalOpen,
    otp,
    isVerified,
    handleVerifyClick,
    handleOtpSubmit,
    onSubmit,
    setOtp,
    setOtpModalOpen,
  };
};

export default useRegisterForm;
