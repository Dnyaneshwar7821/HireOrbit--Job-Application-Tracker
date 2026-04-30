import api from "./apiService";

export const applicationService = {
  addJob: (data) => api.post(`/applications/apply-job`, data),

  getAllJobs: () => api.get(`/applications/get-all-jobs`),

  updateJob: (id, data) => api.put(`/applications/update-job/${id}`, data),

  deleteJob: (id) => api.delete(`/applications/delete-job/${id}`),

  getDashboardStats: () => api.get(`/dashboard/stats`),
};