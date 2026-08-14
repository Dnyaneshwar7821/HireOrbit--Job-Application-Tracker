import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { interviewService } from "../../api/interviewService";
import { useApplication } from "../../context/applicationContextValue";
import { useToast } from "../../context/ToastContext";
import { useTheme } from "../../context/ThemeContext";
import { ui } from "../../styles/ui";

const InterviewList = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { applications, fetchApplications } = useApplication();
  const { showSuccess, showError } = useToast();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const [interviews, setInterviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editResult, setEditResult] = useState("");

  const currentApp = applications.find((a) => a.id === parseInt(applicationId));

  const fetchInterviews = useCallback(() => {
    interviewService
      .getInterviews(applicationId)
      .then((res) => setInterviews(res.data))
      .catch(() => showError("Error fetching interviews"));
  }, [applicationId, showError]);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

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
      showSuccess("Interview result updated!");
    } catch {
      showError("Update failed");
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6 font-sans">
      {/* HEADER WITH COMPANY NAME */}
      <div>
        <h1 className={`text-2xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
          {currentApp
            ? `${currentApp.companyName} — Interview Rounds`
            : "Interview Rounds"}
        </h1>

        {currentApp && (
          <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Target Role: <span className="font-semibold text-blue-400">{currentApp.jobRole}</span>
          </p>
        )}
      </div>

      {/* ACTION BAR */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate("/applications")}
          className={ui.buttonSecondary}
        >
          ← Back to Applications
        </button>

        <button
          onClick={() => navigate(`/interviews/add/${applicationId}`)}
          className={ui.buttonPrimary}
        >
          + Add Interview Round
        </button>
      </div>

      {/* LIST */}
      {interviews.length === 0 ? (
        <div className={ui.emptyState}>
          No interview rounds added for this application yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {interviews.map((int) => (
            <div
              key={int.id}
              className={`p-5 rounded-2xl border transition shadow-xl ${
                isDark
                  ? "bg-slate-900/90 border-slate-800 text-white"
                  : "bg-white border-slate-200 text-slate-900 shadow-slate-200/50"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-bold text-lg">{int.roundName}</h2>
                  <p className="text-xs text-blue-400 font-semibold mt-1">Date: {int.date}</p>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-extrabold border ${
                    int.result === "PASS"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : int.result === "FAIL"
                      ? "bg-red-500/10 text-red-400 border-red-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}
                >
                  {int.result}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                {editingId === int.id ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={editResult}
                      onChange={(e) => setEditResult(e.target.value)}
                      className={ui.input}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PASS">PASS</option>
                      <option value="FAIL">FAIL</option>
                    </select>

                    <button
                      onClick={() => saveEdit(int.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEdit(int)}
                    className={ui.buttonSecondary}
                  >
                    Edit Status
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewList;
