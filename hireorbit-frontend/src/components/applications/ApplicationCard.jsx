import { useNavigate } from "react-router-dom";
import { ui } from "../../styles/ui";
import { useTheme } from "../../context/ThemeContext";

const ApplicationCard = ({ app, onDelete }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <article
      className={`rounded-2xl border p-5 shadow-md transition-all duration-300 ${
        isDark
          ? "border-slate-800 bg-slate-900/90 text-white hover:border-slate-700 hover:bg-slate-900"
          : "border-slate-200 bg-white text-slate-900 shadow-slate-200/50 hover:border-blue-300 hover:shadow-xl"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className={`truncate text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              {app.companyName || "N/A"}
            </h2>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                ui.badge[app.status] || (isDark ? "bg-slate-800 text-slate-300 border border-slate-700" : "bg-slate-100 text-slate-700 border border-slate-200")
              }`}
            >
              {app.status}
            </span>
          </div>

          <p className="font-semibold text-blue-500 text-sm">{app.jobRole || "N/A"}</p>
          <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            {[app.location, app.salaryRange, app.employmentType]
              .filter(Boolean)
              .join(" • ") || "No extra details"}
          </p>

          {app.followUpDate && (
            <p className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 inline-block mt-2">
              Follow up: {app.followUpDate}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
          <button
            onClick={() => navigate(`/applications/${app.id}`)}
            className={ui.buttonSecondary}
          >
            View Details
          </button>

          <button
            onClick={() => navigate(`/applications/update/${app.id}`)}
            className={ui.buttonSecondary}
          >
            Edit
          </button>

          <button
            onClick={() => navigate(`/interviews/${app.id}`)}
            className={ui.buttonPrimary}
          >
            Interviews
          </button>

          <button
            onClick={() => onDelete(app.id)}
            className={`inline-flex items-center justify-center rounded-xl border px-3.5 py-2 font-bold text-xs transition ${
              isDark
                ? "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
            }`}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
};

export default ApplicationCard;
