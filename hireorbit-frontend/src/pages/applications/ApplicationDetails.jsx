import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApplication } from "../../context/ApplicationContext";

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { applications } = useApplication();

  const [application, setApplication] = useState(null);

  useEffect(() => {
    const app = applications.find((a) => a.id === parseInt(id));
    if (app) setApplication(app);
  }, [id, applications]);

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
