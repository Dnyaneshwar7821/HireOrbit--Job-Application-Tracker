import { Link, useNavigate } from "react-router-dom";
import { useApplication } from "../../context/applicationContextValue";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { clearApplications } = useApplication();

  const handleLogout = () => {
    localStorage.clear();

    clearApplications();

    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold text-white">HireOrbit</h1>

      {token && (
        <div className="flex items-center gap-6 text-sm">
          <Link to="/dashboard" className="text-white hover:underline">
            Dashboard
          </Link>

          <Link to="/applications" className="text-white hover:underline">
            Applications
          </Link>

          <Link to="/resume-match" className="hover:underline font-semibold">
            Resume Analyzer
          </Link>

          <Link to="/profile" className="text-white hover:underline">
            Profile
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
