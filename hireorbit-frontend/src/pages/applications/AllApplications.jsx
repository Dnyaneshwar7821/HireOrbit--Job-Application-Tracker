import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationCard from "../../components/applications/ApplicationCard";
import { useApplication } from "../../context/ApplicationContext";
import { ui } from "../../styles/ui";

const AllApplications = () => {
  const { applications, deleteApplication } = useApplication();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const navigate = useNavigate();

  const handleDelete = (id) => {
    deleteApplication(id)
      .then(() => alert("Deleted successfully"))
      .catch(() => alert("Delete failed"));
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = (app.companyName || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus = statusFilter ? app.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Applications</h1>

        <button
          onClick={() => navigate("/applications/add")}
          className={ui.buttonPrimary}
        >
          + Add Application
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by company..."
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
          <option value="APPLIED">APPLIED</option>
          <option value="INTERVIEW">INTERVIEW</option>
          <option value="OFFER">OFFER</option>
          <option value="REJECTED">REJECTED</option>
        </select>

        {/* CLEAR BUTTON (kept as secondary style) */}
        <button
          onClick={() => {
            setSearch("");
            setStatusFilter("");
          }}
          className={ui.buttonSecondary}
        >
          Clear
        </button>
      </div>

      {/* EMPTY STATES */}
      {applications.length === 0 ? (
        <div className={ui.emptyState}>
          No applications yet. Start by adding one 🚀
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className={ui.emptyState}>No matching applications found</div>
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

export default AllApplications;
