import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../api/authService";
import { ui } from "../../styles/ui";

const Register = () => {
  const navigate = useNavigate();

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
      setError(
        "Password must be 8+ chars with uppercase, lowercase, number and special character",
      );
      return;
    }

    setLoading(true);
    authService
      .register(form)
      .then((res) => {
        alert(res.data.message);
        navigate("/login");
      })
      .catch((error) => {
        setError(error.response?.data || error.message || "Registration failed");
      })
      .finally(() => {
        setLoading(false);
      });
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
            Create your account
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Start organizing your job search in one place.
          </p>
        </div>

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Name
        </label>
        <input
          type="text"
          name="name"
          placeholder="Your name"
          onChange={handleChange}
          className={`${ui.input} mb-4`}
          required
        />

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
        <input
          type="password"
          name="password"
          placeholder="Create a strong password"
          onChange={handleChange}
          className={`${ui.input} mb-2`}
          required
        />

        <p className="mb-3 text-xs leading-5 text-slate-500">
          Must be 8+ chars with uppercase, lowercase, number and special char.
        </p>

        {error && (
          <p className="mb-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className={`${ui.buttonPrimary} w-full`}>
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
