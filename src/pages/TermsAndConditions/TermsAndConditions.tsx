import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TermsAndConditions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-white flex items-center justify-center p-6"
      style={{ paddingTop: "4rem", paddingBottom: "4rem" }}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden relative animate-fade-in">

        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-400 text-white text-center py-8 px-6 relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 sm:top-1/2 sm:left-6 transform sm:-translate-y-1/2 p-2 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition"
          >
            <FaArrowLeft size={18} />
          </button>

          <h1 className="text-3xl sm:text-4xl font-bold mb-2 mt-4 sm:mt-0">
            Terms & Conditions
          </h1>

          <p className="text-md sm:text-lg max-w-2xl mx-auto">
            By using The Life Savers platform and partner programs, you agree
            to the following terms and conditions.
          </p>
        </div>

        <div className="p-8">

          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>

          <p className="text-lg text-gray-700 mb-4">
            1.1. The Life Savers is a digital healthcare platform that connects
            patients, blood donors, diagnostic laboratories, healthcare
            partners, and service providers through online systems.
          </p>

          <p className="text-lg text-gray-700 mb-4">
            1.2. By accessing or using The Life Savers applications, websites,
            or services, you agree to be legally bound by these Terms and
            Conditions.
          </p>

          <p className="text-lg text-gray-700 mb-4">
            1.3. The Life Savers reserves the right to update, modify, or revise
            these Terms at any time. Continued use of the platform constitutes
            acceptance of the updated terms.
          </p>

          <h2 className="text-2xl font-semibold mb-4">
            2. Platform Usage and User Obligations
          </h2>

          <p className="text-lg text-gray-700 mb-4">
            2.1. Users must provide accurate and truthful information while
            registering or using the platform.
          </p>

          <p className="text-lg text-gray-700 mb-4">
            2.2. Users are responsible for maintaining the confidentiality of
            their login credentials and account information.
          </p>

          <p className="text-lg text-gray-700 mb-4">
            2.3. Any fraudulent activity, misuse of the platform, or attempt to
            manipulate services may result in immediate account suspension or
            termination.
          </p>

          <h2 className="text-2xl font-semibold mb-4">
            3. Blood Donor Matching Service
          </h2>

          <p className="text-lg text-gray-700 mb-4">
            3.1. The Life Savers provides a platform to help connect blood
            donors and recipients.
          </p>

          <p className="text-lg text-gray-700 mb-4">
            3.2. The platform only facilitates connections and does not verify
            medical suitability, eligibility, or availability of donors.
          </p>

          <p className="text-lg text-gray-700 mb-4">
            3.3. Users are responsible for verifying donor eligibility with
            medical professionals before any medical procedure.
          </p>

          <h2 className="text-2xl font-semibold mb-4">
            4. Diagnostic Lab Test Services
          </h2>

          <p className="text-lg text-gray-700 mb-4">
            4.1. The Life Savers enables users to book diagnostic tests from
            partner laboratories.
          </p>

          <p className="text-lg text-gray-700 mb-4">
            4.2. Sample collection, laboratory analysis, and report generation
            are performed by independent accredited laboratories and trained
            phlebotomists.
          </p>

          <p className="text-lg text-gray-700 mb-4">
            4.3. The Life Savers acts only as a technology platform and is not
            responsible for laboratory accuracy, medical diagnosis, or clinical
            interpretation of results.
          </p>

          <h2 className="text-2xl font-semibold mb-4">
            5. Partner Program Terms
          </h2>

          <p className="text-lg text-gray-700 mb-4">
            5.1. The Life Savers operates a partner program through "The Life
            Savers Partners" platform allowing healthcare professionals and
            businesses such as doctors, chemists, clinics, gyms, and wellness
            centers to participate.
          </p>

          <p className="text-lg text-gray-700 mb-4">
            5.2. Partners receive a unique referral code after successful
            registration and approval by The Life Savers administration team.
          </p>

          <p className="text-lg text-gray-700 mb-4">
            5.3. Partners may earn commissions when users place orders through
            The Life Savers platform using their referral code and when the
            order is successfully completed.
          </p>

          <p className="text-lg text-gray-700 mb-4">
            5.4. Commission earnings are calculated automatically by the system
            and displayed in the partner dashboard.
          </p>

          <p className="text-lg text-gray-700 mb-4">
            5.5. The partner earning cycle currently operates on a 7-day cycle
            beginning from the partner registration date. Payouts are processed
            after successful completion of each cycle.
          </p>

          <p className="text-lg text-gray-700 mb-4">
            5.6. The Life Savers may introduce milestone rewards or incentive
            slabs based on overall revenue generated by the partner.
          </p>

          <p className="text-lg text-gray-700 mb-4">
            5.7. The Life Savers reserves the right to modify commission rates,
            payout structures, milestone slabs, and partner incentives at any
            time without prior notice.
          </p>

          <p className="text-lg text-gray-700 mb-4">
            5.8. The partner program, promotional offers, or incentive programs
            may be revoked, suspended, or discontinued at any time based on the
            decision of The Life Savers management.
          </p>

          <p className="text-lg text-gray-700 mb-4">
            5.9. Any attempt to manipulate referrals, create fake bookings, or
            misuse the partner system may result in termination of the partner
            account and cancellation of earnings.
          </p>

          <h2 className="text-2xl font-semibold mb-4">
            6. Privacy and Data Protection
          </h2>

          <p className="text-lg text-gray-700 mb-4">
            6.1. The Life Savers respects user privacy and implements
            industry-standard security practices to protect personal data.
          </p>

          <p className="text-lg text-gray-700 mb-4">
            6.2. Users agree that their information may be shared with partner
            laboratories, healthcare providers, or service personnel for the
            purpose of service fulfillment.
          </p>

          <h2 className="text-2xl font-semibold mb-4">
            7. Limitation of Liability
          </h2>

          <p className="text-lg text-gray-700 mb-4">
            7.1. The Life Savers does not guarantee uninterrupted or error-free
            operation of the platform.
          </p>

          <p className="text-lg text-gray-700 mb-4">
            7.2. The Life Savers shall not be liable for any direct, indirect,
            incidental, or consequential damages arising from the use of the
            platform.
          </p>

          <p className="text-lg text-gray-700 mb-4">
            7.3. The platform is provided on an "as-is" and "as-available" basis.
          </p>

          <h2 className="text-2xl font-semibold mb-4">
            8. Account Suspension or Termination
          </h2>

          <p className="text-lg text-gray-700 mb-4">
            8.1. The Life Savers reserves the right to suspend or terminate
            accounts involved in fraudulent, abusive, or illegal activity.
          </p>

          <p className="text-lg text-gray-700 mb-4">
            8.2. Accounts may be suspended without prior notice if platform
            policies are violated.
          </p>

          <h2 className="text-2xl font-semibold mb-4">
            9. Changes to Services
          </h2>

          <p className="text-lg text-gray-700 mb-4">
            9.1. The Life Savers may update, modify, or discontinue services or
            features at any time without prior notice.
          </p>

          <p className="text-lg text-gray-700 mb-4">
            9.2. Pricing, business partner rates (B2P rates), and operational
            policies may change at any time based on business decisions.
          </p>

          <h2 className="text-2xl font-semibold mb-4">
            10. Intellectual Property
          </h2>

          <p className="text-lg text-gray-700 mb-4">
            10.1. All logos, designs, platform content, and intellectual
            property belong to The Life Savers.
          </p>

          <p className="text-lg text-gray-700 mb-4">
            10.2. Unauthorized reproduction or distribution is prohibited.
          </p>

          <h2 className="text-2xl font-semibold mb-4">
            11. Governing Law
          </h2>

          <p className="text-lg text-gray-700 mb-4">
            These terms shall be governed in accordance with applicable laws
            and disputes shall be resolved through appropriate legal channels.
          </p>

          <h2 className="text-2xl font-semibold mb-4">
            12. Acceptance of Terms
          </h2>

          <p className="text-lg text-gray-700 mb-4">
            By accessing or using The Life Savers platform, you acknowledge
            that you have read, understood, and agree to these Terms and
            Conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;