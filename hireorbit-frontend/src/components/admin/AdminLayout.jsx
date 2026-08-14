import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContextValue";

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">👑</span>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight">
                HireOrbit Admin Portal
              </h1>
              <p className="text-xs text-indigo-400">System Management & Analytics</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition"
            >
              💼 Switch to User View
            </Link>
            <button
              onClick={handleAdminLogout}
              className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg border border-red-500/30 transition"
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
