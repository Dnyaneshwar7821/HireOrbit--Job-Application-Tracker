import api from "./apiService";

export const adminService = {
  getStats: () => api.get("/api/admin/stats"),
  getUsers: () => api.get("/api/admin/users"),
  updateUserRole: (id, role) => api.put(`/api/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),
  adminLogin: (email, password) => api.post("/api/auth/admin-login", { email, password }),
};
