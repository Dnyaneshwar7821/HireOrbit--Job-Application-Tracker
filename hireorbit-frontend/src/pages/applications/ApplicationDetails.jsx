import { useParams, useNavigate } from "react";
import { useApplication } from "../../context/applicationContextValue";
import { useTheme } from "../../context/ThemeContext";
import { ui } from "../../styles/ui";

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { applications } = useApplication();
  const { theme } = useTheme();

  const isDark = theme === "dark";
  const application = applications.find((app) => app.id === Number(id));

  if (!application) {
    return <p className="p-6 text-slate-400">Application not found</p>;
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
          Application Details
        </h1>
        <button onClick={() => navigate("/applications")} className={ui.buttonSecondary}>
          ← Back to List
        </button>
      </div>

      <div
        className={`p-6 md:p-8 rounded-3xl border shadow-xl space-y-4 ${
          isDark
            ? "bg-slate-900/90 border-slate-800 text-slate-100"
            : "bg-white border-slate-200 text-slate-900 shadow-slate-200/50"
        }`}
      >
        <div className="flex justify-between items-start border-b pb-4 border-slate-700/50">
          <div>
            <h2 className="text-xl font-bold">{application.companyName}</h2>
            <p className="text-sm font-semibold text-blue-400 mt-0.5">{application.jobRole}</p>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-bold border ${ui.badge[application.status] || "bg-slate-800 text-slate-300"}`}>
            {application.status}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className={`block font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>Applied Date</span>
            <span className="font-bold text-sm">{application.appliedDate || "N/A"}</span>
          </div>

          <div>
            <span className={`block font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>Location</span>
            <span className="font-bold text-sm">{application.location || "N/A"}</span>
          </div>

          <div>
            <span className={`block font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>Salary Range</span>
            <span className="font-bold text-sm">{application.salaryRange || "N/A"}</span>
          </div>

          <div>
            <span className={`block font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>Employment Type</span>
            <span className="font-bold text-sm">{application.employmentType || "N/A"}</span>
          </div>

          <div>
            <span className={`block font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>Source</span>
            <span className="font-bold text-sm">{application.source || "N/A"}</span>
          </div>

          <div>
            <span className={`block font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>Follow-up Deadline</span>
            <span className="font-bold text-sm text-amber-400">{application.followUpDate || "Not set"}</span>
          </div>
        </div>

        {application.jobUrl && (
          <div className="pt-2 border-t border-slate-700/50">
            <span className={`block text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>Posting Link</span>
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-blue-400 hover:underline break-all"
            >
              {application.jobUrl}
            </a>
          </div>
        )}

        {application.notes && (
          <div className="pt-2 border-t border-slate-700/50">
            <span className={`block text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>Notes & Feedback</span>
            <p className="text-xs mt-1 whitespace-pre-wrap leading-relaxed">{application.notes}</p>
          </div>
        )}

        <div className="pt-4 border-t border-slate-700/50 flex gap-3">
          <button
            onClick={() => navigate(`/interviews/${application.id}`)}
            className={ui.buttonPrimary}
          >
            Manage Interview Stages
          </button>
          <button
            onClick={() => navigate(`/applications/update/${application.id}`)}
            className={ui.buttonSecondary}
          >
            Edit Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
