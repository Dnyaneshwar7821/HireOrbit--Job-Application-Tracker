import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../api/authService";
import { ui } from "../../styles/ui";
import { useToast } from "../../context/ToastContext";

const Register = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

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
    <div className="grid min-h-screen place-items-center px-4 py-10 bg-slate-950 font-sans text-slate-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl space-y-4"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-xl font-black text-white shadow-lg shadow-blue-500/20">
            H
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Create your account
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Start organizing your job search in one place.
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
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
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
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
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
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
          <p className="mt-1 text-[11px] text-slate-500 leading-tight">
            Must be 8+ chars with uppercase, lowercase, number and special char.
          </p>
        </div>

        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300 font-semibold">
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

        <div className="pt-3 border-t border-slate-800/80 text-center text-xs text-slate-400">
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-blue-400 hover:text-blue-300 transition"
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
