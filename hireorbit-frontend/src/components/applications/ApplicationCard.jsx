import { useNavigate } from "react-router-dom";
import { ui } from "../../styles/ui";

const ApplicationCard = ({ app, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`${ui.card} flex justify-between items-center hover:shadow-lg transition`}
    >
      {/* LEFT */}
      <div>
        <h2 className="font-bold text-lg">{app.companyName || "N/A"}</h2>
        <p className="text-gray-600">{app.jobRole || "N/A"}</p>

        <span
          className={`text-xs px-2 py-1 rounded ${
            ui.badge[app.status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {app.status}
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/applications/${app.id}`)}
          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition"
        >
          View
        </button>

        <button
          onClick={() => navigate(`/interviews/${app.id}`)}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
        >
          Interviews
        </button>

        <button
          onClick={() => onDelete(app.id)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;
