import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jobService } from "../../api/jobService";
import { useToast } from "../../context/ToastContext";
import { useTheme } from "../../context/ThemeContext";
import { ui } from "../../styles/ui";
import {
  FaArrowLeft,
  FaBrain,
  FaFileAlt,
  FaCalendarPlus,
  FaMagic,
  FaTimes,
} from "react-icons/fa";

const STATUS_OPTIONS = ["APPLIED", "SHORTLISTED", "INTERVIEW", "OFFER", "REJECTED"];

const AdminJobApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rankingAi, setRankingAi] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const { showSuccess, showError } = useToast();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [jobRes, applicantsRes] = await Promise.all([
          jobService.getJobById(jobId),
          jobService.getJobApplicants(jobId),
        ]);
        if (isMounted) {
          setJob(jobRes.data);
          setApplicants(applicantsRes.data || []);
        }
      } catch {
        if (isMounted) showError("Failed to load applicants");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [jobId]);

  const handleRankWithAI = async () => {
    setRankingAi(true);
    try {
      const res = await jobService.rankApplicantsWithAI(jobId);
      setApplicants(res.data || []);
      showSuccess("Gemini AI evaluated and ranked all applicants!");
    } catch {
      showError("Failed to run AI ranking");
    } finally {
      setRankingAi(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await jobService.updateApplicantStatus(appId, newStatus);
      setApplicants((prev) =>
        prev.map((a) => (a.applicationId === appId ? { ...a, status: newStatus } : a))
      );
      showSuccess(`Status updated to ${newStatus}`);
    } catch {
      showError("Failed to update status");
    }
  };

  const filteredApplicants = useMemo(() => {
    if (statusFilter === "ALL") return applicants;
    return applicants.filter((a) => a.status === statusFilter);
  }, [applicants, statusFilter]);

  const topScore = useMemo(() => {
    if (applicants.length === 0) return 0;
    return Math.max(...applicants.map((a) => a.aiMatchScore || 0));
  }, [applicants]);

  const avgScore = useMemo(() => {
    if (applicants.length === 0) return 0;
    const sum = applicants.reduce((acc, a) => acc + (a.aiMatchScore || 0), 0);
    return Math.round(sum / applicants.length);
  }, [applicants]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Navigation */}
      <button
        onClick={() => navigate("/admin/jobs")}
        className={`${ui.buttonSecondary} inline-flex items-center gap-2`}
      >
        <FaArrowLeft /> Back to Jobs
      </button>

      {/* Header Banner */}
      <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            ATS Candidate Screening Board
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            {job?.title || "Job Applicants"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {job?.company} • {job?.location} • {job?.employmentType}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={handleRankWithAI}
            disabled={rankingAi || applicants.length === 0}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-xs shadow-lg shadow-purple-600/30 inline-flex items-center gap-2 transition cursor-pointer"
          >
            <FaMagic className="text-amber-300 animate-pulse" />
            {rankingAi ? "Gemini Screening in Progress..." : "Auto-Rank with Gemini AI"}
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`${ui.card} text-center space-y-1`}>
          <span className="text-xs font-bold text-slate-400">Total Applicants</span>
          <p className="text-3xl font-black text-white">{applicants.length}</p>
        </div>
        <div className={`${ui.card} text-center space-y-1`}>
          <span className="text-xs font-bold text-slate-400">Top Candidate Score</span>
          <p className="text-3xl font-black text-emerald-400">{topScore}%</p>
        </div>
        <div className={`${ui.card} text-center space-y-1`}>
          <span className="text-xs font-bold text-slate-400">Average Match Score</span>
          <p className="text-3xl font-black text-blue-400">{avgScore}%</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setStatusFilter("ALL")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
            statusFilter === "ALL"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          All ({applicants.length})
        </button>
        {STATUS_OPTIONS.map((status) => {
          const count = applicants.filter((a) => a.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                statusFilter === status
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {status} ({count})
            </button>
          );
        })}
      </div>

      {/* Applicants Leaderboard */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-400">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : filteredApplicants.length === 0 ? (
        <div className={ui.emptyState}>
          No candidates found in this status.
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredApplicants.map((applicant, idx) => {
            const score = applicant.aiMatchScore || 0;
            const scoreColor =
              score >= 80
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : score >= 60
                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                : "bg-slate-800 text-slate-400 border-slate-700";

            return (
              <div
                key={applicant.applicationId}
                className={`rounded-2xl border p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isDark
                    ? "border-slate-800 bg-slate-900/90 text-white"
                    : "border-slate-200 bg-white text-slate-900"
                }`}
              >
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  {/* Rank Badge */}
                  <div className="h-10 w-10 grid place-items-center rounded-xl bg-slate-800 text-slate-300 font-black text-sm flex-shrink-0">
                    #{idx + 1}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-extrabold text-base tracking-tight truncate">
                        {applicant.candidateName}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${scoreColor}`}>
                        <FaBrain className="inline mr-1 text-[10px]" />
                        {score}% Match
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      <span>✉️ {applicant.candidateEmail}</span>
                      <span>• Applied {applicant.appliedDate}</span>
                    </p>
                  </div>
                </div>

                {/* Right Side: Stage Picker & Details Modal */}
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={applicant.status}
                    onChange={(e) =>
                      handleStatusChange(applicant.applicationId, e.target.value)
                    }
                    className="text-xs font-bold py-1.5 px-3 rounded-xl bg-slate-800 border border-slate-700 text-white cursor-pointer"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        Stage: {st}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setSelectedApplicant(applicant)}
                    className={`${ui.buttonSecondary} py-1.5 px-3 text-xs inline-flex items-center gap-1.5`}
                  >
                    <FaFileAlt /> View Resume & Notes
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/interviews/add/${applicant.applicationId}`)
                    }
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold inline-flex items-center gap-1.5 transition"
                  >
                    <FaCalendarPlus /> Schedule Round
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Applicant Resume & Details Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div
            className={`w-full max-w-3xl rounded-3xl border p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative ${
              isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <button
              onClick={() => setSelectedApplicant(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white text-lg p-2 rounded-xl hover:bg-slate-800 transition"
            >
              <FaTimes />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold text-blue-400">Candidate Profile</span>
              <h2 className="text-2xl font-black">{selectedApplicant.candidateName}</h2>
              <p className="text-xs text-slate-400">{selectedApplicant.candidateEmail}</p>
            </div>

            {selectedApplicant.coverLetter && (
              <div className="rounded-2xl border border-blue-500/20 bg-blue-950/20 p-4 space-y-1">
                <h4 className="text-xs font-bold text-blue-300">Candidate Note / Cover Letter</h4>
                <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                  {selectedApplicant.coverLetter}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Extracted Resume Text
              </h4>
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 max-h-96 overflow-y-auto text-xs text-slate-300 whitespace-pre-line font-mono leading-relaxed">
                {selectedApplicant.resumeText || "No resume text provided."}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                onClick={() => setSelectedApplicant(null)}
                className={ui.buttonPrimary}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobApplicants;
