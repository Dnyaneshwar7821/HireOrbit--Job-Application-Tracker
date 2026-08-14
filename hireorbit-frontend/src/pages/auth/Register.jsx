import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../api/authService";
import { ui } from "../../styles/ui";
import { useToast } from "../../context/ToastContext";
import { useTheme } from "../../context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validatePassword(form.password)) {
      const msg =
        "Password must be 8+ chars with uppercase, lowercase, number and special character";
      setError(msg);
      showError(msg);
      return;
    }

    setLoading(true);
    authService
      .register(form)
      .then((res) => {
        showSuccess(res.data?.message || "Account registered successfully!");
        navigate("/login");
      })
      .catch((error) => {
        const msg =
          error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "Registration failed";
        setError(msg);
        showError(msg);
      })
      .finally(() => {
        setLoading(false);
      });
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
        className={`w-full max-w-md rounded-3xl border p-8 shadow-2xl backdrop-blur-xl space-y-4 transition-colors duration-200 ${
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
            Create your account
          </h2>
          <p className={`mt-1 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Start organizing your job search in one place.
          </p>
        </div>

        <div>
          <label className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}>
            Full Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Your name"
            onChange={handleChange}
            className={ui.input}
            required
          />
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
          <input
            type="password"
            name="password"
            placeholder="Create a strong password"
            onChange={handleChange}
            className={ui.input}
            required
          />
          <p className={`mt-1 text-[11px] leading-tight ${isDark ? "text-slate-500" : "text-slate-400"}`}>
            Must be 8+ chars with uppercase, lowercase, number and special char.
          </p>
        </div>

        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 font-semibold">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`${ui.buttonPrimary} w-full py-3.5`}
        >
          {loading ? "Creating account..." : "Register Account"}
        </button>

        <div className={`pt-3 border-t text-center text-xs ${
          isDark ? "border-slate-800/80 text-slate-400" : "border-slate-200 text-slate-500"
        }`}>
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-blue-500 hover:underline transition"
            >
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
