import { useNavigate } from "react-router-dom";
import { ui } from "../../styles/ui";

const ApplicationCard = ({ app, onDelete }) => {
  const navigate = useNavigate();

  return (
    <article className={`${ui.card} transition hover:border-blue-200 hover:shadow-md`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h2 className="truncate text-lg font-semibold text-slate-950">
              {app.companyName || "N/A"}
            </h2>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                ui.badge[app.status] || "bg-slate-100 text-slate-600 ring-slate-200"
              }`}
            >
              {app.status}
            </span>
          </div>

          <p className="font-medium text-slate-700">{app.jobRole || "N/A"}</p>
          <p className="mt-1 text-sm text-slate-500">
            {[app.location, app.salaryRange, app.employmentType]
              .filter(Boolean)
              .join(" / ") || "No extra details"}
          </p>

          {app.followUpDate && (
            <p className="mt-2 text-sm font-medium text-amber-700">
              Follow up: {app.followUpDate}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
          <button
            onClick={() => navigate(`/applications/${app.id}`)}
            className={ui.buttonSecondary}
          >
            View
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
            className="inline-flex items-center justify-center rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 font-medium text-rose-700 transition hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
};

export default ApplicationCard;
