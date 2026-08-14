import { useEffect, useState } from "react";
import { adminService } from "../../api/adminService";
import { FaTrash, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalApplications: 0,
    totalOffers: 0,
    totalResumeAnalyses: 0,
    successRate: 0,
    statusBreakdown: { APPLIED: 0, INTERVIEW: 0, OFFER: 0, REJECTED: 0 },
  });
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  // Custom Modal & Toast States
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadAdminData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch {
      // Keep quiet or show subtle toast on error
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    setDeleting(true);

    try {
      await adminService.deleteUser(userToDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setUserToDelete(null);
      showToast(`User ${userToDelete.email} deleted successfully.`, "success");
      loadAdminData();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Failed to delete user";
      setUserToDelete(null);
      showToast(msg, "error");
    } finally {
      setDeleting(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-8 relative font-sans">
      {/* Toast Notification Popup */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border backdrop-blur-md text-sm font-semibold animate-bounce ${
            toast.type === "error"
              ? "bg-red-950/90 text-red-200 border-red-800"
              : "bg-emerald-950/90 text-emerald-200 border-emerald-800"
          }`}
        >
          {toast.type === "error" ? (
            <FaTimesCircle className="text-red-400 text-lg" />
          ) : (
            <FaCheckCircle className="text-emerald-400 text-lg" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Delete Confirmation Modal Popup */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <FaExclamationTriangle className="text-2xl" />
              <h3 className="text-lg font-bold text-white">Confirm Account Deletion</h3>
            </div>

            <p className="text-sm text-slate-300">
              Are you sure you want to delete <span className="font-bold text-white">{userToDelete.email}</span>?
            </p>
            <p className="text-xs text-slate-400">
              This will permanently delete their account and all associated applications, interview stages, and resume history.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteUser}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Yes, Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          System Overview & Analytics
        </h1>
        <p className="text-sm text-slate-400">
          Platform-wide KPIs, User Management, and Application Statistics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <p className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
            Total Job Seekers
          </p>
          <p className="text-3xl font-extrabold text-white mt-2">
            {stats.totalUsers}
          </p>
          <p className="text-xs text-indigo-400 mt-1">Registered Accounts</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <p className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
            Applications Tracked
          </p>
          <p className="text-3xl font-extrabold text-white mt-2">
            {stats.totalApplications}
          </p>
          <p className="text-xs text-blue-400 mt-1">Across all users</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <p className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
            Offers Extended
          </p>
          <p className="text-3xl font-extrabold text-emerald-400 mt-2">
            {stats.totalOffers}
          </p>
          <p className="text-xs text-emerald-400/70 mt-1">
            Success Rate: {(stats.successRate || 0).toFixed(1)}%
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <p className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
            AI Resume Analyses
          </p>
          <p className="text-3xl font-extrabold text-purple-400 mt-2">
            {stats.totalResumeAnalyses}
          </p>
          <p className="text-xs text-purple-400/70 mt-1">Gemini AI Runs</p>
        </div>
      </div>

      {/* Application Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-lg font-bold text-white mb-4">
          Platform Application Status Breakdown
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/50">
            <p className="text-xs text-slate-400">APPLIED</p>
            <p className="text-xl font-bold text-blue-400">
              {stats.statusBreakdown?.APPLIED || 0}
            </p>
          </div>
          <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/50">
            <p className="text-xs text-slate-400">INTERVIEW</p>
            <p className="text-xl font-bold text-amber-400">
              {stats.statusBreakdown?.INTERVIEW || 0}
            </p>
          </div>
          <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/50">
            <p className="text-xs text-slate-400">OFFER</p>
            <p className="text-xl font-bold text-emerald-400">
              {stats.statusBreakdown?.OFFER || 0}
            </p>
          </div>
          <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/50">
            <p className="text-xs text-slate-400">REJECTED</p>
            <p className="text-xl font-bold text-red-400">
              {stats.statusBreakdown?.REJECTED || 0}
            </p>
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">User Management</h2>
            <p className="text-xs text-slate-400">
              View registered users and delete test accounts
            </p>
          </div>

          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-full md:w-72"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Job Applications</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/50">
                    <td className="p-3 font-semibold text-white">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                          u.role === "ADMIN"
                            ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">{u.applicationCount} jobs</td>
                    <td className="p-3 text-right">
                      {u.email === "admin@hireorbit.com" ? (
                        <span className="text-xs text-slate-500 italic">Primary Admin</span>
                      ) : (
                        <button
                          onClick={() => setUserToDelete(u)}
                          className="inline-flex items-center gap-1.5 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg border border-red-500/30 transition font-semibold"
                        >
                          <FaTrash className="text-[10px]" /> Delete Account
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
