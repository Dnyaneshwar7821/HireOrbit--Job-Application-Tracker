import api from "./apiService";

export const jobService = {
  // Public / Candidate
  getJobs: (params) => api.get("/api/jobs", { params }),
  getJobById: (id) => api.get(`/api/jobs/${id}`),
  applyToJob: (id, data) => api.post(`/api/jobs/${id}/apply`, data),

  // Admin
  getAdminJobs: () => api.get("/api/jobs/admin/all"),
  createJob: (data) => api.post("/api/jobs", data),
  updateJob: (id, data) => api.put(`/api/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/api/jobs/${id}`),
  getJobApplicants: (jobId) => api.get(`/api/jobs/${jobId}/applicants`),
  updateApplicantStatus: (appId, status) =>
    api.put(`/api/jobs/applications/${appId}/status`, { status }),
  rankApplicantsWithAI: (jobId) =>
    api.post(`/api/jobs/${jobId}/rank-applicants`),
};

