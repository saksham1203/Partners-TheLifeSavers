import React from "react";
import {
  FaTint,
  FaHandsHelping,
  FaRegHeart,
  FaArrowLeft,
  FaUserShield,
  FaLightbulb,
  FaSmile,
  FaStethoscope,
  FaListAlt,
  FaCalendarCheck,
  FaClipboardList,
  FaPhoneAlt,
  FaEnvelope,
  FaCheck,
  FaMicroscope,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const LearnAboutDonation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-white flex items-center justify-center p-6"
      style={{ paddingTop: "4rem", paddingBottom: "4rem" }}
    >
      <div className="bg-white rounded-2xl shadow-lg max-w-6xl w-full overflow-hidden relative animate-fade-in">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-400 text-white text-center py-8 px-6 relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 sm:top-1/2 sm:left-6 transform sm:-translate-y-1/2 p-2 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition"
            aria-label="Go back"
          >
            <FaArrowLeft size={18} />
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 mt-4 sm:mt-0">
            Learn About Blood Donation & Health Checks
          </h1>
          <p className="text-md sm:text-lg max-w-3xl mx-auto">
            The Gift of Life — and the power of preventive health
          </p>
        </div>

        {/* Content Section */}
        <div className="py-10 px-6 sm:px-10 space-y-10">
          <section>
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
              Blood donation is a selfless act that saves lives. Alongside donation,
              regular health checkups are a cornerstone of personal and public health —
              they help detect conditions early, monitor chronic conditions, and keep donors and patients safer.
            </p>
          </section>

          {/* Video */}
          <section className="sm:flex h-[350px] justify-center items-center relative mt-4">
            <video
              src="https://res.cloudinary.com/dqm7wf4zi/video/upload/v1734541688/theLifeSaversVideo_mrchef.mp4"
              poster="https://res.cloudinary.com/dqm7wf4zi/image/upload/v1763462027/TLS_-_Logo_eymtr4.png"
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-contain rounded-md"
              aria-label="Background video"
              preload="auto"
            />
          </section>

          {/* Compatible Blood Table */}
          <section>
            <h2 className="text-3xl font-bold text-red-600 mb-6 text-center">
              Compatible Blood Type Donors
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-sm text-center shadow-lg rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-red-600 text-white">
                    <th className="px-4 py-3 uppercase font-semibold">Blood Type</th>
                    <th className="px-4 py-3 uppercase font-semibold">Donate Blood To</th>
                    <th className="px-4 py-3 uppercase font-semibold">Receive Blood From</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b hover:bg-red-50 transition">
                    <td className="px-4 py-3 font-semibold text-red-600">A+</td>
                    <td className="px-4 py-3">A+, AB+</td>
                    <td className="px-4 py-3">A+, A-, O+, O-</td>
                  </tr>
                  <tr className="bg-gray-100 border-b hover:bg-red-50 transition">
                    <td className="px-4 py-3 font-semibold text-red-600">O+</td>
                    <td className="px-4 py-3">O+, A+, B+, AB+</td>
                    <td className="px-4 py-3">O+, O-</td>
                  </tr>
                  <tr className="bg-white border-b hover:bg-red-50 transition">
                    <td className="px-4 py-3 font-semibold text-red-600">B+</td>
                    <td className="px-4 py-3">B+, AB+</td>
                    <td className="px-4 py-3">B+, B-, O+, O-</td>
                  </tr>
                  <tr className="bg-gray-100 border-b hover:bg-red-50 transition">
                    <td className="px-4 py-3 font-semibold text-red-600">AB+</td>
                    <td className="px-4 py-3">AB+</td>
                    <td className="px-4 py-3">Everyone</td>
                  </tr>
                  <tr className="bg-white border-b hover:bg-red-50 transition">
                    <td className="px-4 py-3 font-semibold text-red-600">A-</td>
                    <td className="px-4 py-3">A+, A-, AB+, AB-</td>
                    <td className="px-4 py-3">A-, O-</td>
                  </tr>
                  <tr className="bg-gray-100 border-b hover:bg-red-50 transition">
                    <td className="px-4 py-3 font-semibold text-red-600">O-</td>
                    <td className="px-4 py-3">Everyone</td>
                    <td className="px-4 py-3">O-</td>
                  </tr>
                  <tr className="bg-white border-b hover:bg-red-50 transition">
                    <td className="px-4 py-3 font-semibold text-red-600">B-</td>
                    <td className="px-4 py-3">B+, B-, AB+, AB-</td>
                    <td className="px-4 py-3">B-, O-</td>
                  </tr>
                  <tr className="bg-gray-100 hover:bg-red-50 transition">
                    <td className="px-4 py-3 font-semibold text-red-600">AB-</td>
                    <td className="px-4 py-3">AB+, AB-</td>
                    <td className="px-4 py-3">AB-, A-, B-, O-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Donate + Health check grid (no borders) */}
          <section>
            <h2 className="text-3xl font-bold text-red-600 mb-6 text-center">Donation & Health Check Essentials</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* removed border class and use subtle card style */}
              <div className="text-center space-y-4 p-6 rounded-lg hover:shadow-lg transition">
                <div className="text-red-600"><FaTint size={48} /></div>
                <h3 className="text-xl font-semibold">Why Donate Blood?</h3>
                <p className="text-gray-600">
                  Blood cannot be manufactured. Donations support surgeries, trauma care, and chronic conditions.
                </p>
              </div>

              <div className="text-center space-y-4 p-6 rounded-lg hover:shadow-lg transition">
                <div className="text-red-600"><FaHandsHelping size={48} /></div>
                <h3 className="text-xl font-semibold">Who Can Donate?</h3>
                <p className="text-gray-600">
                  Generally healthy adults, 18–65 years, meeting weight and screening criteria. Specific eligibility is confirmed at donation.
                </p>
              </div>

              <div className="text-center space-y-4 p-6 rounded-lg hover:shadow-lg transition">
                <div className="text-red-600"><FaRegHeart size={48} /></div>
                <h3 className="text-xl font-semibold">Donor Safety</h3>
                <p className="text-gray-600">
                  Sterile, single-use equipment is standard. Donors are screened and monitored during and after donation.
                </p>
              </div>

              <div className="text-center space-y-4 p-6 rounded-lg hover:shadow-lg transition">
                <div className="text-red-600"><FaUserShield size={48} /></div>
                <h3 className="text-xl font-semibold">Post-Donation Care</h3>
                <p className="text-gray-600">
                  Rest, hydrate, avoid heavy lifting for 24–48 hours, and follow staff instructions.
                </p>
              </div>

              <div className="text-center space-y-4 p-6 rounded-lg hover:shadow-lg transition">
                <div className="text-red-600"><FaLightbulb size={48} /></div>
                <h3 className="text-xl font-semibold">How Often?</h3>
                <p className="text-gray-600">
                  Men: approx. every 12 weeks. Women: approx. every 16 weeks. Platelet donation frequency varies.
                </p>
              </div>

              <div className="text-center space-y-4 p-6 rounded-lg hover:shadow-lg transition">
                <div className="text-red-600"><FaSmile size={48} /></div>
                <h3 className="text-xl font-semibold">Benefits of Donating</h3>
                <p className="text-gray-600">
                  Saves lives, supports community healthcare and may have health benefits for some donors.
                </p>
              </div>
            </div>
          </section>

          {/* New: Attractive Regular Health Checkups Section */}
          <section>
            <h2 className="text-3xl font-bold text-red-600 mb-6 text-center">Regular Health Checkups — Attractive & Actionable</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left: Feature highlights */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-white to-red-50 p-6 rounded-xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-600 text-white rounded-md p-3">
                      <FaStethoscope size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Why Regular Checkups?</h3>
                      <p className="text-gray-700 mt-1">
                        Early detection saves lives. Regular screenings help spot conditions before symptoms appear and keep donors safe and eligible.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition">
                    <div className="flex items-start gap-3">
                      <div className="text-red-600 mt-1"><FaListAlt /></div>
                      <div>
                        <h4 className="font-semibold">Baseline Health Profile</h4>
                        <p className="text-sm text-gray-600">Build a baseline for future comparison and better diagnosis.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition">
                    <div className="flex items-start gap-3">
                      <div className="text-red-600 mt-1"><FaCalendarCheck /></div>
                      <div>
                        <h4 className="font-semibold">Scheduled Reminders</h4>
                        <p className="text-sm text-gray-600">Set recurring checkups to stay on top of your health.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition">
                    <div className="flex items-start gap-3">
                      <div className="text-red-600 mt-1"><FaClipboardList /></div>
                      <div>
                        <h4 className="font-semibold">Actionable Reports</h4>
                        <p className="text-sm text-gray-600">Reports with clear data you can share with your doctor.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition">
                    <div className="flex items-start gap-3">
                      <div className="text-red-600 mt-1"><FaCheck /></div>
                      <div>
                        <h4 className="font-semibold">Donor Safety Checks</h4>
                        <p className="text-sm text-gray-600">Screening ensures donors are fit to donate without harming themselves.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Attractive checklist card + CTA */}
              <div>
                <div className="rounded-xl bg-white shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-semibold">Recommended Checkup Tests</h3>
                      <p className="text-sm text-gray-500">Pick a package or book individual tests</p>
                    </div>
                    <div className="text-red-600 text-3xl">
                      <FaMicroscope />
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-3">
                      <span className="text-red-600 mt-1"><FaCheck /></span>
                      <span><strong>CBC</strong> — Complete Blood Count</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-600 mt-1"><FaCheck /></span>
                      <span><strong>Blood Glucose</strong> — Fasting & HbA1c</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-600 mt-1"><FaCheck /></span>
                      <span><strong>Lipid Profile</strong> — Cholesterol & cardiac risk</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-600 mt-1"><FaCheck /></span>
                      <span><strong>Kidney & Liver Panel</strong> — Metabolic health</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-600 mt-1"><FaCheck /></span>
                      <span><strong>Thyroid Panel</strong> — Hormonal health</span>
                    </li>
                  </ul>

                  <div className="bg-red-50 p-4 rounded-md mb-4">
                    <p className="text-sm text-gray-700">
                      <strong>Tip:</strong> For donors, a recent CBC helps ensure hemoglobin is adequate for safe donation.
                    </p>
                  </div>

                </div>

                {/* Small extras */}
                <div className="mt-4 text-sm text-gray-500">
                  <p><strong>Turnaround:</strong> Simple tests: often 24 hrs. Complex panels: variable — TAT displayed at checkout.</p>
                  <p className="mt-2"><strong>Home collection availability:</strong> Enter pin code in booking flow to check coverage.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Recommended packages (example) */}
          <section>
            <h2 className="text-3xl font-bold text-red-600 mb-6 text-center">Sample Health Packages (Examples)</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg shadow-sm hover:shadow-md transition">
                <h3 className="text-xl font-semibold mb-2">Basic Health Check</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>CBC</li>
                  <li>Blood sugar (Fasting)</li>
                  <li>Basic urine analysis</li>
                </ul>
                <p className="mt-3 text-sm text-gray-500">Good for young healthy adults and donors.</p>
              </div>

              <div className="p-6 rounded-lg shadow-sm hover:shadow-md transition">
                <h3 className="text-xl font-semibold mb-2">Comprehensive Health Check</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Complete metabolic panel (kidney, liver)</li>
                  <li>Lipid profile</li>
                  <li>Thyroid tests</li>
                </ul>
                <p className="mt-3 text-sm text-gray-500">Recommended for adults 40+ and those with risk factors.</p>
              </div>

              <div className="p-6 rounded-lg shadow-sm hover:shadow-md transition">
                <h3 className="text-xl font-semibold mb-2">Cardiac Risk Package</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Lipid profile</li>
                  <li>ECG</li>
                  <li>hs-CRP (inflammatory marker)</li>
                </ul>
                <p className="mt-3 text-sm text-gray-500">For those with family history or symptoms.</p>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-3">
              Note: specific package names, inclusions and pricing will be shown during booking — these are illustrative examples.
            </p>
          </section>

          {/* FAQs */}
          <section>
            <h2 className="text-3xl font-bold text-red-600 mb-6 text-center">Frequently Asked Questions</h2>

            <div className="space-y-4 text-gray-700">
              <div>
                <h4 className="font-semibold">Q: Will donation affect my ability to get a health check?</h4>
                <p>A: No — donation and health checks are complementary. If you donate, inform the testing personnel as some tests may be deferred for a short time (e.g., immediate hemoglobin checks).</p>
              </div>

              <div>
                <h4 className="font-semibold">Q: Can I book a health check and donation on the same day?</h4>
                <p>A: It depends on local policies and the nature of tests. Typically, certain blood tests may be impacted by a donation on the same day — please consult the booking notes or support.</p>
              </div>

              <div>
                <h4 className="font-semibold">Q: How soon will I get lab reports?</h4>
                <p>A: Turnaround time varies by test — simple tests often within 24 hours, more complex panels may take longer. Estimated TAT is displayed at checkout.</p>
              </div>

              <div>
                <h4 className="font-semibold">Q: Is home collection available in my area?</h4>
                <p>A: Home collection availability depends on partner coverage. Enter your pin code in the booking flow to see options.</p>
              </div>

              <div>
                <h4 className="font-semibold">Q: Who interprets my results?</h4>
                <p>A: Lab reports are provided by partner labs. The Platform does not provide medical interpretation; consult your physician or use our partner teleconsult services where available.</p>
              </div>
            </div>
          </section>

          {/* Contact & CTA */}
          <section className="text-center">
            <h2 className="text-2xl font-semibold mb-3">Get Assistance</h2>
            <p className="text-gray-700 mb-4">If you need help booking a checkup, arranging home collection, or finding a donor, contact our support team:</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="mailto:support@thelifesavers.in"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition"
              >
                <FaEnvelope /> support@thelifesavers.in
              </a>

              <a
                href="tel:+918307497771"
                className="inline-flex items-center gap-2 px-6 py-3 border border-red-600 text-red-600 rounded-full shadow-sm hover:bg-red-50 transition"
              >
                <FaPhoneAlt /> +91 83074-97771
              </a>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              When contacting support, please include any booking/order ID or relevant details to speed up help.
            </p>
          </section>

          {/* small footer note */}
          <section className="text-center">
            <p className="text-sm text-gray-500">
              Disclaimer: The Life Savers is a technology platform that facilitates connections and coordination. Medical screening, sample analysis and clinical advice are provided by licensed healthcare professionals and accredited partner laboratories.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LearnAboutDonation;
