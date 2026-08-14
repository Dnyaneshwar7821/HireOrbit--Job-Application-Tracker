import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminService } from "../../api/adminService";
import { useAuth } from "../../context/authContextValue";

import { useToast } from "../../context/ToastContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await adminService.adminLogin(email, password);
      login(res.data.token);
      showSuccess("Welcome, Administrator!");
      navigate("/admin/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Admin login failed";
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail("admin@hireorbit.com");
    setPassword("Admin@123");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-white">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 mb-4 border border-indigo-500/30 text-2xl font-bold">
            👑
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            HireOrbit Admin Portal
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Sign in with administrator credentials
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@hireorbit.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Admin Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-2.5 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition disabled:opacity-50"
          >
            {loading ? "Authenticating Admin..." : "Sign In to Admin Panel"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800 text-center space-y-3">
          <button
            onClick={fillDemoAdmin}
            className="w-full bg-slate-800 hover:bg-slate-700 text-xs text-indigo-300 font-semibold py-2 px-3 rounded-lg border border-slate-700 transition"
          >
            ⚡ Auto-Fill Demo Admin Credentials
          </button>

          <div className="text-xs text-slate-500">
            Looking for job seeker portal?{" "}
            <Link to="/login" className="text-indigo-400 hover:underline">
              User Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
