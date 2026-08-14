import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBrain,
  FaBriefcase,
  FaCalendarCheck,
  FaChartLine,
  FaShieldAlt,
  FaUserGraduate,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

const features = [
  {
    title: "Pipeline Analytics",
    description: "Track applications, offers, interview schedules, and follow-ups with interactive metrics.",
    icon: FaChartLine,
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Application CRM",
    description: "Keep company roles, compensation, status, and recruiter notes synchronized in one grid.",
    icon: FaBriefcase,
    color: "from-indigo-500 to-purple-600",
  },
  {
    title: "Interview Rounds Tracker",
    description: "Structure multi-stage technical and behavioral interviews with custom feedback logs.",
    icon: FaCalendarCheck,
    color: "from-purple-500 to-pink-600",
  },
  {
    title: "AI Resume & ATS Match",
    description: "Compare your resume against target job descriptions with Gemini AI diagnostics & heatmaps.",
    icon: FaBrain,
    color: "from-blue-600 to-cyan-600",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("user");

  const handlePortalNavigate = () => {
    if (selectedRole === "admin") {
      navigate("/admin/login");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative mx-auto grid min-h-[90vh] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:py-24">
        {/* Left Column: Headline & Role Dropdown Selector */}
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/60 px-4 py-1.5 text-xs font-semibold text-blue-400 backdrop-blur-md shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            AI-Powered Career Command Center
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl leading-[1.1]">
            Track Applications. <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Master Your Job Search.
            </span>
          </h1>

          <p className="max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">
            Organize every interview stage, evaluate resume ATS compatibility with Gemini AI, and manage your end-to-end recruitment pipeline.
          </p>

          {/* Role Selection Dropdown Card */}
          <div className="max-w-md rounded-2xl border border-slate-800 bg-slate-800/80 p-5 shadow-2xl backdrop-blur-xl space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Select Your Access Portal
            </label>

            <div className="relative">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition cursor-pointer"
              >
                <option value="user">🧑‍💻 Job Seeker Portal (User Dashboard)</option>
                <option value="admin">👑 Administrator Portal (Platform Management)</option>
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                ▼
              </div>
            </div>

            {/* Dynamic Action Buttons based on Role */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={handlePortalNavigate}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl font-bold text-sm px-5 py-3.5 shadow-lg transition ${
                  selectedRole === "admin"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white"
                }`}
              >
                {selectedRole === "admin" ? (
                  <>
                    <FaShieldAlt /> Enter Admin Portal <FaArrowRight className="text-xs" />
                  </>
                ) : (
                  <>
                    <FaUserGraduate /> Continue to User Login <FaArrowRight className="text-xs" />
                  </>
                )}
              </button>

              {selectedRole === "user" && (
                <Link
                  to="/register"
                  className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3.5 text-center font-bold text-sm text-slate-200 hover:bg-slate-800 hover:text-white transition"
                >
                  Create Account
                </Link>
              )}
            </div>

            <p className="text-xs text-slate-400 text-center flex items-center justify-center gap-1">
              <FaCheckCircle className="text-emerald-400 text-[10px]" />
              {selectedRole === "admin"
                ? "Restricted to authorized admins (admin@hireorbit.com)"
                : "Free job application tracking & AI resume scoring"}
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Live Preview Card */}
        <div className="lg:col-span-5">
          <div className="relative rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-800/90 to-slate-900/90 p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Interactive Showcase
                </p>
                <h2 className="text-xl font-bold text-white mt-0.5">Dashboard Preview</h2>
              </div>
              <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-3 py-1 text-xs font-bold text-blue-400">
                Product Showcase
              </span>
            </div>

            <div className="space-y-3">
              {[
                { label: "Applications Submitted", count: 24, badge: "Applied", color: "text-blue-400" },
                { label: "Interviews Scheduled", count: 5, badge: "In Progress", color: "text-amber-400" },
                { label: "Offers Received", count: 2, badge: "Accepted", color: "text-emerald-400" },
                { label: "AI Resume Match Score", count: "94%", badge: "Gemini AI", color: "text-purple-400" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-4 transition hover:border-slate-700"
                >
                  <div>
                    <span className="text-xs text-slate-400 block">{row.label}</span>
                    <span className={`text-xl font-extrabold ${row.color}`}>{row.count}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    {row.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-white">
            Everything You Need to Land Your Next Offer
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Built for modern software engineers, data professionals, and ambitious job seekers.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-slate-800 bg-slate-800/50 p-6 transition duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-800/80 shadow-lg"
              >
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${feature.color} text-white shadow-md`}
                >
                  <Icon className="text-xl" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition">
                  {feature.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;
