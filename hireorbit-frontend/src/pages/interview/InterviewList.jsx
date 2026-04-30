import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { interviewService } from "../../api/interviewService";
import { useApplication } from "../../context/ApplicationContext";

const InterviewList = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const { applications, fetchApplications } = useApplication();

  const [interviews, setInterviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editResult, setEditResult] = useState("");

  const currentApp = applications.find((a) => a.id === parseInt(applicationId));

  const fetchInterviews = () => {
    interviewService
      .getInterviews(applicationId)
      .then((res) => setInterviews(res.data))
      .catch(() => alert("Error fetching interviews"));
  };

  useEffect(() => {
    fetchInterviews();
  }, [applicationId]);

  const startEdit = (int) => {
    setEditingId(int.id);
    setEditResult(int.result);
  };

  const saveEdit = async (id) => {
    try {
      await interviewService.updateInterview(id, {
        result: editResult,
      });

      setEditingId(null);

      fetchInterviews();
      await fetchApplications();
    } catch {
      alert("Update failed");
    }
  };

  return (
    <div className="p-4">
      {/* HEADER WITH COMPANY NAME */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold">
          {currentApp
            ? `${currentApp.companyName} - Interview Rounds`
            : "Interview Rounds"}
        </h1>

        {currentApp && (
          <p className="text-gray-500 text-sm">Role: {currentApp.jobRole}</p>
        )}
      </div>

      {/* ACTION BAR */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate("/applications")}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          ← Back
        </button>

        <button
          onClick={() => navigate(`/interviews/add/${applicationId}`)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Interview
        </button>
      </div>

      {/* LIST */}
      {interviews.length === 0 ? (
        <p className="text-gray-500">No interviews found</p>
      ) : (
        <div className="grid gap-4">
          {interviews.map((int) => (
            <div key={int.id} className="bg-white p-4 rounded shadow">
              <h2 className="font-semibold">{int.roundName}</h2>

              {editingId === int.id ? (
                <>
                  <select
                    value={editResult}
                    onChange={(e) => setEditResult(e.target.value)}
                    className="border p-2 mt-2"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PASS">PASS</option>
                    <option value="FAIL">FAIL</option>
                  </select>

                  <button
                    onClick={() => saveEdit(int.id)}
                    className="ml-2 bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <p className="text-gray-600">{int.result}</p>

                  <button
                    onClick={() => startEdit(int)}
                    className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                </>
              )}

              <p className="text-sm text-blue-600 mt-2">{int.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewList;
