import api from "./apiService";

export const interviewService = {
  addInterview: (applicationId, data) =>
    api.post(`/interviews/add-interview/${applicationId}`, data),

  getInterviews: (applicationId) =>
    api.get(`/interviews/get-interviews/${applicationId}`),

  updateInterview: (id, data) =>
    api.put(`/interviews/update-interview/${id}`, data),
};