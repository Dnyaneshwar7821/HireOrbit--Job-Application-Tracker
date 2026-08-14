import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ApplicationCard from "../../components/applications/ApplicationCard";
import { useApplication } from "../../context/applicationContextValue";
import { ui } from "../../styles/ui";
import { useToast } from "../../context/ToastContext";
import { useTheme } from "../../context/ThemeContext";

const STATUSES = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"];
const VIEWS = ["list", "kanban", "timeline"];

const AllApplications = () => {
  const { applications, deleteApplication, updateApplication } = useApplication();
  const { showSuccess, showError, showInfo } = useToast();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "",
  );
  const [typeFilter, setTypeFilter] = useState("");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [view, setView] = useState(
    VIEWS.includes(searchParams.get("view")) ? searchParams.get("view") : "list",
  );
  const navigate = useNavigate();

  const handleDelete = (id) => {
    deleteApplication(id)
      .then(() => showSuccess("Application deleted"))
      .catch(() => showError("Failed to delete application"));
  };

  const filteredApplications = useMemo(() => {
    const query = search.toLowerCase();

    return applications
      .filter((app) => {
        const searchable = [
          app.companyName,
          app.jobRole,
          app.location,
          app.salaryRange,
          app.source,
          app.employmentType,
          app.notes,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch = searchable.includes(query);
        const matchesStatus = statusFilter ? app.status === statusFilter : true;
        const matchesType = typeFilter
          ? app.employmentType === typeFilter
          : true;

        return matchesSearch && matchesStatus && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === "oldest") {
          return (a.appliedDate || "").localeCompare(b.appliedDate || "");
        }
        if (sortBy === "company") {
          return (a.companyName || "").localeCompare(b.companyName || "");
        }
        if (sortBy === "followUp") {
          return (a.followUpDate || "9999-12-31").localeCompare(
            b.followUpDate || "9999-12-31",
          );
        }
        return (b.appliedDate || "").localeCompare(a.appliedDate || "");
      });
  }, [applications, search, sortBy, statusFilter, typeFilter]);

  const upcomingFollowUps = applications
    .filter((app) => app.followUpDate)
    .sort((a, b) => a.followUpDate.localeCompare(b.followUpDate))
    .slice(0, 3);

  const employmentTypes = Array.from(
    new Set(applications.map((app) => app.employmentType).filter(Boolean)),
  );

  const moveApplication = async (app, status) => {
    if (app.status === status) {
      return;
    }

    await updateApplication(app.id, { ...app, status });
  };

  const exportToCSV = () => {
    if (!filteredApplications.length) {
      showInfo("No applications to export");
      return;
    }
    const headers = [
      "Company Name",
      "Job Role",
      "Status",
      "Applied Date",
      "Location",
      "Salary Range",
      "Employment Type",
      "Source",
      "Follow Up Date",
      "Notes",
    ];
    const rows = filteredApplications.map((app) => [
      `"${(app.companyName || "").replace(/"/g, '""')}"`,
      `"${(app.jobRole || "").replace(/"/g, '""')}"`,
      `"${app.status || ""}"`,
      `"${app.appliedDate || ""}"`,
      `"${(app.location || "").replace(/"/g, '""')}"`,
      `"${(app.salaryRange || "").replace(/"/g, '""')}"`,
      `"${(app.employmentType || "").replace(/"/g, '""')}"`,
      `"${(app.source || "").replace(/"/g, '""')}"`,
      `"${app.followUpDate || ""}"`,
      `"${(app.notes || "").replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "hireorbit_applications.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`p-4 md:p-6 max-w-7xl mx-auto space-y-6 font-sans min-h-[85vh] ${
      isDark ? "text-slate-100" : "text-slate-900"
    }`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <h1 className={`text-3xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
          All Applications
        </h1>

        <div className="flex gap-2">
          <button onClick={exportToCSV} className={ui.buttonSecondary}>
            📥 Export CSV
          </button>
          <button
            onClick={() => navigate("/applications/add")}
            className={ui.buttonPrimary}
          >
            + Add Application
          </button>
        </div>
      </div>

      {/* Follow ups summary widget */}
      {upcomingFollowUps.length > 0 && (
        <div className={`${ui.card} space-y-3`}>
          <h2 className="font-bold text-sm tracking-wide uppercase text-amber-500">Upcoming Follow-ups</h2>
          <div className="grid md:grid-cols-3 gap-3">
            {upcomingFollowUps.map((app) => (
              <button
                key={app.id}
                onClick={() => navigate(`/applications/${app.id}`)}
                className={`text-left border rounded-xl p-3.5 transition ${
                  isDark
                    ? "border-slate-800 bg-slate-950/70 hover:border-slate-700"
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <p className="font-bold text-sm">{app.companyName}</p>
                <p className="text-xs text-amber-600 font-semibold mt-1">Follow-up: {app.followUpDate}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="grid md:grid-cols-5 gap-3">
        <input
          type="text"
          placeholder="Search company, role, notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={ui.input}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={ui.input}
        >
          <option value="">All Status</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className={ui.input}
        >
          <option value="">All Types</option>
          {employmentTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={ui.input}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="company">Company A-Z</option>
          <option value="followUp">Follow-up Date</option>
        </select>

        <button
          onClick={() => {
            setSearch("");
            setStatusFilter("");
            setTypeFilter("");
            setSortBy("newest");
          }}
          className={ui.buttonSecondary}
        >
          Clear
        </button>
      </div>

      {/* View Selector Tabs */}
      <div className="flex gap-2">
        {VIEWS.map((mode) => (
          <button
            key={mode}
            onClick={() => setView(mode)}
            className={
              view === mode
                ? ui.buttonPrimary
                : isDark
                ? "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 px-4 py-2 rounded-xl text-xs font-bold transition"
                : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 shadow-sm px-4 py-2 rounded-xl text-xs font-bold transition"
            }
          >
            {mode[0].toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {/* Applications Output */}
      {applications.length === 0 ? (
        <div className={ui.emptyState}>
          No applications yet. Start by adding one.
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className={ui.emptyState}>No matching applications found</div>
      ) : view === "kanban" ? (
        <KanbanView applications={filteredApplications} onMove={moveApplication} isDark={isDark} />
      ) : view === "timeline" ? (
        <TimelineView applications={filteredApplications} isDark={isDark} />
      ) : (
        <div className="grid gap-4">
          {filteredApplications.map((app) => (
            <ApplicationCard key={app.id} app={app} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

const KanbanView = ({ applications, onMove, isDark }) => (
  <div className="grid md:grid-cols-4 gap-4">
    {STATUSES.map((status) => (
      <div
        key={status}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          const app = applications.find(
            (item) => item.id === Number(e.dataTransfer.getData("text/plain")),
          );
          if (app) {
            onMove(app, status);
          }
        }}
        className={`rounded-2xl p-4 min-h-72 border transition ${
          isDark ? "bg-slate-900/80 border-slate-800" : "bg-slate-100 border-slate-200"
        }`}
      >
        <h2 className={`font-bold mb-3 text-sm tracking-wider uppercase ${isDark ? "text-white" : "text-slate-900"}`}>{status}</h2>
        <div className="space-y-3">
          {applications
            .filter((app) => app.status === status)
            .map((app) => (
              <div
                key={app.id}
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData("text/plain", String(app.id))
                }
                className={`rounded-xl p-3.5 shadow-md cursor-move border transition ${
                  isDark
                    ? "bg-slate-950 border-slate-800 text-white"
                    : "bg-white border-slate-200 text-slate-900 shadow-slate-200/50"
                }`}
              >
                <p className="font-bold text-sm">{app.companyName}</p>
                <p className="text-xs text-blue-500 font-semibold mt-0.5">{app.jobRole}</p>
                {app.followUpDate && (
                  <p className="text-[11px] text-amber-500 font-bold mt-2">
                    Follow up: {app.followUpDate}
                  </p>
                )}
              </div>
            ))}
        </div>
      </div>
    ))}
  </div>
);

const TimelineView = ({ applications, isDark }) => (
  <div className={`rounded-2xl border p-6 shadow-xl ${
    isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-slate-200/50"
  }`}>
    {applications.map((app) => (
      <div key={app.id} className="border-l-4 border-blue-500 pl-4 pb-6 space-y-1">
        <p className="text-xs font-bold text-blue-400">{app.appliedDate}</p>
        <h2 className="font-extrabold text-base">
          {app.companyName} — {app.jobRole}
        </h2>
        <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>Status: <span className="font-bold text-blue-500">{app.status}</span></p>
        {app.followUpDate && (
          <p className="text-xs font-bold text-amber-500">
            Follow-up scheduled for {app.followUpDate}
          </p>
        )}
        {app.notes && <p className={`text-xs mt-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{app.notes}</p>}
      </div>
    ))}
  </div>
);

export default AllApplications;
