import { useNavigate } from "react-router-dom";
import { ui } from "../../styles/ui";

const ApplicationCard = ({ app, onDelete }) => {
  const navigate = useNavigate();

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl transition-all duration-300 hover:border-slate-700 hover:bg-slate-900">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="truncate text-lg font-bold text-white">
              {app.companyName || "N/A"}
            </h2>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                ui.badge[app.status] || "bg-slate-800 text-slate-300 border border-slate-700"
              }`}
            >
              {app.status}
            </span>
          </div>

          <p className="font-semibold text-blue-400 text-sm">{app.jobRole || "N/A"}</p>
          <p className="text-xs text-slate-400">
            {[app.location, app.salaryRange, app.employmentType]
              .filter(Boolean)
              .join(" • ") || "No extra details"}
          </p>

          {app.followUpDate && (
            <p className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 inline-block mt-2">
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
            className="inline-flex items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2 font-bold text-xs text-red-400 transition hover:bg-red-500/20"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
};

export default ApplicationCard;
