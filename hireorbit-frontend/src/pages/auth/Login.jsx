import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../api/authService";
import { useApplication } from "../../context/applicationContextValue";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ui } from "../../styles/ui";

const Login = () => {
  const navigate = useNavigate();
  const { fetchApplications } = useApplication();

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
      localStorage.setItem("token", loginRes.data.token);

      const profileRes = await authService.getProfile();
      localStorage.setItem("user", JSON.stringify(profileRes.data));

      navigate("/dashboard");
      fetchApplications();
    } catch (error) {
      alert(error.response?.data || error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-xl"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-lg bg-blue-600 text-xl font-bold text-white">
            H
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">
            Welcome back
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Login to continue tracking your job search.
          </p>
        </div>

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          onChange={handleChange}
          className={`${ui.input} mb-4`}
          required
        />

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Password
        </label>
        <div className="relative mb-5">
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-900"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button type="submit" disabled={loading} className={`${ui.buttonPrimary} w-full`}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-5 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
