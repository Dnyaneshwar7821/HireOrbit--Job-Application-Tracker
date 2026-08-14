import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../api/authService";
import { useToast } from "../../context/ToastContext";
import { useTheme } from "../../context/ThemeContext";
import { useApplication } from "../../context/applicationContextValue";
import {
  FaUserCheck,
  FaShieldAlt,
  FaBriefcase,
  FaCalendarCheck,
  FaBrain,
  FaTrash,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaDollarSign,
} from "react-icons/fa";

const Profile = () => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [showDelete, setShowDelete] = useState(false);
  const [password, setPassword] = useState("");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [targetSalary, setTargetSalary] = useState("$120,000 - $150,000");
  const [locationPref, setLocationPref] = useState("Remote / Hybrid");
  const [skills, setSkills] = useState(["React", "TypeScript", "Node.js", "Java", "Spring Boot", "SQL"]);

  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { theme } = useTheme();
  const { applications } = useApplication();

  const isDark = theme === "dark";
  const userInitial = (user?.name || "U").charAt(0).toUpperCase();

  const totalApps = applications.length;
  const interviewsCount = applications.filter((a) => a.status === "INTERVIEW").length;

  useEffect(() => {
    authService
      .getProfile()
      .then((res) => setUser(res.data))
      .catch(() => {});
  }, []);

  const handleDelete = async () => {
    if (!password) {
      showError("Enter password to confirm deletion");
      return;
    }

    try {
      await authService.deleteAccount(password);
      showSuccess("Account deleted successfully");
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      showError(err.response?.data?.message || err.response?.data || "Delete failed");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto font-sans min-h-[85vh] space-y-8">
      {/* Header Profile Hero Card */}
      <div
        className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 shadow-2xl transition-colors duration-200 ${
          isDark
            ? "border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white"
            : "border-blue-200 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-blue-500/20"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* Avatar Bubble */}
          <div className="grid h-24 w-24 flex-shrink-0 place-items-center rounded-3xl bg-white/20 text-4xl font-black text-white shadow-2xl backdrop-blur-md border border-white/30">
            {userInitial}
          </div>

          {/* User Primary Info */}
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {user?.name || "Job Seeker"}
              </h1>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-3 py-0.5 text-xs font-bold text-emerald-200 backdrop-blur-md">
                <FaUserCheck className="text-emerald-300" /> Active Candidate
              </span>
            </div>

            <p className="text-sm opacity-90 font-medium">{user?.email || "N/A"}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs">
              <span className="rounded-full bg-white/10 px-3 py-1 font-bold border border-white/20">
                👑 Role: {user?.role || "USER"}
              </span>

              <span className="rounded-full bg-white/10 px-3 py-1 font-semibold border border-white/20">
                📅 Member Since: 2026
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Statistics Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className={`rounded-2xl border p-5 transition shadow-lg ${
            isDark ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-slate-200/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-extrabold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Applications Tracked
            </span>
            <FaBriefcase className="text-blue-500 text-sm" />
          </div>
          <p className="text-3xl font-black mt-2 text-blue-500">{totalApps}</p>
        </div>

        <div
          className={`rounded-2xl border p-5 transition shadow-lg ${
            isDark ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-slate-200/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-extrabold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Interviews Scheduled
            </span>
            <FaCalendarCheck className="text-amber-500 text-sm" />
          </div>
          <p className="text-3xl font-black mt-2 text-amber-500">{interviewsCount}</p>
        </div>

        <div
          className={`rounded-2xl border p-5 transition shadow-lg ${
            isDark ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-slate-200/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-extrabold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              AI Resume Diagnostics
            </span>
            <FaBrain className="text-purple-500 text-sm" />
          </div>
          <p className="text-3xl font-black mt-2 text-purple-500">Active</p>
        </div>
      </div>

      {/* Career Preferences & Target Profile Settings */}
      <div
        className={`rounded-3xl border p-6 sm:p-8 shadow-xl space-y-6 transition-colors duration-200 ${
          isDark ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-slate-200/50"
        }`}
      >
        <h2 className={`text-xl font-extrabold tracking-tight border-b pb-4 ${
          isDark ? "border-slate-800 text-white" : "border-slate-200 text-slate-900"
        }`}>
          Target Career Preferences
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className={`block text-xs font-extrabold uppercase tracking-wider mb-1.5 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}>
              Target Role
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className={`w-full p-3 rounded-xl border text-sm font-semibold outline-none ${
                isDark
                  ? "bg-slate-950 border-slate-800 text-white placeholder-slate-500"
                  : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-extrabold uppercase tracking-wider mb-1.5 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}>
              Target Salary Expectation
            </label>
            <div className="relative">
              <input
                type="text"
                value={targetSalary}
                onChange={(e) => setTargetSalary(e.target.value)}
                className={`w-full p-3 pl-8 rounded-xl border text-sm font-semibold outline-none ${
                  isDark
                    ? "bg-slate-950 border-slate-800 text-white placeholder-slate-500"
                    : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
                }`}
              />
              <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-extrabold uppercase tracking-wider mb-1.5 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}>
              Work Preference
            </label>
            <div className="relative">
              <input
                type="text"
                value={locationPref}
                onChange={(e) => setLocationPref(e.target.value)}
                className={`w-full p-3 pl-8 rounded-xl border text-sm font-semibold outline-none ${
                  isDark
                    ? "bg-slate-950 border-slate-800 text-white placeholder-slate-500"
                    : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
                }`}
              />
              <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            </div>
          </div>
        </div>

        {/* Primary Skill Badges */}
        <div className="space-y-2 pt-2">
          <label className={`block text-xs font-extrabold uppercase tracking-wider ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}>
            Primary Skill Tags & Technologies
          </label>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="bg-blue-500/10 text-blue-500 border border-blue-500/20 text-xs font-extrabold px-3 py-1 rounded-xl"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Danger Zone: Account Security & Deletion Card */}
      <div className="rounded-3xl border border-red-500/30 bg-red-500/5 p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b pb-4 border-red-500/20">
          <div className="flex items-center gap-2 text-red-500">
            <FaExclamationTriangle className="text-lg" />
            <h2 className="text-base font-extrabold">Account Security & Danger Zone</h2>
          </div>

          <button
            onClick={() => setShowDelete(!showDelete)}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-xl font-extrabold text-xs transition cursor-pointer"
          >
            {showDelete ? "Cancel" : "Delete Account"}
          </button>
        </div>

        <p className="text-xs text-red-400/90 leading-relaxed font-semibold">
          Deleting your account will permanently remove all stored applications, interview rounds, custom notes, and resume match history.
        </p>

        {showDelete && (
          <div className="pt-2 space-y-3 max-w-md">
            <label className="block text-xs font-extrabold text-red-400 uppercase tracking-wider">
              Enter Password to Confirm Deletion
            </label>
            <input
              type="password"
              placeholder="Enter password to confirm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 rounded-xl border text-sm outline-none ${
                isDark
                  ? "bg-slate-950 border-slate-800 text-white placeholder-slate-500"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
              }`}
            />

            <button
              onClick={handleDelete}
              className="w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-3 rounded-xl transition shadow-lg shadow-red-600/20 cursor-pointer"
            >
              <FaTrash /> Permanently Delete Account & Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
