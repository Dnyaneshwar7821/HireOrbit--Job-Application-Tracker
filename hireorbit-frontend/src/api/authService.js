import api from "./apiService";

export const authService = {
  register: (data) => api.post("/api/auth/register", data),

  login: (data) => api.post("/api/auth/login", data),

  getProfile: () => api.get("/api/auth/profile"),

  deleteAccount: (password) =>
    api.delete("/users/delete-account", {
      data: { password },
      headers: {
        "Content-Type": "application/json",
      },
    }),
};
