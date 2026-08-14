import { useEffect, useState } from "react";
import { adminService } from "../../api/adminService";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleUpdatingId, setRoleUpdatingId] = useState(null);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch {
      console.error("Failed to load admin dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    setRoleUpdatingId(userId);
    try {
      await adminService.updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
    } catch {
      alert("Failed to update user role");
    } finally {
      setRoleUpdatingId(null);
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (!window.confirm(`Are you sure you want to delete user ${userEmail}?`)) {
      return;
    }

    try {
      await adminService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      loadAdminData();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.response?.data ||
          err.message ||
          "Failed to delete user",
      );
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-400">
        Loading Admin Analytics & User Metrics...
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
      {stats && (
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
              Success Rate: {stats.successRate.toFixed(1)}%
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
      )}

      {/* Application Breakdown */}
      {stats?.statusBreakdown && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-white mb-4">
            Platform Application Status Breakdown
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/50">
              <p className="text-xs text-slate-400">APPLIED</p>
              <p className="text-xl font-bold text-blue-400">
                {stats.statusBreakdown.APPLIED || 0}
              </p>
            </div>
            <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/50">
              <p className="text-xs text-slate-400">INTERVIEW</p>
              <p className="text-xl font-bold text-amber-400">
                {stats.statusBreakdown.INTERVIEW || 0}
              </p>
            </div>
            <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/50">
              <p className="text-xs text-slate-400">OFFER</p>
              <p className="text-xl font-bold text-emerald-400">
                {stats.statusBreakdown.OFFER || 0}
              </p>
            </div>
            <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/50">
              <p className="text-xs text-slate-400">REJECTED</p>
              <p className="text-xl font-bold text-red-400">
                {stats.statusBreakdown.REJECTED || 0}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* User Management Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">User Management</h2>
            <p className="text-xs text-slate-400">
              View users, manage roles, and delete accounts
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
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleRoleToggle(u.id, u.role)}
                        disabled={roleUpdatingId === u.id}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-indigo-300 px-3 py-1 rounded border border-slate-700 transition"
                      >
                        Make {u.role === "ADMIN" ? "User" : "Admin"}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id, u.email)}
                        className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-2.5 py-1 rounded border border-red-500/30 transition"
                      >
                        Delete
                      </button>
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
