import { Link, NavLink, useNavigate } from "react-router-dom";
import { useApplication } from "../../context/applicationContextValue";
import { useAuth } from "../../context/authContextValue";
import { FaChartPie, FaBriefcase, FaBrain, FaUser, FaSignOutAlt, FaShieldAlt } from "react-icons/fa";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: FaChartPie },
  { to: "/applications", label: "Applications", icon: FaBriefcase },
  { to: "/resume-match", label: "Resume Analyzer", icon: FaBrain },
  { to: "/profile", label: "Profile", icon: FaUser },
];

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { clearApplications } = useApplication();
  const { isAdmin } = useAuth();

  const handleLogout = () => {
    localStorage.clear();
    clearApplications();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to={token ? "/dashboard" : "/"} className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-lg font-black text-white shadow-lg shadow-blue-500/20">
            H
          </span>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
              HireOrbit
              <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                PRO
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">Career Command Center</p>
          </div>
        </Link>

        {token && (
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold text-xs transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                      }`
                    }
                  >
                    <Icon className="text-xs" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 px-3.5 py-2 text-xs font-bold transition border border-purple-800/80 shadow-md shadow-purple-900/20"
              >
                <FaShieldAlt className="text-xs" />
                <span className="hidden sm:inline">Admin Panel</span>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-red-950/50 hover:border-red-800 hover:text-red-400 px-3.5 py-2 text-xs font-bold text-slate-300 transition"
              title="Sign Out"
            >
              <FaSignOutAlt className="text-xs" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </nav>

      {/* Mobile Nav Links Row */}
      {token && (
        <div className="flex md:hidden overflow-x-auto justify-around border-t border-slate-800/80 bg-slate-950 px-2 py-2 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`
                }
              >
                <Icon className="text-xs" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Navbar;
