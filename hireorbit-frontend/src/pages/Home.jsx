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
  FaStar,
  FaRocket,
  FaDatabase,
  FaLock,
  FaRobot,
} from "react-icons/fa";

const features = [
  {
    title: "Pipeline Analytics",
    description: "Track application statuses, offers, interview schedules, and follow-ups with real-time metrics.",
    icon: FaChartLine,
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Application CRM",
    description: "Keep company details, roles, salary, source, and recruiter notes synchronized in one grid.",
    icon: FaBriefcase,
    color: "from-indigo-500 to-purple-600",
  },
  {
    title: "Interview Stage Tracker",
    description: "Structure multi-stage technical and behavioral interviews with custom outcome logs.",
    icon: FaCalendarCheck,
    color: "from-purple-500 to-pink-600",
  },
  {
    title: "AI Resume & ATS Match",
    description: "Compare your resume against job descriptions with Gemini AI diagnostics & keyword heatmaps.",
    icon: FaBrain,
    color: "from-blue-600 to-cyan-600",
  },
];

const steps = [
  {
    num: "01",
    title: "Select Portal & Sign In",
    desc: "Choose between Job Seeker or Platform Administrator access with JWT authentication.",
  },
  {
    num: "02",
    title: "Log Applications & CRM",
    desc: "Track company role details, applied dates, salary ranges, and follow-up deadlines.",
  },
  {
    num: "03",
    title: "Run Gemini ATS Analyzer",
    desc: "Upload PDF/Word resumes to get instant ATS scores, keyword heatmaps, and tailored cover letters.",
  },
  {
    num: "04",
    title: "Manage Interviews & Offers",
    desc: "Track multi-round technical interviews, view success analytics, and secure your job offer.",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("user");
  const [activeTab, setActiveTab] = useState("pipeline");

  const handlePortalNavigate = () => {
    if (selectedRole === "admin") {
      navigate("/admin/login");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white overflow-x-hidden font-sans">
      {/* Background Animated Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/15 to-purple-600/20 blur-[120px] pointer-events-none rounded-full" />

      {/* Navigation Header */}
      <nav className="relative z-10 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-lg font-black text-white shadow-lg shadow-blue-500/20">
              H
            </span>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white">HireOrbit</span>
              <span className="ml-2 text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                v2.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-bold text-slate-300 hover:text-white px-4 py-2 rounded-xl transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative mx-auto grid min-h-[85vh] max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:py-20">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/50 px-4 py-1.5 text-xs font-semibold text-blue-400 backdrop-blur-md shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            Next-Gen Career Command Center
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.08]">
            Track Applications. <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Master Your Search.
            </span>
          </h1>

          <p className="max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Organize every interview round, score resume ATS readiness using Gemini 1.5 AI, and manage your full recruitment pipeline in one intuitive workspace.
          </p>

          {/* Access Portal Card */}
          <div className="max-w-lg rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Select Access Portal
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
                Spring Security RBAC
              </span>
            </div>

            {/* Segmented Tab Switcher */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedRole("user")}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-lg font-bold text-xs transition duration-200 ${
                  selectedRole === "user"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <FaUserGraduate className="text-sm" />
                <span>Job Seeker</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("admin")}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-lg font-bold text-xs transition duration-200 ${
                  selectedRole === "admin"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <FaShieldAlt className="text-sm" />
                <span>Admin Portal</span>
              </button>
            </div>

            {/* Action Buttons Stack */}
            <div className="space-y-2.5">
              {selectedRole === "user" ? (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm py-3.5 px-5 rounded-xl shadow-lg shadow-blue-600/20 transition transform active:scale-98"
                  >
                    <span>Sign In as Job Seeker</span>
                    <FaArrowRight className="text-xs" />
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="w-full flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800 text-slate-200 font-bold text-xs py-3 px-5 rounded-xl border border-slate-800 transition"
                  >
                    <span>Create Free Account</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate("/admin/login")}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm py-3.5 px-5 rounded-xl shadow-lg shadow-purple-600/20 transition transform active:scale-98"
                >
                  <FaShieldAlt />
                  <span>Sign In to Admin Control Panel</span>
                  <FaArrowRight className="text-xs" />
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 pt-1">
              <FaCheckCircle className="text-emerald-400 text-[10px]" />
              {selectedRole === "admin"
                ? "Restricted access (admin@hireorbit.com)"
                : "Free job application tracking & AI resume scoring"}
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Product Showcase Preview */}
        <div className="lg:col-span-5">
          <div className="relative rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 shadow-2xl backdrop-blur-xl">
            {/* Interactive Showcase Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Interactive Showcase
                </p>
                <h2 className="text-lg font-bold text-white mt-0.5">Dashboard Preview</h2>
              </div>
              <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveTab("pipeline")}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition ${
                    activeTab === "pipeline" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Pipeline
                </button>
                <button
                  onClick={() => setActiveTab("ats")}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition ${
                    activeTab === "ats" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  ATS AI
                </button>
              </div>
            </div>

            {/* Tab Content 1: Pipeline */}
            {activeTab === "pipeline" && (
              <div className="space-y-3">
                {[
                  { label: "Applications Tracked", count: 24, badge: "Applied", color: "text-blue-400" },
                  { label: "Interviews Scheduled", count: 5, badge: "In Progress", color: "text-amber-400" },
                  { label: "Job Offers Extended", count: 2, badge: "Accepted", color: "text-emerald-400" },
                  { label: "AI ATS Readability", count: "94%", badge: "Gemini 1.5", color: "text-purple-400" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/70 p-3.5 transition hover:border-slate-700"
                  >
                    <div>
                      <span className="text-xs text-slate-400 block">{row.label}</span>
                      <span className={`text-xl font-extrabold ${row.color}`}>{row.count}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-slate-900 text-slate-300 border border-slate-800">
                      {row.badge}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Tab Content 2: ATS AI Preview */}
            {activeTab === "ats" && (
              <div className="space-y-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-purple-400">✨ Gemini AI Diagnostic</span>
                  <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    94% ATS Score
                  </span>
                </div>
                <div className="space-y-1.5">
                  <span className="text-xs text-slate-300 font-semibold block">🟢 Matched Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {["Java", "Spring Boot", "React", "REST API", "MySQL"].map((s) => (
                      <span key={s} className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs text-slate-300 font-semibold block">🔴 Missing Keywords:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {["Docker", "Kubernetes", "Redis"].map((s) => (
                      <span key={s} className="text-[10px] bg-red-950 text-red-300 px-2 py-0.5 rounded border border-red-800">
                        + {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tech Stack Banner */}
      <section className="border-y border-slate-800/80 bg-slate-900/40 py-8 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">
            Powered by Enterprise Open Source Tech Stack
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
              <FaRobot className="text-blue-400 text-sm" /> Java 17 & Spring Boot 2.7
            </span>
            <span className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
              <FaDatabase className="text-cyan-400 text-sm" /> MySQL & TiDB Cloud
            </span>
            <span className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
              <FaStar className="text-purple-400 text-sm" /> Google Gemini 1.5 AI
            </span>
            <span className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
              <FaLock className="text-emerald-400 text-sm" /> Spring Security RBAC
            </span>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/40 px-3.5 py-1 text-xs font-semibold text-purple-400 mb-3">
            Core Features
          </div>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Everything You Need to Land Your Next Offer
          </h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            Designed for software engineers, data specialists, and tech professionals.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition duration-300 hover:-translate-y-1.5 hover:border-slate-700 hover:bg-slate-900/90 shadow-xl"
              >
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${feature.color} text-white shadow-lg`}
                >
                  <Icon className="text-xl" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition">
                  {feature.title}
                </h3>
                <p className="mt-2.5 text-xs leading-relaxed text-slate-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Step by Step Workflow */}
      <section className="relative border-t border-slate-800/80 bg-slate-900/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-white">How HireOrbit Streamlines Your Search</h2>
            <p className="text-sm text-slate-400 mt-2">From application submission to offer acceptance in 4 clear steps.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.num} className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-3">
                <span className="text-3xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent block">
                  {s.num}
                </span>
                <h3 className="text-base font-bold text-white">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-lg bg-blue-600 text-xs font-bold text-white">
              H
            </span>
            <span className="font-bold text-slate-300">HireOrbit Application Tracker</span>
          </div>
          <p>© 2026 HireOrbit. Built for software engineering portfolio & career tracking.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
