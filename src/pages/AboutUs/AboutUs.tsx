import React from "react";
import {
  FaHeartbeat,
  FaUsers,
  FaGlobe,
  FaRegSmileBeam,
  FaArrowLeft,
  FaShieldAlt,
  FaLightbulb,
  FaFlask,
  FaHome,
  FaCheckCircle,
  FaClipboardCheck,
  FaMicroscope,
  FaCogs,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AboutUs: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-white flex items-center justify-center p-6"
      style={{ paddingTop: "4rem", paddingBottom: "4rem" }}
    >
      <div className="bg-white rounded-2xl shadow-lg max-w-6xl w-full overflow-hidden relative animate-fade-in">

        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-400 text-white text-center py-10 px-6 relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 sm:top-1/2 sm:left-6 transform sm:-translate-y-1/2 
                       p-2 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition"
            aria-label="Go back"
          >
            <FaArrowLeft size={20} />
          </button>
          <h1 className="text-4xl font-bold mb-3">About Us</h1>
          <p className="text-lg opacity-90 max-w-3xl mx-auto">
            The Life Savers — Your Trusted Platform for Donor Matching & Diagnostic Healthcare Services
          </p>
        </div>

        {/* Main Content */}
        <div className="py-12 px-6 sm:px-10 space-y-10">

          {/* Introduction */}
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
            <strong>The Life Savers</strong> is a comprehensive digital health ecosystem designed to simplify 
            access to critical resources — from blood donor matching to diagnostic lab tests with 
            home sample collection. Our platform connects patients, donors, caregivers, doctors, partner 
            laboratories, and phlebotomists under one secure and reliable system.
          </p>

          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
            We combine technology, healthcare expertise, and logistics to offer life-saving support 
            when it matters the most. Whether you need a blood donor, a full-body health check, or 
            doorstep sample collection, The Life Savers is built to serve you with speed, reliability, 
            and transparency.
          </p>

          {/* OUR TWO MAIN SERVICES */}
          <h2 className="text-3xl font-bold text-red-600 text-center">Our Two Core Services</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

            <div className="space-y-4 text-center">
              <div className="text-red-600"><FaUsers size={55} /></div>
              <h3 className="text-2xl font-semibold">Blood Donor Matching</h3>
              <p className="text-gray-700 text-lg">
                Our donor network helps connect individuals in need with available donors. We 
                provide verified donor availability indicators, privacy-safe communication, 
                and fast search features to ensure timely assistance.
              </p>
            </div>

            <div className="space-y-4 text-center">
              <div className="text-red-600"><FaFlask size={55} /></div>
              <h3 className="text-2xl font-semibold">Lab Test Booking & Home Sample Collection</h3>
              <p className="text-gray-700 text-lg">
                Book diagnostic tests from trusted partner labs across India. We offer 
                doorstep sample collection, real-time updates, secure digital reports, 
                online payments, and transparent pricing.
              </p>
            </div>

          </div>

          {/* PARTNER ECOSYSTEM */}
          <h2 className="text-3xl font-bold text-red-600 text-center">
            Our Partner Ecosystem
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
            To expand healthcare accessibility and create opportunities for healthcare
            professionals and businesses, we launched the
            <strong> The Life Savers Partners</strong> platform.
            This partner program enables doctors, chemists, clinics, and wellness centers
            to connect patients with diagnostic services while earning attractive
            commissions.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center mt-6">

            <div>
              <div className="text-red-600 flex justify-center"><FaHeartbeat size={45} /></div>
              <h3 className="text-xl font-semibold mt-3">Doctors</h3>
              <p className="text-gray-600">
                Doctors can refer patients for diagnostic tests and track orders through the partner dashboard.
              </p>
            </div>

            <div>
              <div className="text-red-600 flex justify-center"><FaUsers size={45} /></div>
              <h3 className="text-xl font-semibold mt-3">Chemists / Medical Stores</h3>
              <p className="text-gray-600">
                Chemists and pharmacies can offer diagnostic bookings to their customers and earn commissions.
              </p>
            </div>

            <div>
              <div className="text-red-600 flex justify-center"><FaHome size={45} /></div>
              <h3 className="text-xl font-semibold mt-3">Clinics</h3>
              <p className="text-gray-600">
                Clinics can expand services by offering lab tests through The Life Savers partner network.
              </p>
            </div>

            <div>
              <div className="text-red-600 flex justify-center"><FaRegSmileBeam size={45} /></div>
              <h3 className="text-xl font-semibold mt-3">Gyms & Wellness Centers</h3>
              <p className="text-gray-600">
                Fitness centers can recommend health checkups and earn incentives for every successful booking.
              </p>
            </div>

          </div>

          <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto mt-6">
            Each approved partner receives a unique referral code. When users place orders
            through The Life Savers app using that referral code, the system automatically
            tracks the booking and credits commissions to the partner once the order is
            successfully completed.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
            The partner program operates on a <strong>7-day commission cycle</strong> starting
            from the partner's registration date. Partners can unlock additional earnings
            through milestone rewards based on overall revenue generated within a cycle.
            After successful cycle completion, payouts are processed to the partner.
          </p>

          {/* MISSION / VISION / VALUES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">

            <div className="text-center space-y-4">
              <div className="text-red-600"><FaHeartbeat size={50} /></div>
              <h2 className="text-xl font-semibold">Our Mission</h2>
              <p className="text-gray-600">
                To ensure timely access to essential healthcare resources — from blood donors 
                to pathology testing — powered by technology and trust.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="text-red-600"><FaLightbulb size={50} /></div>
              <h2 className="text-xl font-semibold">Our Vision</h2>
              <p className="text-gray-600">
                To become India's most trusted digital health platform, improving accessibility 
                and supporting millions with fast, safe and connected care.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="text-red-600"><FaRegSmileBeam size={50} /></div>
              <h2 className="text-xl font-semibold">Our Values</h2>
              <p className="text-gray-600">
                Reliability, compassion, privacy, innovation, and patient empowerment.
              </p>
            </div>

          </div>

          {/* HOW LAB SERVICES WORK */}
          <h2 className="text-3xl font-bold text-red-600 text-center">How Our Lab Services Work</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mt-6">

            <div className="text-center space-y-4">
              <div className="text-red-600"><FaClipboardCheck size={50} /></div>
              <h3 className="text-xl font-semibold">1. Book Your Test</h3>
              <p className="text-gray-600">
                Choose from a wide range of tests, compare prices, and book instantly.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="text-red-600"><FaHome size={50} /></div>
              <h3 className="text-xl font-semibold">2. Home Sample Collection</h3>
              <p className="text-gray-600">
                A trained phlebotomist visits your home at your selected time slot.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="text-red-600"><FaMicroscope size={50} /></div>
              <h3 className="text-xl font-semibold">3. Lab Processing & Reports</h3>
              <p className="text-gray-600">
                Accredited labs analyze your samples and upload reports securely inside your account.
              </p>
            </div>

          </div>

          {/* TECHNOLOGY & SECURITY */}
          <h2 className="text-3xl font-bold text-red-600">Technology & Security</h2>

          <div className="flex flex-col gap-3 text-lg text-gray-700">
            <p><FaShieldAlt className="inline mr-2 text-red-600" />Encrypted data transfer for all health data</p>
            <p><FaCogs className="inline mr-2 text-red-600" />Cloud-based secure infrastructure</p>
            <p><FaCheckCircle className="inline mr-2 text-red-600" />Role-based access control for labs and staff</p>
            <p><FaGlobe className="inline mr-2 text-red-600" />Global best practices in digital health security</p>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center py-6">
            <a
              href="mailto:support@thelifesavers.in"
              className="inline-block px-6 py-3 bg-red-600 text-white rounded-full shadow-md 
                         hover:bg-red-700 transition text-center"
            >
              Email: support@thelifesavers.in
            </a>

            <a
              href="tel:+918307497771"
              className="inline-block px-6 py-3 border border-red-600 text-red-600 rounded-full 
                         shadow-sm hover:bg-red-50 transition text-center"
            >
              Call: +91 83074-97771
            </a>
          </div>

          <p className="text-sm text-gray-500 text-center">
            The Life Savers is a technology platform. Medical decisions, sample analysis and clinical interpretation
            are performed by licensed medical professionals and accredited partner laboratories.
          </p>

        </div>
      </div>
    </div>
  );
};

export default AboutUs;