import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../api/authService";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  // Password validation
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

    // Validate before API call
    if (!validatePassword(form.password)) {
      setError(
        "Password must be 8+ chars with uppercase, lowercase, number & special character",
      );
      return;
    }

    authService
      .register(form)
      .then((res) => {
        alert(res.data.message);
        navigate("/login");
      })
      .catch((error) => {
        setError(error.response?.data || "Registration failed");
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full mb-3 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full mb-3 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-3 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />

        {/* Password hint */}
        <p className="text-xs text-gray-500 mb-2">
          Must be 8+ chars, include uppercase, lowercase, number & special char
        </p>

        {/* Error message */}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full"
        >
          Register
        </button>

        <p className="text-sm text-center mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
