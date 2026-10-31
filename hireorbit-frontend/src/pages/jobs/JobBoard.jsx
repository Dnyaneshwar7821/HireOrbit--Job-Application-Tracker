import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jobService } from "../../api/jobService";
import api from "../../api/apiService";
import { useAuth } from "../../context/authContextValue";
import { useToast } from "../../context/ToastContext";
import { useTheme } from "../../context/ThemeContext";
import { ui } from "../../styles/ui";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaDollarSign,
  FaBriefcase,
  FaUsers,
  FaBrain,
  FaPaperPlane,
  FaTimes,
  FaFileUpload,
  FaBuilding,
  FaMagic,
} from "react-icons/fa";

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [selectedJob, setSelectedJob] = useState(null);

  // Apply & AI check modal states
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [checkingAi, setCheckingAi] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);

  const { token } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    let isMounted = true;
    const loadJobs = async () => {
      setLoading(true);
      try {
        const res = await jobService.getJobs();
        if (isMounted) setJobs(res.data || []);
      } catch {
        if (isMounted) showError("Failed to load jobs");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadJobs();
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobService.getJobs();
      setJobs(res.data || []);
    } catch {
      showError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (job.title && job.title.toLowerCase().includes(q)) ||
        (job.company && job.company.toLowerCase().includes(q)) ||
        (job.department && job.department.toLowerCase().includes(q)) ||
        (job.requiredSkills && job.requiredSkills.toLowerCase().includes(q));

      const matchesLocation =
        locationFilter === "ALL" ||
        (job.location &&
          job.location.toLowerCase().includes(locationFilter.toLowerCase()));

      const matchesType =
        typeFilter === "ALL" ||
        (job.employmentType &&
          job.employmentType.toLowerCase() === typeFilter.toLowerCase());

      return matchesSearch && matchesLocation && matchesType;
    });
  }, [jobs, search, locationFilter, typeFilter]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/analysis/upload-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResumeText(res.data.text || "");
      showSuccess("Resume parsed successfully!");
    } catch {
      showError("Failed to extract resume text. You can paste it directly.");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleCheckCompatibility = async () => {
    if (!resumeText.trim()) {
      showError("Please paste or upload your resume first");
      return;
    }

    setCheckingAi(true);
    const jobText = `${selectedJob.title}\n${selectedJob.description}\nSkills: ${selectedJob.requiredSkills}`;

    try {
      const res = await api.post("/analysis/resume-match", {
        resume: resumeText,
        job: jobText,
        tone: "Professional",
      });
      setAiResult(res.data);
      showSuccess("Compatibility evaluated!");
    } catch {
      showError("AI evaluation failed. Please try again.");
    } finally {
      setCheckingAi(false);
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!token) {
      showError("Please sign in as a candidate to apply");
      navigate("/login");
      return;
    }

    if (!resumeText.trim()) {
      showError("Please paste or upload your resume");
      return;
    }

    setSubmitting(true);
    try {
      await jobService.applyToJob(selectedJob.id, {
        resumeText,
        coverLetter,
      });
      showSuccess("Application submitted successfully!");
      setShowApplyModal(false);
      setResumeText("");
      setCoverLetter("");
      setAiResult(null);
      fetchJobs();
    } catch (err) {
      showError(err.response?.data?.message || err.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Hero Header */}
      <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-blue-500/20 bg-gradient-to-br from-blue-900/40 via-indigo-950/60 to-slate-950 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <FaMagic className="text-amber-400" /> AI-Powered Verified Job Board
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Discover Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Career Leap</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Apply directly to vetted positions, test your resume compatibility with Gemini AI before applying, and get tracked by hiring managers.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className={`${ui.card} flex flex-col md:flex-row gap-4 items-center justify-between`}>
        <div className="relative flex-1 w-full">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, skill (e.g. React, Spring Boot), or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${ui.input} pl-11`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className={ui.input}
          >
            <option value="ALL">All Locations</option>
            <option value="Remote">Remote</option>
            <option value="New York">New York</option>
            <option value="San Francisco">San Francisco</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={ui.input}
          >
            <option value="ALL">All Employment Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
      </div>

      {/* Jobs Counter */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-400">
        <span>Showing {filteredJobs.length} openings</span>
        {token ? (
          <Link to="/applications" className="text-blue-400 hover:underline">
            View My Applications →
          </Link>
        ) : (
          <Link to="/login" className="text-blue-400 hover:underline">
            Sign in to track applications →
          </Link>
        )}
      </div>

      {/* Job Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-400">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className={ui.emptyState}>
          No jobs found matching your criteria. Try adjusting your search keywords.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => {
            const initial = (job.company || "C").charAt(0).toUpperCase();
            const skills = (job.requiredSkills || "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
              .slice(0, 5);

            return (
              <div
                key={job.id}
                className={`group rounded-3xl border p-6 transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between ${
                  isDark
                    ? "border-slate-800 bg-slate-900/90 text-white hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-950/40"
                    : "border-slate-200 bg-white text-slate-900 hover:border-blue-300 hover:shadow-xl hover:shadow-slate-200/80"
                }`}
                onClick={() => {
                  setSelectedJob(job);
                  setShowApplyModal(true);
                  setAiResult(null);
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="h-12 w-12 grid place-items-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-lg font-black text-white shadow-md shadow-blue-500/20">
                        {initial}
                      </div>
                      <div>
                        <h3 className="text-lg font-black tracking-tight group-hover:text-blue-400 transition">
                          {job.title}
                        </h3>
                        <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                          <FaBuilding className="text-[11px]" /> {job.company}
                          {job.department && <span>• {job.department}</span>}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {job.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    {job.location && (
                      <span className="inline-flex items-center gap-1 text-slate-400">
                        <FaMapMarkerAlt className="text-[11px] text-blue-400" /> {job.location}
                      </span>
                    )}
                    {job.salaryRange && (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                        <FaDollarSign className="text-[11px]" /> {job.salaryRange}
                      </span>
                    )}
                    {job.employmentType && (
                      <span className="inline-flex items-center gap-1 text-slate-400">
                        <FaBriefcase className="text-[11px]" /> {job.employmentType}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-slate-500">
                      <FaUsers className="text-[11px]" /> {job.applicantCount || 0} applied
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {skills.map((skill, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-5 flex items-center justify-between border-t border-slate-800/60 mt-4">
                  <span className="text-[11px] text-slate-500">
                    Posted {job.postedDate || "Recently"}
                  </span>
                  <button className="text-xs font-bold text-blue-400 group-hover:text-blue-300 inline-flex items-center gap-1">
                    Details & Apply →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Job Details & Apply Modal */}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div
            className={`w-full max-w-3xl rounded-3xl border p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative ${
              isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            {/* Close button */}
            <button
              onClick={() => {
                setShowApplyModal(false);
                setAiResult(null);
              }}
              className="absolute top-6 right-6 text-slate-400 hover:text-white text-lg p-2 rounded-xl hover:bg-slate-800 transition"
            >
              <FaTimes />
            </button>

            {/* Modal Header */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {selectedJob.company} • {selectedJob.department || "Engineering"}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black">{selectedJob.title}</h2>
              <div className="flex flex-wrap gap-3 text-xs text-slate-400 pt-1">
                <span>📍 {selectedJob.location}</span>
                <span>💼 {selectedJob.employmentType}</span>
                <span>💰 {selectedJob.salaryRange}</span>
                <span>👥 {selectedJob.applicantCount} applicants</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 text-xs leading-relaxed text-slate-300 border-y border-slate-800 py-4">
              <h4 className="font-bold text-sm text-white">About the Role</h4>
              <p className="whitespace-pre-line">{selectedJob.description}</p>
              {selectedJob.requiredSkills && (
                <div className="pt-2">
                  <h4 className="font-bold text-sm text-white mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.requiredSkills.split(",").map((s, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl text-xs font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20"
                      >
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Resume Input & AI Evaluation Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <FaBrain className="text-blue-400" /> Resume & AI Compatibility Check
                </h4>
                <label className="text-xs font-bold text-blue-400 hover:text-blue-300 cursor-pointer inline-flex items-center gap-1.5">
                  <FaFileUpload /> {uploadingResume ? "Extracting..." : "Upload PDF/DOCX"}
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <textarea
                rows={4}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste or upload your resume text here to evaluate your match score with Gemini AI and submit your application..."
                className={ui.input}
              />

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleCheckCompatibility}
                  disabled={checkingAi}
                  className="px-4 py-2.5 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600/30 font-bold text-xs inline-flex items-center gap-2 transition"
                >
                  <FaBrain /> {checkingAi ? "Analyzing with Gemini..." : "Check My Compatibility Score"}
                </button>
              </div>

              {/* AI Score Feedback Widget */}
              {aiResult && (
                <div className="rounded-2xl border border-purple-500/30 bg-purple-950/30 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300">
                      Gemini Match Evaluation
                    </span>
                    <span className="text-xl font-black text-purple-400">
                      {aiResult.matchScore}% Match
                    </span>
                  </div>

                  {aiResult.matchedSkills?.length > 0 && (
                    <div className="text-xs">
                      <span className="font-bold text-emerald-400">Matched Skills: </span>
                      <span className="text-slate-300">{aiResult.matchedSkills.join(", ")}</span>
                    </div>
                  )}

                  {aiResult.missingSkills?.length > 0 && (
                    <div className="text-xs">
                      <span className="font-bold text-amber-400">Missing Key Skills: </span>
                      <span className="text-slate-300">{aiResult.missingSkills.join(", ")}</span>
                    </div>
                  )}

                  {aiResult.analysis && (
                    <p className="text-xs text-slate-300 italic border-t border-purple-900/50 pt-2">
                      "{aiResult.analysis}"
                    </p>
                  )}
                </div>
              )}

              {/* Cover Letter Input */}
              <div className="space-y-1 pt-2">
                <label className="text-xs font-bold text-slate-400 block">
                  Optional Note / Cover Letter to Recruiter
                </label>
                <textarea
                  rows={2}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Share a brief message about why you're a great fit for this team..."
                  className={ui.input}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setShowApplyModal(false);
                  setAiResult(null);
                }}
                className={ui.buttonSecondary}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitApplication}
                disabled={submitting}
                className={`${ui.buttonPrimary} py-2.5 px-6`}
              >
                <FaPaperPlane className="mr-2" />
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobBoard;
