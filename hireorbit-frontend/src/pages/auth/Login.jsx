import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../api/authService";
import { useApplication } from "../../context/applicationContextValue";
import { FaEye, FaEyeSlash, FaSun, FaMoon } from "react-icons/fa";
import { ui } from "../../styles/ui";
import { useAuth } from "../../context/authContextValue";
import { useToast } from "../../context/ToastContext";
import { useTheme } from "../../context/ThemeContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { fetchApplications } = useApplication();
  const { showSuccess, showError } = useToast();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      localStorage.clear();

      const loginRes = await authService.login(form);
      login(loginRes.data.token);

      const profileRes = await authService.getProfile();
      localStorage.setItem("user", JSON.stringify(profileRes.data));

      showSuccess("Welcome back!");
      navigate("/dashboard");
      fetchApplications();
    } catch (error) {
      showError(
        error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "Login failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative grid min-h-screen place-items-center px-4 py-10 font-sans transition-colors duration-200 ${
      isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    }`}>
      {/* Floating Theme Toggle Switcher */}
      <button
        onClick={toggleTheme}
        className={`absolute top-6 right-6 flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition shadow-md ${
          isDark
            ? "border-slate-800 bg-slate-900 text-amber-400 hover:bg-slate-800"
            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
        }`}
        title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
      >
        {isDark ? <FaSun className="text-amber-400" /> : <FaMoon className="text-indigo-600" />}
        <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
      </button>

      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-md rounded-3xl border p-8 shadow-2xl backdrop-blur-xl space-y-5 transition-colors duration-200 ${
          isDark
            ? "border-slate-800 bg-slate-900/90 text-white"
            : "border-slate-200 bg-white text-slate-900 shadow-slate-200/60"
        }`}
      >
        <div className="text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-xl font-black text-white shadow-lg shadow-blue-500/20">
            H
          </div>
          <h2 className={`text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Welcome back
          </h2>
          <p className={`mt-1 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Login to access your job applications and AI tools.
          </p>
        </div>

        <div>
          <label className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}>
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            onChange={handleChange}
            className={ui.input}
            required
          />
        </div>

        <div>
          <label className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}>
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              className={`${ui.input} pr-10`}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition ${
                isDark ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-slate-700"
              }`}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`${ui.buttonPrimary} w-full py-3.5`}
        >
          {loading ? "Signing in..." : "Login to Dashboard"}
        </button>

        <div className={`pt-3 border-t text-center space-y-2 text-xs ${
          isDark ? "border-slate-800/80 text-slate-400" : "border-slate-200 text-slate-500"
        }`}>
          <p>
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-blue-500 hover:underline transition"
            >
              Create Account
            </Link>
          </p>
          <p>
            Are you an Administrator?{" "}
            <Link
              to="/admin/login"
              className="font-bold text-indigo-500 hover:underline transition"
            >
              👑 Admin Portal Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
