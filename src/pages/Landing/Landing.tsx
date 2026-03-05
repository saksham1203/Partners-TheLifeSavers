import React, { useRef, useState } from "react";
import CountUp from "react-countup";
import Slider from "react-slick";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaApple, FaGooglePlay, FaSignInAlt, FaUserPlus } from "react-icons/fa";

const keywords = [
  "Blood Donation",
  "Donation",
  "Donate Blood",
  "Blood",
  "Near me",
  "Emergency blood requirement",
  "Urgent blood need",
  "Blood needed immediately",
  "Find blood donor",
  "Blood bank contact number",
  "Nearest blood bank",
  "Blood available near me",
  "AB positive blood urgent",
  "O negative blood requirement",
  "A positive blood needed",
  "B positive blood requirement",
  "AB negative blood availability",
  "Rare blood group urgent",
  "Where to get blood in Delhi",
  "Blood for surgery Mumbai",
  "Blood for accident victim Chennai",
  "Thalassemia blood requirement Bangalore",
  "Dengue blood needed Kolkata",
  "Platelets required Hyderabad",
  "Plasma needed Pune",
  "Blood appeal",
  "Help for blood",
  "Blood donor search",
  "Online blood request",
  "Blood request form",
  "Urgent blood appeal Delhi",
  "Blood shortage",
  "Get blood fast",
  "List of blood banks",
  "Government blood bank",
  "Private blood bank",
  "Hospital blood bank",
  "Blood transfusion services",
  "Safe blood source",
  "Cost of blood",
  "Free blood",
  "Blood donation camp for specific group",
  "Blood donor directory",
  "Emergency blood group search",
  "Blood for critical patient",
  "Nearest blood bank contact",
  "Blood needed for patient ",
  "How to find blood quickly",
  "Urgent medical blood",
  "Blood for operation",
  "Blood required for medical emergency",
  "Blood availability status",
  "Blood requirement for Disease",
  "Connect with blood donors",
  "Blood request app",
  "Delhi blood bank contact",
  "Mumbai blood bank number",
  "Kolkata blood urgent",
  "Chennai blood availability",
  "Hyderabad blood donors list",
  "Bangalore urgent blood",
  "Ahmedabad blood needed",
  "Pune blood requirement",
  "Jaipur blood bank",
  "Lucknow blood availability",
  "Bhopal urgent blood",
  "Patna blood bank",
  "Chandigarh blood needed",
  "Coimbatore blood bank",
  "Nagpur blood requirement",
  "Indore urgent blood",
  "Visakhapatnam blood availability",
  "Amritsar blood bank",
  "Thiruvananthapuram blood need",
  "Blood group specific search",
  "Nearest blood donation center for urgent need",
  "Blood helpline number",
  "24 hour blood bank",
  "Blood bank near [Area/Locality]",
  "Blood availability dashboard",
  "Online blood matching",
  "Blood donation for patient",
  "Where can I get blood for emergency?",
  "Immediate blood requirement",
  "Blood for my relative",
  "Blood needed for child",
  "Blood for mother",
  "Blood for father",
  "Blood for sister",
  "Blood for brother",
  "Help for blood transfusion",
  "Nearest blood center for patient",
  "Blood supply",
  "Blood bank stock",
  "Blood for medical treatment",
  "Need blood urgently",
  "How to arrange blood",
  "Blood for [Blood Group]",
  "Emergency blood services",
  "Blood bank locator",
  "Blood donor database",
  "Blood for specific disease",
  "Contact blood bank",
  "Blood donation camp for specific blood type",
  "Blood unit needed",
  "One unit blood requirement",
  "Donate blood",
  "Blood donation near me",
  "Become a blood donor",
  "Blood donor registration",
  "Volunteer to donate blood",
  "Blood donation requirements",
  "Who can donate blood",
  "Benefits of blood donation",
  "Blood donation camp",
  "Blood donation drive",
  "How to donate blood",
  "Blood donation process",
  "Eligibility for blood donation",
  "Blood donation facts",
  "Importance of blood donation",
  "Where to donate blood",
  "Donate plasma",
  "Plasma donation near me",
  "Platelet donation",
  "Whole blood donation",
  "Types of blood donation",
  "Red cross blood donation",
  "Blood donation camps",
  "Blood donation in Delhi",
  "Blood donation in Mumbai",
  "Blood donation in Bangalore",
  "Blood donation in Chennai",
  "Blood donation in Kolkata",
  "Blood donation during COVID",
  "Blood donation after vaccination",
  "Blood donation age limit",
  "Blood donation weight limit",
  "Blood donation health benefits",
  "Blood donation side effects",
  "Blood donation myths",
  "Blood donation statistics",
  "Blood donation app",
  "Blood donor card",
  "Pledge to donate blood",
  "Blood donation awareness",
  "World blood donor day",
  "National blood donation drive",
  "Blood donation campaign",
  "Upcoming blood donation camps",
  "Organize blood donation camp",
  "Blood donor login",
  "Register as blood donor",
  "Blood donation centre Delhi",
  "Blood donation hospital Mumbai",
  "Voluntary blood donation",
  "Why donate blood",
  "First time blood donor",
  "How often can I donate blood",
  "What to eat before blood donation",
  "What to do after blood donation",
  "Blood donation information",
  "Blood donation guidelines",
  "Safe blood donation",
  "Camps for blood donation",
  "Donate blood save lives",
  "Blood donation certificate",
  "Nearest place to donate blood",
  "e-raktkosh",
  "red cross",
  "Hospital",
  "Hospitals",
  "Governmnet",
  "India",
  "Indian",
  "help",
  "blood bank",
  "Online blood donation registration",
  "Blood donation for new donors",
  "Blood donation check-up",
  "Blood donor requirements list",
  "Blood donation benefits for donor",
  "Blood donation facts and myths",
  "Blood donation process steps",
  "Blood donation FAQ",
  "Blood donation drive near me",
  "Blood donation camp dates",
  "Blood donation volunteer",
  "Blood donation for good cause",
  "Blood donor rewards",
  "Can I donate blood if I have a tattoo",
  "Can I donate blood if I have fever",
  "Can I donate blood after drinking alcohol",
  "How long after illness can I donate blood",
  "Blood donation for women",
  "Blood donation for men",
  "Blood donation for specific blood group",
  "Where can I give blood",
  "Blood donation drive registration",
  "Blood donation facts",
  "Blood donation benefits for heart",
  "Blood donation and iron levels",
  "Blood donation mobile van",
  "Donate blood at home",
  "Blood donation near",
  "Blood donation helpline",
  "Become a regular blood donor",
  "Blood donation and weight loss",
  "Blood donation and immunity",
  "Blood donation and health check-up",
  "Online registration for blood donation",
  "Register for blood donation camp",
  "Donate blood",
  "Give blood for free",
  "Blood donation awareness campaign",
  "Blood donation requirements checklist",
  "Blood donation eligibility criteria",
];

const services = [
  {
    icon: "🩸",
    title: "Instant Donor Matching",
    desc: "Connects recipients with nearby compatible donors in real-time to reduce delays during medical emergencies.",
  },
  {
    icon: "🧑‍⚕️",
    title: "Lab Test Booking",
    desc: "Book diagnostic lab tests online from trusted partner labs with transparent pricing, secure payments, and instant confirmations.",
  },
  {
    icon: "🏠",
    title: "Home Sample Collection",
    desc: "Schedule safe, hygienic home sample collection by trained phlebotomists and track your pickup and processing status live.",
  },
  {
    icon: "📄",
    title: "Digital Medical Reports",
    desc: "Receive authenticated lab reports digitally, stored securely in your profile for easy access and sharing anytime.",
  },
  {
    icon: "💳",
    title: "Secure Online Payments",
    desc: "Pay for lab tests confidently through PCI-DSS compliant payment gateways ensuring smooth, encrypted transactions.",
  },
  {
    icon: "👥",
    title: "Live Community Chat",
    desc: "Interact with donors, recipients, and support teams in real-time to ask questions, offer help, or share updates instantly.",
  },
  {
    icon: "📝",
    title: "Educational Blogs & Health Tips",
    desc: "Explore factual, well-researched articles on blood donation, preventive care, lab tests, healthy living, and wellness.",
  },
  {
    icon: "🔔",
    title: "Instant Emergency Alerts",
    desc: "Stay notified when blood shortages occur in your area or when someone urgently needs a donor matching your blood type.",
  },
  {
    icon: "⚕️",
    title: "Health Checkup Reminders",
    desc: "Get reminders for annual health checkups, preventive screenings, and recommended test packages based on age and lifestyle.",
  },
  {
    icon: "🔒",
    title: "End-to-End Data Security",
    desc: "Your personal, health, and payment information is encrypted and securely stored with industry-standard protection.",
  },
  {
    icon: "📍",
    title: "Smart Location-Based Search",
    desc: "Find donors, receivers, and nearby diagnostic labs with intelligent GPS-powered search and smart filtering.",
  },
  {
    icon: "🧪",
    title: "Donation Eligibility & Guidelines",
    desc: "Access updated medical guidelines for safe blood donation, including age, health conditions, intervals, and precautions.",
  },
];


const AdminsTestimonials = [
  {
    name: "Himanshu | Founder",
    image:
      "https://res.cloudinary.com/dqm7wf4zi/image/upload/v1752081662/Himanshu_uhykhh.jpg",
    review:
      "As the Founder of The Life Savers, my mission has always been to build a reliable platform where people can get help when they need it the most — whether it’s finding a blood donor in an emergency or booking trusted lab tests with home sample collection. Every feature we create is focused on safety, transparency, and accessibility, ensuring that no family feels helpless during critical moments.",
  },
];

const testimonials = [
  {
    name: "Shivam",
    image:
      "https://res.cloudinary.com/dqm7wf4zi/image/upload/v1752081662/1_hsk6ve.jpg",
    review:
      "I urgently needed A+ blood for my uncle. The Life Savers connected us to a donor within minutes. Truly life-changing!",
  },
  {
    name: "Lakshay",
    image:
      "https://res.cloudinary.com/dqm7wf4zi/image/upload/v1752081662/2_cabtni.jpg",
    review:
      "Booked a full body checkup using the app — smooth payment, home sample collection, and digital report delivered on time. Highly reliable!",
  },
];

const SectionTitle = ({ title }: { title: string }) => (
  <h2 className="text-3xl sm:text-4xl font-extrabold text-red-600 mb-10 text-center">
    {title}
  </h2>
);

const formatIndianNumber = (num: number): string => {
  return new Intl.NumberFormat("en-IN").format(num);
};

const StatCard = ({
  label,
  value,
  color,
  visible,
}: {
  label: string;
  value: number;
  color: string;
  visible: boolean;
}) => (
  <motion.div
    className="bg-white rounded-2xl p-6 shadow-[inset_4px_4px_12px_#e0e0e0,inset_-4px_-4px_12px_#ffffff] border border-gray-100"
    initial={{ opacity: 0, y: 40 }}
    animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
    transition={{ duration: 0.6 }}
  >
    <p className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
      {label}
    </p>
    <p className={`text-3xl sm:text-4xl font-bold ${color} min-h-[2.5rem]`}>
      <CountUp
        end={visible ? value : 0}
        duration={visible ? 2 : 0}
        formattingFn={formatIndianNumber}
      />
    </p>
  </motion.div>
);

const ServiceCard = ({
  icon,
  title,
  desc,
  delay,
  visible,
}: {
  icon: string;
  title: string;
  desc: string;
  delay: number;
  visible: boolean;
}) => (
  <motion.div
    className="bg-white rounded-2xl p-6 shadow-[inset_4px_4px_12px_#e0e0e0,inset_-4px_-4px_12px_#ffffff] border border-gray-100"
    initial={{ opacity: 0, y: 40 }}
    animate={visible ? { opacity: 1, y: 0 } : {}}
    transition={{ delay, duration: 0.6 }}
  >
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600 text-sm">{desc}</p>
  </motion.div>
);

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const initialVisibleCount = 100;

  const handleVideoToggle = () => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const { ref: introRef, inView: introInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });
  const { ref: statsRef, inView: statsInView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });
  const { ref: serviceRef, inView: serviceInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-white via-red-50 to-white pt-14">
        <div className="bg-white w-full overflow-hidden relative">
          {/* Hero section */}
          <motion.header
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative z-0 bg-red-600 text-white py-20 px-6 overflow-hidden"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 -skew-y-6 bg-gradient-to-r from-red-700 via-red-500 to-red-400 opacity-90 transform-gpu"
            />
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <motion.h1
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 leading-tight"
              >
                Donate Blood • Book Lab Tests • Home Sample Collection
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto"
              >
                Fast donor matching for emergencies, secure online lab bookings,
                and reliable home sample collection with digital reports. Online
                payments supported for lab services and home pickups.
                <br />
                Connect with verified donors, partner labs, and phlebotomists —
                anytime, anywhere.
              </motion.p>

              <motion.div
                className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <div className="flex flex-wrap gap-6 justify-center">

                  {/* Register */}
                  <button
                    onClick={() => navigate("/register")}
                    className="group flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-lg text-white bg-red-600 shadow-lg hover:bg-red-700 transition-all duration-300"
                    aria-label="Join as a Blood Donor"
                  >
                    <FaUserPlus className="text-white transition-transform duration-300" />
                    Partner Register
                  </button>

                  {/* Find Donors */}
                  <button
                    onClick={() => navigate("/login")}
                    className="group flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-lg text-white bg-red-600 shadow-lg hover:bg-red-700 transition-all duration-300"
                    aria-label="Find Blood Donors"
                  >
                     <FaSignInAlt className="text-white transition-transform duration-300" />
                    Partner Login
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.header>

          <main className="py-10 px-4 sm:px-10 space-y-8">
            {/* Intro/About */}
            <section
              ref={introRef}
              className="pb-6 px-4 sm:px-10 bg-white text-center"
            >
              <motion.h2
                className="text-3xl sm:text-4xl font-extrabold text-red-600 mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={introInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                One Platform. Multiple Ways to Save Lives.
              </motion.h2>

              <motion.p
                className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={introInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <span className="text-red-600 font-semibold">
                  The Life Savers
                </span>{" "}
                is a modern digital healthcare platform that helps users with{" "}
                <span className="text-red-600 font-semibold">
                  urgent blood donor matching
                </span>
                ,{" "}
                <span className="text-red-600 font-semibold">
                  online lab test booking
                </span>
                ,{" "}
                <span className="text-red-600 font-semibold">
                  home sample collection
                </span>
                , and secure{" "}
                <span className="text-red-600 font-semibold">
                  online payments
                </span>
                .
                <br className="hidden sm:block" />
                Our mission is simple: make reliable healthcare access faster,
                easier, and available for everyone across{" "}
                <span className="text-red-600 font-semibold">India</span>.
              </motion.p>

              <motion.p
                className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={introInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.35, duration: 0.6 }}
              >
                Whether it's connecting with compassionate donors during an
                emergency or getting diagnostic tests done from trusted partner
                labs — everything is just a few clicks away.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={introInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex justify-center mt-6"
              >
                <button
                  onClick={() => navigate("/login")}
                  className="group flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-lg text-white 
      bg-red-600 shadow-lg hover:bg-red-700 hover:scale-105 transition-all duration-300"
                >
                  <span className="text-xl">🚑</span>
                  Become a Lifesaver Today
                </button>
              </motion.div>
            </section>

            {/* Why Join */}
            <section className="px-4 sm:px-10 bg-gradient-to-b to-white text-center">
              <SectionTitle title="Why Join Us?" />

              <motion.p
                className="text-lg text-gray-700 max-w-3xl mx-auto mb-14 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Become part of a future-ready platform designed to make
                healthcare access faster, smarter, and more human. Whether you
                want to donate blood, book lab tests, or support someone in need
                — your involvement creates real-world impact.
              </motion.p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-2">
                {[
                  {
                    icon: "❤️",
                    title: "Save Lives in Real Time",
                    desc: "Your presence helps patients connect with verified donors and trusted labs within minutes during emergencies.",
                  },
                  {
                    icon: "🧪",
                    title: "Access Reliable Lab Services",
                    desc: "Book diagnostic tests, track your orders, get home sample collection, and receive digital reports securely.",
                  },
                  {
                    icon: "💳",
                    title: "Secure Online Payments",
                    desc: "Pay safely through trusted gateways and receive invoices for all booked healthcare services.",
                  },
                  {
                    icon: "📍",
                    title: "PAN-India Coverage",
                    desc: "Find donors or book lab tests from any location — our platform supports users across all major cities.",
                  },
                  {
                    icon: "🔒",
                    title: "Safe & Verified Community",
                    desc: "We verify donors, ensure secure data handling, and maintain a safe environment for every interaction.",
                  },
                  {
                    icon: "🚀",
                    title: "Future-Ready Healthcare",
                    desc: "Be part of a growing ecosystem offering emergency support, diagnostics, and wellness services in one place.",
                  },
                ].map((item, i) => (
                  <ServiceCard
                    key={i}
                    icon={item.icon}
                    title={item.title}
                    desc={item.desc}
                    delay={i * 0.2}
                    visible={true}
                  />
                ))}
              </div>
            </section>

            {/* Video */}
            <div className="relative w-full max-w-5xl mx-auto mt-8 rounded-xl overflow-hidden border border-gray-200">
              <video
                ref={videoRef}
                src="https://res.cloudinary.com/dqm7wf4zi/video/upload/v1734541688/theLifeSaversVideo_mrchef.mp4"
                poster="https://res.cloudinary.com/dqm7wf4zi/image/upload/v1763462027/TLS_-_Logo_eymtr4.png"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-auto object-contain bg-black"
              />
              <div className="absolute bottom-4 right-4">
                <button
                  onClick={handleVideoToggle}
                  className="bg-white/90 hover:bg-white text-red-600 font-semibold px-4 py-2 rounded-full shadow-md transition duration-300"
                >
                  {isPlaying ? "❚❚ Pause" : "▶ Play"}
                </button>
              </div>
            </div>

            {/* Our Services */}
            <section
              ref={serviceRef}
              className=" px-4 sm:px-10 bg-gradient-to-b to-white text-center"
            >
              <SectionTitle title="Our Services" />
              <motion.p
                className="text-lg text-gray-700 max-w-3xl mx-auto mb-14"
                initial={{ opacity: 0, y: 20 }}
                animate={serviceInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                We bridge urgent donor needs and reliable diagnostics — all
                through one trusted platform. Book lab tests, schedule home
                sample collection, pay online, and receive secure digital
                reports — plus access regular health checkup packages and
                verified partner labs across India.
              </motion.p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-2">
                {services.map((s, i) => (
                  <ServiceCard
                    key={i}
                    {...s}
                    delay={i * 0.2}
                    visible={serviceInView}
                  />
                ))}
              </div>
            </section>

            {/* Mobile App Promotion */}
            <section className="px-4 sm:px-10 py-16 bg-white text-center">
              {/* Title */}
              <h2 className="text-3xl sm:text-4xl font-extrabold text-red-600 mb-6">
                Find Blood Donors Faster on Our Mobile App
              </h2>

              {/* Description */}
              <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed">
                Search for nearby blood donors, receive emergency alerts, book
                lab tests, and track home sample collection — all in one simple
                and reliable{" "}
                <span className="font-semibold text-red-600">mobile app</span>.
              </p>

              {/* App Buttons */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                {/* Android */}
                <a
                  href="https://play.google.com/store/apps/details?id=in.thelifesavers.app&pcampaignid=web_share"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-8 py-3 rounded-full font-semibold text-lg 
                 text-white bg-red-600 shadow-lg hover:bg-red-700 transition-all duration-300"
                >
                  <FaGooglePlay size={22} />
                  Android App
                </a>

                {/* iOS */}
                <a
                  href="https://apps.apple.com/in/app/the-life-savers/id6748567888"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-8 py-3 rounded-full font-semibold text-lg 
                 text-white bg-red-600 shadow-lg hover:bg-red-700 transition-all duration-300"
                >
                  <FaApple size={22} />
                  IOS App
                </a>
              </div>

              {/* Helper text */}
              <p className="mt-6 text-sm text-gray-500">
                Available on Android & iOS • Free to download
              </p>
            </section>

            {/* Stats */}
            <section
              ref={statsRef}
              className=" px-4 sm:px-10 bg-gradient-to-b to-white text-center"
            >
              <SectionTitle title="Daily Blood Donation Stats" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-2">
                {[
                  {
                    label: "Avg. Units Needed / Year",
                    value: 14600000,
                    color: "text-red-600",
                  },
                  {
                    label: "Avg. Units Collected / Year",
                    value: 13600000,
                    color: "text-green-600",
                  },
                  {
                    label: "Avg. Units Shortage / Year",
                    value: 1000000,
                    color: "text-yellow-600",
                  },
                ].map((stat, idx) => (
                  <StatCard key={idx} {...stat} visible={statsInView} />
                ))}
              </div>
            </section>

            {/* Life Savers - trust secure */}
            <section className=" px-4 sm:px-10 bg-gradient-to-b to-white text-center">
              <SectionTitle title="The Life Savers – Safe, Secure & Reliable Healthcare Support" />

              <motion.p
                className="text-lg text-gray-700 max-w-3xl mx-auto mb-14"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Your trust is at the heart of everything we do.
                <span className="text-red-600 font-semibold">
                  {" "}
                  The Life Savers{" "}
                </span>
                ensures complete safety, transparency, and reliability across
                all services— from donor–receiver connections to lab test
                bookings, home sample collection, secure online payments, and
                digital medical report delivery.
              </motion.p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-2">
                {[
                  {
                    icon: "🔐",
                    title: "Advanced Data Privacy & Encryption",
                    desc: "Your personal details, health records, and chats are protected using industry-grade encryption and secure storage protocols.",
                  },
                  {
                    icon: "🧪",
                    title: "Trusted & Verified Partner Labs",
                    desc: "We work only with accredited diagnostic labs and trained phlebotomists to ensure safe, hygienic and reliable healthcare services.",
                  },
                  {
                    icon: "💳",
                    title: "Secure Online Payments",
                    desc: "All payments for lab tests are processed through trusted, PCI-DSS-compliant payment gateways ensuring complete transaction safety.",
                  },
                  {
                    icon: "📦",
                    title: "Quality Assurance & Monitoring",
                    desc: "From sample handling to report generation, every process follows strict quality checks to maintain accuracy and reliability.",
                  },
                  {
                    icon: "📱",
                    title: "Regular Platform Improvements",
                    desc: "We constantly update our system with new features, stronger security, and better user experience based on community feedback.",
                  },
                  {
                    icon: "🤝",
                    title: "Safe & Verified Community",
                    desc: "Our donor and receiver network includes only verified users, ensuring safer interactions and more reliable support during emergencies.",
                  },
                ].map((item, i) => (
                  <ServiceCard
                    key={i}
                    icon={item.icon}
                    title={item.title}
                    desc={item.desc}
                    delay={i * 0.2}
                    visible={true}
                  />
                ))}
              </div>
            </section>

            {/* Table */}
            <section>
              <SectionTitle title="Compatible Blood Type Donors" />
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 text-sm text-center shadow-2xl rounded-2xl overflow-hidden">
                  <thead>
                    <tr className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-600 text-white">
                      <th className="px-6 py-4 uppercase font-bold tracking-wider">
                        Blood Type
                      </th>
                      <th className="px-6 py-4 uppercase font-bold tracking-wider">
                        Donate Blood To
                      </th>
                      <th className="px-6 py-4 uppercase font-bold tracking-wider">
                        Receive Blood From
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-800">
                    {[
                      ["A+", "A+, AB+", "A+, A-, O+, O-"],
                      ["O+", "O+, A+, B+, AB+", "O+, O-"],
                      ["B+", "B+, AB+", "B+, B-, O+, O-"],
                      ["AB+", "AB+", "Everyone"],
                      ["A-", "A+, A-, AB+, AB-", "A-, O-"],
                      ["O-", "Everyone", "O-"],
                      ["B-", "B+, B-, AB+, AB-", "B-, O-"],
                      ["AB-", "AB+, AB-", "AB-, A-, B-, O-"],
                    ].map((row, i) => (
                      <tr
                        key={i}
                        className={`transition duration-300 ${
                          i % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-red-50`}
                      >
                        <td className="px-6 py-4 font-bold text-red-700 text-lg">
                          🩸 {row[0]}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center flex-wrap gap-1">
                            {row[1].split(", ").map((type, idx) => (
                              <span
                                key={idx}
                                className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium"
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center flex-wrap gap-1">
                            {row[2] === "Everyone" ? (
                              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                                Everyone
                              </span>
                            ) : (
                              row[2].split(", ").map((type, idx) => (
                                <span
                                  key={idx}
                                  className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium"
                                >
                                  {type}
                                </span>
                              ))
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Testimonials */}
            <section className="px-4 sm:px-10 bg-gradient-to-b to-white text-center">
              <SectionTitle title="Life Saver Heroes Speak" />
              <div className="flex flex-col lg:flex-row justify-center gap-6">
                <motion.div
                  className="w-full lg:w-1/2"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <div className="text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-red-600 tracking-tight relative inline-block">
                      Voices of Leadership
                      <span className="block w-12 h-0.5 bg-red-500 mx-auto mt-2 rounded-full"></span>
                    </h2>
                    <p className="mt-2 text-gray-600 text-sm sm:text-base max-w-md mx-auto">
                      Insights from our core team and leaders.
                    </p>
                  </div>

                  {AdminsTestimonials.map((t, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.95 }}
                      whileHover={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 mx-4 sm:mx-10 min-h-[240px] flex flex-col justify-between">
                        <div className="flex flex-col sm:flex-row items-center gap-6 text-left">
                          <div className="flex-shrink-0">
                            <img
                              src={t.image}
                              alt={t.name}
                              className="w-24 h-24 rounded-full object-cover border-4 border-red-500"
                            />
                          </div>
                          <div className="flex flex-col justify-between flex-1 h-full relative">
                            <svg
                              className="w-6 h-6 text-red-400 mb-2"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M7.17 5.59A6 6 0 001 12v7h6v-7H4a4 4 0 014-4V5.59zm9 0A6 6 0 0010 12v7h6v-7h-3a4 4 0 014-4V5.59z" />
                            </svg>
                            <p className="text-base italic text-gray-700 mb-2">
                              {t.review}
                            </p>
                            <div className="flex justify-end">
                              <svg
                                className="w-6 h-6 text-red-400 mt-2"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M16.83 18.41A6 6 0 0023 12V5h-6v7h3a4 4 0 01-4 4v2.41zm-9 0A6 6 0 0014 12V5H8v7h3a4 4 0 01-4 4v2.41z" />
                              </svg>
                            </div>
                            <div className="flex justify-end mt-4">
                              <p className="text-sm sm:text-base font-semibold text-red-600 tracking-wide italic drop-shadow-sm">
                                — {t.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  className="w-full lg:w-1/2"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <div className="text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-red-600 tracking-tight relative inline-block">
                      Stories That Inspire
                      <span className="block w-12 h-0.5 bg-red-500 mx-auto mt-2 rounded-full"></span>
                    </h2>
                    <p className="mt-2 text-gray-600 text-sm sm:text-base max-w-md mx-auto">
                      Real experiences shared by our life savers and grateful
                      families.
                    </p>
                  </div>

                  <Slider
                    dots
                    infinite
                    speed={500}
                    slidesToShow={1}
                    slidesToScroll={1}
                    autoplay
                    autoplaySpeed={5000}
                    arrows={false}
                  >
                    {testimonials.map((t, i) => (
                      <motion.div
                        key={`second-${i}`}
                        initial={{ scale: 0.95 }}
                        whileHover={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 mx-4 sm:mx-10 min-h-[240px] flex flex-col justify-between">
                          <div className="flex flex-col sm:flex-row items-center gap-6 text-left">
                            <div className="flex-shrink-0">
                              <img
                                src={t.image}
                                alt={t.name}
                                className="w-24 h-24 rounded-full object-cover border-4 border-red-500"
                              />
                            </div>
                            <div className="flex flex-col justify-between flex-1 h-full relative">
                              <svg
                                className="w-6 h-6 text-red-400 mb-2"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M7.17 5.59A6 6 0 001 12v7h6v-7H4a4 4 0 014-4V5.59zm9 0A6 6 0 0010 12v7h6v-7h-3a4 4 0 014-4V5.59z" />
                              </svg>
                              <p className="text-base italic text-gray-700 mb-2">
                                {t.review}
                              </p>
                              <div className="flex justify-end">
                                <svg
                                  className="w-6 h-6 text-red-400 mt-2"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M16.83 18.41A6 6 0 0023 12V5h-6v7h3a4 4 0 01-4 4v2.41zm-9 0A6 6 0 0014 12V5H8v7h3a4 4 0 01-4 4v2.41z" />
                                </svg>
                              </div>
                              <div className="flex justify-end mt-4">
                                <p className="text-sm sm:text-base font-semibold text-red-600 tracking-wide italic drop-shadow-sm">
                                  — {t.name}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </Slider>
                </motion.div>
              </div>
            </section>
          </main>

          {/* Footer */}
          <footer className="py-16 px-4 sm:px-10 bg-gradient-to-b to-white text-center">
            <div className="flex flex-wrap justify-center gap-x-2 gap-y-2 mb-6">
              {keywords.map((keyword, index) => (
                <div
                  key={index}
                  className={`flex items-center ${
                    showAll || index < initialVisibleCount
                      ? "inline-flex"
                      : "hidden"
                  }`}
                >
                  <button
                    onClick={() => navigate("/register")}
                    className="text-gray-500 hover:text-red-600 transition-colors duration-200 text-sm"
                  >
                    {keyword}
                  </button>
                  {index < keywords.length - 1 && (
                    <span className="text-gray-400 mx-1">|</span>
                  )}
                </div>
              ))}
            </div>

            {keywords.length > initialVisibleCount && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-red-500 font-medium text-sm mb-6 hover:underline transition"
              >
                {showAll ? "Show Less" : "Show More"}
              </button>
            )}

            <p className="text-md sm:text-lg max-w-3xl mx-auto">
              © 2026{" "}
              <span className="text-red-600 font-semibold">
                The Life Savers.
              </span>{" "}
              All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Landing;
