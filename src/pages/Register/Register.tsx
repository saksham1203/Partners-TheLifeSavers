import React, { useState } from "react";
import useRegisterForm from "../../hooks/useRegisterForm";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FiCheck } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

const Register: React.FC = () => {
  const { register, errors, isValid, isLoading, watch, onSubmit } =
    useRegisterForm();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const steps = [
    { id: 1, label: "Personal Details" },
    { id: 2, label: "Partner Details" },
    { id: 3, label: "Preview" },
  ];

  const formValues = watch();

  const handleOpenConfirmModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      // allow moving forward
    }
  };

  const handleConfirmSubmit = () => {
    onSubmit();
  };

  return (
    <div
      className="min-h-screen bg-white flex items-center justify-center p-4"
      style={{ paddingTop: "4rem", paddingBottom: "4rem" }}
    >
      <Toaster />
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden relative animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-400 text-white text-center py-8 px-6">
          <h1 className="text-4xl font-extrabold mb-2">Partner Registration</h1>
          <p className="text-sm text-red-100">
            Join the Life Savers Network as a Partner
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col sm:flex-row">
          {/* Video */}
          <div className="hidden sm:flex sm:w-1/2 h-[350px] justify-center items-center relative mt-24">
            <video
              src="https://res.cloudinary.com/dqm7wf4zi/video/upload/v1734541688/theLifeSaversVideo_mrchef.mp4"
              poster="https://res.cloudinary.com/dqm7wf4zi/image/upload/v1734541684/thelifesaverslogo_odohxz.png"
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-contain"
              aria-label="Background video"
              preload="auto"
            />
          </div>
          {/* Form */}
          <div className="w-full sm:w-1/2 p-8 flex flex-col justify-center items-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
              Join as{" "}
              <span className="text-3xl text-red-600 font-bold">
                Life Savers Partner
              </span>
            </h2>

            <div className="flex items-center mb-2 w-full">
              <hr className="flex-1 border-gray-300" />
              <span className="mx-4 text-sm text-gray-600">Register here</span>
              <hr className="flex-1 border-gray-300" />
            </div>

            <form
              onSubmit={handleOpenConfirmModal}
              className="space-y-4 w-full"
            >
              {/* Stepper */}
              <div className="w-full max-w-3xl mx-auto">
                <div className="flex items-center justify-between relative mb-8">
                  {/* Progress bar */}
                  <div className="absolute top-5 left-0 w-full">
                    <div className="absolute h-[2px] bg-gray-200 w-full max-w-[calc(100%-8rem)] left-1/2 -translate-x-1/2" />
                    <div
                      className="absolute h-[3px] bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300"
                      style={{
                        width: `${Math.max(
                          0,
                          ((step - 1) / (steps.length - 1)) *
                            (100 - 100 / steps.length)
                        )}%`,
                        left: "3.7rem",
                      }}
                    />
                  </div>
                  {/* Steps */}
                  <div className="relative z-10 w-full flex justify-between items-center gap-4">
                    {steps.map((s) => (
                      <div
                        key={s.id}
                        className="flex-1 flex flex-col items-center min-w-[80px]"
                      >
                        <div className="relative">
                          {step >= s.id && (
                            <div className="absolute inset-0 bg-red-400/20 rounded-full blur-lg transition-all duration-300 animate-pulse" />
                          )}
                          <div
                            className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full transition-all duration-300
                            ${
                              step >= s.id
                                ? "bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/30"
                                : "border-2 border-gray-200 bg-white"
                            }`}
                          >
                            {step > s.id ? (
                              <FiCheck className="h-4 w-4 md:h-5 md:w-5 text-white" />
                            ) : (
                              <span
                                className={`text-xs md:text-sm font-bold ${
                                  step >= s.id ? "text-white" : "text-gray-400"
                                }`}
                              >
                                {String(s.id).padStart(2, "0")}
                              </span>
                            )}
                          </div>
                        </div>
                        <span
                          className={`mt-2 text-xs md:text-sm font-bold text-center ${
                            step >= s.id ? "text-gray-900" : "text-gray-400"
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 1 - Personal */}
              {step === 1 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your first name"
                      {...register("firstName", {
                        required: "First name is required",
                        maxLength: {
                          value: 50,
                          message: "First name cannot exceed 50 characters",
                        },
                      })}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.firstName ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your last name"
                      {...register("lastName", {
                        required: "Last name is required",
                        maxLength: {
                          value: 50,
                          message: "Last name cannot exceed 50 characters",
                        },
                      })}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.lastName ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Invalid email address",
                        },
                      })}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                      })}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                    />
                    <div
                      className="absolute inset-y-11 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <AiFillEyeInvisible className="text-gray-500" />
                      ) : (
                        <AiFillEye className="text-gray-500" />
                      )}
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mobile Number
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        +91
                      </span>
                      <input
                        placeholder="10-digit mobile number"
                        {...register("mobileNumber", {
                          required: "Mobile number is required",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: "Must be a valid 10-digit mobile number",
                          },
                        })}
                        className={`flex-1 block w-full px-3 py-2 border ${
                          errors.mobileNumber
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-r-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                      />
                    </div>
                    {errors.mobileNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.mobileNumber.message}
                      </p>
                    )}
                  </div>

                  {/* DOB */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      DOB
                    </label>
                    <input
                      type="date"
                      {...register("dob", {
                        required: "DOB is required",
                        validate: (value) => {
                          const today = new Date();
                          const dob = new Date(value);
                          const age = today.getFullYear() - dob.getFullYear();
                          const isOldEnough =
                            age > 18 ||
                            (age === 18 &&
                              today >=
                                new Date(dob.setFullYear(today.getFullYear())));
                          return (
                            isOldEnough ||
                            "You must be at least 18 years old to register"
                          );
                        },
                      })}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.dob ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                    />
                    {errors.dob && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.dob.message}
                      </p>
                    )}
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      {...register("gender", {
                        required: "Gender is required",
                      })}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.gender ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2 - Partner */}
              {step === 2 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Partner Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Partner Type
                    </label>
                    <select
                      {...register("partnerType", {
                        required: "Partner type is required",
                      })}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.partnerType
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                    >
                      <option value="">Select Type</option>
                      <option value="chemist">Chemist</option>
                      <option value="clinic">Clinic</option>
                      <option value="gym">Gym</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.partnerType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.partnerType.message}
                      </p>
                    )}
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Pincode
                    </label>
                    <input
                      type="text"
                      placeholder="Enter pincode"
                      {...register("pincode", {
                        required: "Pincode is required",
                        pattern: {
                          value: /^[0-9]{6}$/,
                          message: "Pincode must be 6 digits",
                        },
                      })}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.pincode ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                    />
                    {errors.pincode && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.pincode.message}
                      </p>
                    )}
                  </div>

                  {/* If Other */}
                  {watch("partnerType") === "other" && (
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Specify Category
                      </label>
                      <input
                        type="text"
                        placeholder="Enter category"
                        {...register("otherPartnerType", {
                          required: "Please specify your category",
                          maxLength: {
                            value: 50,
                            message:
                              "Category name cannot exceed 50 characters",
                          },
                        })}
                        className={`mt-1 block w-full px-3 py-2 border ${
                          errors.otherPartnerType
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                      />
                      {errors.otherPartnerType && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.otherPartnerType.message}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Shop Name */}
<div className="sm:col-span-2">
  <label className="block text-sm font-medium text-gray-700">
    Shop Name
  </label>
  <input
    type="text"
    placeholder="Enter shop name"
    {...register("shopName", {
      required: "Shop name is required",
      maxLength: {
        value: 100,
        message: "Shop name cannot exceed 100 characters",
      },
    })}
    className={`mt-1 block w-full px-3 py-2 border ${
      errors.shopName ? "border-red-500" : "border-gray-300"
    } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
  />
  {errors.shopName && (
    <p className="text-red-500 text-sm mt-1">
      {errors.shopName.message}
    </p>
  )}
</div>


                  {/* Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <textarea
                      placeholder="Enter address"
                      {...register("address", {
                        required: "Address is required",
                        minLength: {
                          value: 5,
                          message: "Address must be at least 5 characters",
                        },
                      })}
                      rows={3}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.address ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3 - Preview */}
              {step === 3 && (
                <div className="w-full">
                  {/* Confirm Your Details */}
                  <div className="w-full bg-gray-50 border rounded-lg p-6 shadow-sm text-center">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-6">
                      Confirm Your Details
                    </h3>

                    {/* Details Section */}
                    <div className="max-w-2xl mx-auto space-y-4">
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-gray-600">
                          First Name:
                        </span>
                        <span className="text-gray-800">
                          {formValues.firstName}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-gray-600">
                          Last Name:
                        </span>
                        <span className="text-gray-800">
                          {formValues.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-gray-600">
                          Email:
                        </span>
                        <span className="text-gray-800">
                          {formValues.email}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-gray-600">
                          Mobile Number:
                        </span>
                        <span className="text-gray-800">
                          {formValues.mobileNumber}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-gray-600">DOB:</span>
                        <span className="text-gray-800">
                          {formValues.dob
                            ? new Date(formValues.dob).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )
                            : ""}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-gray-600">
                          Gender:
                        </span>
                        <span className="text-gray-800">
                          {formValues.gender}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-gray-600">
                          Partner Type:
                        </span>
                        <span className="text-gray-800">
                          {formValues.partnerType}{" "}
                          {formValues.partnerType === "other" &&
                            `(${formValues.otherPartnerType})`}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-gray-600">
                          Pincode:
                        </span>
                        <span className="text-gray-800">
                          {formValues.pincode}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
  <span className="font-medium text-gray-600">Shop Name:</span>
  <span className="text-gray-800">{formValues.shopName}</span>
</div>

                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-gray-600">
                          Address:
                        </span>
                        <span className="text-gray-800">
                          {formValues.address}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="mt-6 flex flex-col items-center">
                    <div className="flex items-center space-x-2">
                      <input
                        id="termsAccepted"
                        type="checkbox"
                        {...register("termsAccepted", { required: true })}
                        className="h-4 w-4 accent-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="termsAccepted"
                        className="text-sm text-gray-900"
                      >
                        I agree to the{" "}
                        <Link
                          to="/terms-and-conditions"
                          className="text-red-600 hover:text-red-500 font-medium"
                        >
                          Terms and Conditions
                        </Link>
                      </label>
                    </div>
                    {errors.termsAccepted && (
                      <p className="text-red-500 text-sm mt-2">
                        You must accept the terms to continue.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                {step > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-white"
                    >
                      Previous
                    </button>
                    {step < steps.length && (
                      <button
                        type="button"
                        onClick={() => setStep(step + 1)}
                        disabled={!isValid}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    )}
                  </>
                ) : (
                  <div className="flex justify-end w-full">
                    {step < steps.length && (
                      <button
                        type="button"
                        onClick={() => setStep(step + 1)}
                        disabled={!isValid}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    )}
                  </div>
                )}
                {step === steps.length && (
                  <button
                    type="button"
                    disabled={!isValid || isLoading}
                    onClick={handleConfirmSubmit}
                    className={`px-4 py-2 text-white rounded-lg bg-red-500 hover:bg-red-600 transition-transform transform duration-300 ${
                      (!isValid || isLoading) &&
                      "opacity-50 cursor-not-allowed hover:bg-red-500"
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <FaSpinner className="animate-spin h-5 w-5 text-white mr-2" />
                        Registering...
                      </div>
                    ) : (
                      "Confirm & Register"
                    )}
                  </button>
                )}
              </div>

              {/* Login link */}
              <div className="flex items-center mt-4">
                <hr className="flex-1 border-gray-300" />
                <span className="mx-4 text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-red-600 hover:text-red-500 font-medium"
                  >
                    Login here
                  </Link>
                </span>
                <hr className="flex-1 border-gray-300" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
