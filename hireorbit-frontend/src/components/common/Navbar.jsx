import { Link, NavLink, useNavigate } from "react-router-dom";
import { useApplication } from "../../context/applicationContextValue";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/applications", label: "Applications" },
  { to: "/resume-match", label: "Resume Analyzer" },
  { to: "/profile", label: "Profile" },
];

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
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <Link to={token ? "/dashboard" : "/"} className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-600 text-lg font-bold text-white shadow-sm">
            H
          </span>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-950">
              HireOrbit
            </h1>
            <p className="text-xs text-slate-500">Job application tracker</p>
          </div>
        </Link>

        {token && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 font-medium transition ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
