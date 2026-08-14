import { useNavigate } from "react";
import { ui } from "../../styles/ui";
import { useTheme } from "../../context/ThemeContext";
import { FaMapMarkerAlt, FaDollarSign, FaBriefcase, FaCalendarAlt, FaExternalLinkAlt, FaTrash, FaEdit, FaComments, FaEye } from "react-icons/fa";

const statusDotColors = {
  APPLIED: "bg-blue-500",
  INTERVIEW: "bg-amber-500",
  OFFER: "bg-emerald-500",
  REJECTED: "bg-red-500",
};

const ApplicationCard = ({ app, onDelete }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const companyInitial = (app.companyName || "C").charAt(0).toUpperCase();

  return (
    <article
      className={`group relative rounded-3xl border p-5 sm:p-6 transition-all duration-300 transform hover:-translate-y-1 ${
        isDark
          ? "border-slate-800/90 bg-slate-900/90 text-white hover:border-slate-700 hover:shadow-2xl hover:shadow-slate-950/80"
          : "border-slate-200 bg-white text-slate-900 shadow-md shadow-slate-200/50 hover:border-blue-300 hover:shadow-xl hover:shadow-slate-200/80"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Side: Avatar + Details */}
        <div className="flex items-start gap-4 min-w-0">
          {/* Company Avatar Bubble */}
          <div className="hidden sm:grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-lg font-black text-white shadow-md shadow-blue-500/20">
            {companyInitial}
          </div>

          <div className="min-w-0 space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className={`truncate text-lg font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                {app.companyName || "N/A"}
              </h2>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[11px] font-extrabold border ${
                  ui.badge[app.status] ||
                  (isDark
                    ? "bg-slate-800 text-slate-300 border-slate-700"
                    : "bg-slate-100 text-slate-700 border-slate-200")
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${statusDotColors[app.status] || "bg-slate-400"}`} />
                {app.status}
              </span>
            </div>

            <p className="font-bold text-blue-500 text-sm flex items-center gap-2">
              <span>{app.jobRole || "N/A"}</span>
              {app.jobUrl && (
                <a
                  href={app.jobUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-blue-500 text-xs transition"
                  title="Open Job Posting"
                >
                  <FaExternalLinkAlt />
                </a>
              )}
            </p>

            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
              {app.location && (
                <span className={`inline-flex items-center gap-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  <FaMapMarkerAlt className="text-slate-400 text-[11px]" />
                  {app.location}
                </span>
              )}

              {app.salaryRange && (
                <span className={`inline-flex items-center gap-1 font-semibold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                  <FaDollarSign className="text-[11px]" />
                  {app.salaryRange}
                </span>
              )}

              {app.employmentType && (
                <span className={`inline-flex items-center gap-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  <FaBriefcase className="text-slate-400 text-[11px]" />
                  {app.employmentType}
                </span>
              )}

              {app.appliedDate && (
                <span className={`inline-flex items-center gap-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                  Applied: {app.appliedDate}
                </span>
              )}
            </div>

            {app.followUpDate && (
              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80 px-3 py-1 rounded-xl border border-amber-200 shadow-sm">
                  <FaCalendarAlt className="text-[11px]" /> Follow up: {app.followUpDate}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-end">
          <button
            onClick={() => navigate(`/applications/${app.id}`)}
            className={ui.buttonSecondary}
            title="View Application Details"
          >
            <FaEye className="mr-1 text-[11px]" /> Details
          </button>

          <button
            onClick={() => navigate(`/applications/update/${app.id}`)}
            className={ui.buttonSecondary}
            title="Edit Application"
          >
            <FaEdit className="mr-1 text-[11px]" /> Edit
          </button>

          <button
            onClick={() => navigate(`/interviews/${app.id}`)}
            className={ui.buttonPrimary}
            title="Manage Interview Rounds"
          >
            <FaComments className="mr-1 text-[11px]" /> Interviews
          </button>

          <button
            onClick={() => onDelete(app.id)}
            className={`inline-flex items-center justify-center rounded-xl border px-3.5 py-2 font-bold text-xs transition cursor-pointer ${
              isDark
                ? "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
            }`}
            title="Delete Application"
          >
            <FaTrash className="mr-1 text-[11px]" /> Delete
          </button>
        </div>
      </div>
    </article>
  );
};

export default ApplicationCard;
