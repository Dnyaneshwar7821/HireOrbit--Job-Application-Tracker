import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContextValue";
import { FaChartBar, FaBriefcase, FaExternalLinkAlt } from "react-icons/fa";

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">👑</span>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight">
                HireOrbit Admin & ATS Desk
              </h1>
              <p className="text-xs text-indigo-400">Recruiter Management & Analytics</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <NavLink
              to="/admin/dashboard"
              end
              className={({ isActive }) =>
                `text-xs px-3.5 py-1.5 rounded-xl font-bold transition inline-flex items-center gap-1.5 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`
              }
            >
              <FaChartBar /> Analytics
            </NavLink>

            <NavLink
              to="/admin/jobs"
              className={({ isActive }) =>
                `text-xs px-3.5 py-1.5 rounded-xl font-bold transition inline-flex items-center gap-1.5 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`
              }
            >
              <FaBriefcase /> Jobs & ATS
            </NavLink>

            <a
              href="/jobs"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-800 transition inline-flex items-center gap-1"
              title="Open Public Job Board"
            >
              Board <FaExternalLinkAlt className="text-[10px]" />
            </a>

            <button
              onClick={handleAdminLogout}
              className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3.5 py-1.5 rounded-xl border border-red-500/30 transition font-semibold"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        <Outlet />
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 text-center py-4 text-xs text-slate-500">
        HireOrbit Admin Dashboard • Role-Based Access Control Enabled
      </footer>
    </div>
  );
};

export default AdminLayout;
