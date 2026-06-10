import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../api/authService";
import { useApplication } from "../../context/applicationContextValue";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const { fetchApplications } = useApplication();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      localStorage.clear();

      const loginRes = await authService.login(form);
      localStorage.setItem("token", loginRes.data.token);

      const profileRes = await authService.getProfile();
      localStorage.setItem("user", JSON.stringify(profileRes.data));

      await fetchApplications();

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full mb-3 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />

        {/* Password with toggle */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full"
        >
          Login
        </button>

        <p className="text-sm text-center mt-3">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
