import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jobService } from "../../api/jobService";
import { useToast } from "../../context/ToastContext";
import { useTheme } from "../../context/ThemeContext";
import { ui } from "../../styles/ui";
import {
  FaPlus,
  FaBriefcase,
  FaUsers,
  FaTrash,
  FaEdit,
  FaTimes,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const [form, setForm] = useState({
    title: "",
    company: "CloudScale Tech",
    department: "Engineering",
    location: "Remote",
    employmentType: "Full-time",
    salaryRange: "$130,000 - $160,000",
    description: "",
    requiredSkills: "React, TypeScript, Java, Spring Boot, MySQL",
    status: "ACTIVE",
  });

  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    let isMounted = true;
    const loadJobs = async () => {
      setLoading(true);
      try {
        const res = await jobService.getAdminJobs();
        if (isMounted) setJobs(res.data || []);
      } catch {
        if (isMounted) showError("Failed to fetch jobs");
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
      const res = await jobService.getAdminJobs();
      setJobs(res.data || []);
    } catch {
      showError("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.company) {
      showError("Title and Company are required");
      return;
    }

    try {
      if (editingJob) {
        await jobService.updateJob(editingJob.id, form);
        showSuccess("Job updated successfully!");
      } else {
        await jobService.createJob(form);
        showSuccess("New job posted successfully!");
      }
      setShowCreateModal(false);
      setEditingJob(null);
      resetForm();
      fetchJobs();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to save job");
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      company: "CloudScale Tech",
      department: "Engineering",
      location: "Remote",
      employmentType: "Full-time",
      salaryRange: "$130,000 - $160,000",
      description: "",
      requiredSkills: "React, TypeScript, Java, Spring Boot, MySQL",
      status: "ACTIVE",
    });
  };

  const handleEditClick = (job) => {
    setEditingJob(job);
    setForm({
      title: job.title || "",
      company: job.company || "",
      department: job.department || "",
      location: job.location || "",
      employmentType: job.employmentType || "Full-time",
      salaryRange: job.salaryRange || "",
      description: job.description || "",
      requiredSkills: job.requiredSkills || "",
      status: job.status || "ACTIVE",
    });
    setShowCreateModal(true);
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job posting? All applicants for this job will also be removed.")) {
      return;
    }

    try {
      await jobService.deleteJob(id);
      showSuccess("Job deleted successfully");
      fetchJobs();
    } catch {
      showError("Failed to delete job");
    }
  };

  const toggleStatus = async (job) => {
    const newStatus = job.status === "ACTIVE" ? "CLOSED" : "ACTIVE";
    try {
      await jobService.updateJob(job.id, { ...job, status: newStatus });
      showSuccess(`Job marked as ${newStatus}`);
      fetchJobs();
    } catch {
      showError("Failed to update status");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <FaBriefcase className="text-blue-400" /> Job Postings & ATS Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Publish open roles, monitor incoming applications, and evaluate candidates with Gemini AI.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setEditingJob(null);
            setShowCreateModal(true);
          }}
          className={`${ui.buttonPrimary} py-2.5 px-4 inline-flex items-center gap-2`}
        >
          <FaPlus /> Post New Job
        </button>
      </div>

      {/* Jobs Table */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-400">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : jobs.length === 0 ? (
        <div className={ui.emptyState}>
          No job openings posted yet. Click "+ Post New Job" to create your first posting.
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className={`rounded-2xl border p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isDark
                  ? "border-slate-800 bg-slate-900/90 text-white"
                  : "border-slate-200 bg-white text-slate-900"
              }`}
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-black tracking-tight truncate">
                    {job.title}
                  </h3>
                  <button
                    onClick={() => toggleStatus(job)}
                    className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-extrabold border cursor-pointer transition ${
                      job.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    {job.status === "ACTIVE" ? <FaToggleOn className="text-emerald-400" /> : <FaToggleOff />}
                    {job.status}
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span>🏢 {job.company}</span>
                  {job.department && <span>• {job.department}</span>}
                  <span>📍 {job.location}</span>
                  <span>💼 {job.employmentType}</span>
                  {job.salaryRange && <span className="text-emerald-400 font-bold">💰 {job.salaryRange}</span>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <button
                  onClick={() => navigate(`/admin/jobs/${job.id}/applicants`)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 inline-flex items-center gap-1.5 cursor-pointer transition"
                >
                  <FaUsers /> Review Applicants ({job.applicantCount || 0})
                </button>

                <button
                  onClick={() => handleEditClick(job)}
                  className={ui.buttonSecondary}
                  title="Edit Job"
                >
                  <FaEdit />
                </button>

                <button
                  onClick={() => handleDeleteJob(job.id)}
                  className="p-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs transition cursor-pointer"
                  title="Delete Job"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post/Edit Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div
            className={`w-full max-w-2xl rounded-3xl border p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl relative ${
              isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <button
              onClick={() => {
                setShowCreateModal(false);
                setEditingJob(null);
              }}
              className="absolute top-6 right-6 text-slate-400 hover:text-white text-lg p-2 rounded-xl hover:bg-slate-800 transition"
            >
              <FaTimes />
            </button>

            <h2 className="text-2xl font-black">
              {editingJob ? "Edit Job Posting" : "Post a New Job Opening"}
            </h2>

            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Senior Full Stack Developer"
                    className={ui.input}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="e.g. TechCorp Solutions"
                    className={ui.input}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    placeholder="e.g. Engineering"
                    className={ui.input}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Remote / New York, NY"
                    className={ui.input}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    Employment Type
                  </label>
                  <select
                    name="employmentType"
                    value={form.employmentType}
                    onChange={handleChange}
                    className={ui.input}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">
                  Salary Range
                </label>
                <input
                  type="text"
                  name="salaryRange"
                  value={form.salaryRange}
                  onChange={handleChange}
                  placeholder="e.g. $130,000 - $160,000"
                  className={ui.input}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">
                  Required Skills (Comma-separated)
                </label>
                <input
                  type="text"
                  name="requiredSkills"
                  value={form.requiredSkills}
                  onChange={handleChange}
                  placeholder="e.g. React, TypeScript, Java, Spring Boot, MySQL, Docker"
                  className={ui.input}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">
                  Job Description & Responsibilities
                </label>
                <textarea
                  rows={4}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the role, day-to-day responsibilities, and qualifications..."
                  className={ui.input}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className={ui.buttonSecondary}
                >
                  Cancel
                </button>
                <button type="submit" className={`${ui.buttonPrimary} py-2.5 px-6`}>
                  {editingJob ? "Save Changes" : "Publish Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobs;
