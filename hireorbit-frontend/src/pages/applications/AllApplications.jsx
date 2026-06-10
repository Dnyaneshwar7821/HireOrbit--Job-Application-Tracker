import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationCard from "../../components/applications/ApplicationCard";
import { useApplication } from "../../context/applicationContextValue";
import { ui } from "../../styles/ui";

const STATUSES = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"];

const AllApplications = () => {
  const { applications, deleteApplication, updateApplication } = useApplication();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [view, setView] = useState("list");
  const navigate = useNavigate();

  const handleDelete = (id) => {
    deleteApplication(id)
      .then(() => alert("Deleted successfully"))
      .catch(() => alert("Delete failed"));
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

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
        <h1 className="text-2xl font-bold">All Applications</h1>

        <button
          onClick={() => navigate("/applications/add")}
          className={ui.buttonPrimary}
        >
          + Add Application
        </button>
      </div>

      {upcomingFollowUps.length > 0 && (
        <div className={`${ui.card} mb-4`}>
          <h2 className="font-semibold mb-2">Upcoming Follow-ups</h2>
          <div className="grid md:grid-cols-3 gap-2">
            {upcomingFollowUps.map((app) => (
              <button
                key={app.id}
                onClick={() => navigate(`/applications/${app.id}`)}
                className="text-left border rounded-lg p-3 hover:bg-blue-50"
              >
                <p className="font-medium">{app.companyName}</p>
                <p className="text-sm text-gray-600">{app.followUpDate}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-5 gap-3 mb-4">
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

      <div className="flex gap-2 mb-4">
        {["list", "kanban", "timeline"].map((mode) => (
          <button
            key={mode}
            onClick={() => setView(mode)}
            className={
              view === mode
                ? ui.buttonPrimary
                : "bg-white border px-4 py-2 rounded-lg"
            }
          >
            {mode[0].toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {applications.length === 0 ? (
        <div className={ui.emptyState}>
          No applications yet. Start by adding one.
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className={ui.emptyState}>No matching applications found</div>
      ) : view === "kanban" ? (
        <KanbanView applications={filteredApplications} onMove={moveApplication} />
      ) : view === "timeline" ? (
        <TimelineView applications={filteredApplications} />
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

const KanbanView = ({ applications, onMove }) => (
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
        className="bg-gray-100 rounded-lg p-3 min-h-72"
      >
        <h2 className="font-bold mb-3">{status}</h2>
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
                className="bg-white rounded-lg p-3 shadow cursor-move"
              >
                <p className="font-semibold">{app.companyName}</p>
                <p className="text-sm text-gray-600">{app.jobRole}</p>
                {app.followUpDate && (
                  <p className="text-xs text-orange-600 mt-1">
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

const TimelineView = ({ applications }) => (
  <div className="bg-white rounded-lg shadow p-4">
    {applications.map((app) => (
      <div key={app.id} className="border-l-4 border-blue-500 pl-4 pb-5">
        <p className="text-sm text-gray-500">{app.appliedDate}</p>
        <h2 className="font-bold">
          {app.companyName} - {app.jobRole}
        </h2>
        <p className="text-sm text-gray-600">Status: {app.status}</p>
        {app.followUpDate && (
          <p className="text-sm text-orange-600">
            Follow-up scheduled for {app.followUpDate}
          </p>
        )}
        {app.notes && <p className="text-sm mt-1">{app.notes}</p>}
      </div>
    ))}
  </div>
);

export default AllApplications;
