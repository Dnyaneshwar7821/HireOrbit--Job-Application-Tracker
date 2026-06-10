import { useParams, useNavigate } from "react-router-dom";
import { useApplication } from "../../context/applicationContextValue";

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { applications } = useApplication();

  const application = applications.find((app) => app.id === Number(id));

  if (!application) {
    return <p className="p-4 text-gray-500">Loading...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Application Details</h1>

      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">
        <p>
          <b>Company:</b> {application.companyName}
        </p>
        <p>
          <b>Role:</b> {application.jobRole}
        </p>
        <p>
          <b>Status:</b> {application.status}
        </p>
        <p>
          <b>Date:</b> {application.appliedDate}
        </p>
        <p>
          <b>Location:</b> {application.location || "N/A"}
        </p>
        <p>
          <b>Salary:</b> {application.salaryRange || "N/A"}
        </p>
        <p>
          <b>Source:</b> {application.source || "N/A"}
        </p>
        <p>
          <b>Employment Type:</b> {application.employmentType || "N/A"}
        </p>
        <p>
          <b>Follow-up:</b> {application.followUpDate || "Not set"}
        </p>
        {application.jobUrl && (
          <p>
            <b>Job Link:</b>{" "}
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              Open posting
            </a>
          </p>
        )}
        <p className="mt-3 whitespace-pre-wrap">
          <b>Notes:</b> {application.notes || "No notes yet"}
        </p>

        <button
          onClick={() => navigate(`/interviews/${application.id}`)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          View Interviews
        </button>
      </div>
    </div>
  );
};

export default ApplicationDetails;
