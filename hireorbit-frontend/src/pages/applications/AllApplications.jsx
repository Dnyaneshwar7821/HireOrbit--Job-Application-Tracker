import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ApplicationCard from "../../components/applications/ApplicationCard";
import { useApplication } from "../../context/applicationContextValue";
import { ui } from "../../styles/ui";
import { useToast } from "../../context/ToastContext";
import { useTheme } from "../../context/ThemeContext";
import {
  FaPlus,
  FaDownload,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaThList,
  FaColumns,
  FaStream,
  FaBriefcase,
  FaCalendarAlt,
  FaUndo,
} from "react-icons/fa";

const STATUSES = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"];
const VIEWS = [
  { id: "list", label: "List View", icon: FaThList },
  { id: "kanban", label: "Kanban Board", icon: FaColumns },
  { id: "timeline", label: "Timeline", icon: FaStream },
];

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
    ["list", "kanban", "timeline"].includes(searchParams.get("view"))
      ? searchParams.get("view")
      : "list",
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
    <div
      className={`p-4 md:p-6 max-w-7xl mx-auto space-y-6 font-sans min-h-[85vh] ${
        isDark ? "text-slate-100" : "text-slate-900"
      }`}
    >
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1
              className={`text-3xl font-black tracking-tight ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Job Applications
            </h1>
            <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-bold text-blue-500">
              {filteredApplications.length} {filteredApplications.length === 1 ? "Item" : "Items"}
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Manage, filter, and track your active job search pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button onClick={exportToCSV} className={ui.buttonSecondary}>
            <FaDownload className="mr-1.5 text-xs" /> Export CSV
          </button>

          <button
            onClick={() => navigate("/applications/add")}
            className={ui.buttonPrimary}
          >
            <FaPlus className="mr-1.5 text-xs" /> Add Application
          </button>
        </div>
      </div>

      {/* Upcoming Follow-ups Alert Bar */}
      {upcomingFollowUps.length > 0 && (
        <div
          className={`rounded-2xl border p-4 shadow-xl space-y-2 transition ${
            isDark
              ? "bg-slate-900/90 border-slate-800 text-white"
              : "bg-amber-50/50 border-amber-200/80 text-slate-900 shadow-amber-500/5"
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-xs tracking-wider uppercase text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <FaCalendarAlt /> Upcoming Follow-up Deadlines
            </h2>
            <span className="text-[11px] font-bold text-amber-600">
              {upcomingFollowUps.length} Scheduled
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-3 pt-1">
            {upcomingFollowUps.map((app) => (
              <button
                key={app.id}
                onClick={() => navigate(`/applications/${app.id}`)}
                className={`text-left border rounded-xl p-3 transition flex items-center justify-between ${
                  isDark
                    ? "border-slate-800 bg-slate-950/80 hover:border-slate-700"
                    : "border-amber-200 bg-white hover:bg-amber-50/80 shadow-sm"
                }`}
              >
                <div>
                  <p className="font-bold text-xs">{app.companyName}</p>
                  <p className="text-[11px] text-blue-500 font-semibold">{app.jobRole}</p>
                </div>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-100 dark:bg-amber-950/80 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-300">
                  {app.followUpDate}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter Toolbar + View Switcher Bar */}
      <div
        className={`rounded-3xl border p-4 sm:p-5 shadow-xl space-y-4 transition ${
          isDark
            ? "bg-slate-900/90 border-slate-800"
            : "bg-white border-slate-200 shadow-slate-200/60"
        }`}
      >
        {/* Search and Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              placeholder="Search company, role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${ui.input} pl-9`}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={ui.input}
            >
              <option value="">All Statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Employment Type Filter */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={ui.input}
            >
              <option value="">All Employment Types</option>
              {employmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
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
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("");
              setTypeFilter("");
              setSortBy("newest");
            }}
            className={ui.buttonSecondary}
            title="Reset Filters"
          >
            <FaUndo className="mr-1.5 text-xs" /> Reset Filters
          </button>
        </div>

        {/* View Mode Segmented Tab Switcher */}
        <div className="flex items-center justify-between border-t pt-4 border-slate-800/60 dark:border-slate-800 border-slate-200">
          <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Display View
          </span>

          <div
            className={`inline-flex items-center p-1 rounded-2xl border ${
              isDark
                ? "bg-slate-950 border-slate-800"
                : "bg-slate-100 border-slate-200"
            }`}
          >
            {VIEWS.map((item) => {
              const Icon = item.icon;
              const isActive = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30"
                      : isDark
                      ? "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                  }`}
                >
                  <Icon className="text-xs" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Display */}
      {applications.length === 0 ? (
        <div
          className={`rounded-3xl border p-12 text-center shadow-xl space-y-4 ${
            isDark
              ? "bg-slate-900/90 border-slate-800 text-slate-100"
              : "bg-white border-slate-200 text-slate-900 shadow-slate-200/50"
          }`}
        >
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-500/10 text-3xl text-blue-500 border border-blue-500/20 shadow-lg">
            <FaBriefcase />
          </div>
          <h3 className="text-2xl font-black tracking-tight">No Job Applications Tracked Yet</h3>
          <p className={`text-sm max-w-md mx-auto ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Keep all your recruitment pipelines, interviews, salary offers, and recruiter notes in one organized dashboard.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate("/applications/add")}
              className={ui.buttonPrimary}
            >
              <FaPlus className="mr-1.5" /> Add Your First Application
            </button>
          </div>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className={ui.emptyState}>
          No matching applications found for your filter criteria.
        </div>
      ) : view === "kanban" ? (
        <KanbanView
          applications={filteredApplications}
          onMove={moveApplication}
          isDark={isDark}
        />
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
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {STATUSES.map((status) => {
      const colApps = applications.filter((app) => app.status === status);
      return (
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
          className={`rounded-3xl p-4 min-h-[320px] border transition space-y-3 ${
            isDark
              ? "bg-slate-900/80 border-slate-800/90"
              : "bg-slate-100/80 border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/40 dark:border-slate-800 border-slate-200">
            <h2 className={`font-black text-xs uppercase tracking-wider ${isDark ? "text-white" : "text-slate-900"}`}>
              {status}
            </h2>
            <span className="rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2.5 py-0.5 text-[11px] font-bold">
              {colApps.length}
            </span>
          </div>

          <div className="space-y-3">
            {colApps.length === 0 ? (
              <p className={`text-xs text-center py-8 ${isDark ? "text-slate-600" : "text-slate-400"}`}>
                Drop items here
              </p>
            ) : (
              colApps.map((app) => (
                <div
                  key={app.id}
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("text/plain", String(app.id))
                  }
                  className={`rounded-2xl p-4 shadow-md cursor-move border transition-all duration-200 hover:-translate-y-1 ${
                    isDark
                      ? "bg-slate-950 border-slate-800/90 text-white hover:border-slate-700"
                      : "bg-white border-slate-200 text-slate-900 shadow-slate-200/50 hover:border-blue-300"
                  }`}
                >
                  <p className="font-extrabold text-sm">{app.companyName}</p>
                  <p className="text-xs text-blue-500 font-semibold mt-0.5">
                    {app.jobRole}
                  </p>
                  {app.followUpDate && (
                    <p className="text-[11px] text-amber-500 font-bold mt-2 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 inline-block">
                      Follow up: {app.followUpDate}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      );
    })}
  </div>
);

const TimelineView = ({ applications, isDark }) => (
  <div
    className={`rounded-3xl border p-6 sm:p-8 shadow-xl ${
      isDark
        ? "bg-slate-900/90 border-slate-800 text-white"
        : "bg-white border-slate-200 text-slate-900 shadow-slate-200/50"
    }`}
  >
    <div className="relative border-l-2 border-blue-500/40 ml-4 pl-6 space-y-8">
      {applications.map((app) => (
        <div key={app.id} className="relative space-y-2">
          {/* Glowing node point */}
          <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-blue-500 border-4 border-slate-950 shadow-md shadow-blue-500/50" />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
              {app.appliedDate || "Date N/A"}
            </span>

            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                ui.badge[app.status] || "bg-slate-800 text-slate-300"
              }`}
            >
              {app.status}
            </span>
          </div>

          <h3 className="font-extrabold text-lg">
            {app.companyName} <span className="text-slate-400 font-medium text-sm">— {app.jobRole}</span>
          </h3>

          <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            {[app.location, app.salaryRange, app.employmentType]
              .filter(Boolean)
              .join(" • ")}
          </p>

          {app.followUpDate && (
            <p className="text-xs font-bold text-amber-500">
              ⏰ Follow-up scheduled for {app.followUpDate}
            </p>
          )}

          {app.notes && (
            <p
              className={`text-xs p-3 rounded-xl border mt-2 ${
                isDark
                  ? "bg-slate-950 border-slate-800/80 text-slate-300"
                  : "bg-slate-50 border-slate-200 text-slate-700"
              }`}
            >
              {app.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default AllApplications;
