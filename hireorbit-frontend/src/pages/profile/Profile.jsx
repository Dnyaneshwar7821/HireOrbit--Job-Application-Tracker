import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../api/authService";
import { useToast } from "../../context/ToastContext";
import { useTheme } from "../../context/ThemeContext";

const Profile = () => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [showDelete, setShowDelete] = useState(false);
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  useEffect(() => {
    authService
      .getProfile()
      .then((res) => setUser(res.data))
      .catch(() => {});
  }, []);

  const handleDelete = async () => {
    if (!password) {
      showError("Enter password to confirm deletion");
      return;
    }

    try {
      await authService.deleteAccount(password);
      showSuccess("Account deleted successfully");
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      showError(err.response?.data?.message || err.response?.data || "Delete failed");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto font-sans min-h-[80vh]">
      <h1 className={`text-3xl font-extrabold mb-6 tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
        User Profile
      </h1>

      <div
        className={`p-6 rounded-3xl border shadow-xl backdrop-blur-xl transition-colors duration-200 ${
          isDark
            ? "bg-slate-900/90 border-slate-800 text-slate-100"
            : "bg-white border-slate-200 text-slate-900 shadow-slate-200/50"
        }`}
      >
        {/* USER INFO */}
        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between border-b pb-3 border-slate-700/50">
            <span className={`font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Full Name
            </span>
            <span className="font-bold">{user?.name || "N/A"}</span>
          </div>

          <div className="flex items-center justify-between border-b pb-3 border-slate-700/50">
            <span className={`font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Email Address
            </span>
            <span className="font-bold">{user?.email || "N/A"}</span>
          </div>

          <div className="flex items-center justify-between pb-1">
            <span className={`font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Account Role
            </span>
            <span className="font-extrabold text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">
              {user?.role || "USER"}
            </span>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 border-slate-700/50">
          <button
            onClick={() => setShowDelete(!showDelete)}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-5 py-2.5 rounded-xl font-bold text-xs transition"
          >
            {showDelete ? "Cancel Account Deletion" : "Delete Account"}
          </button>

          {showDelete && (
            <div className="mt-4 p-4 rounded-2xl border border-red-500/30 bg-red-500/5 space-y-3">
              <p className="text-xs text-red-300 font-semibold">
                ⚠️ Warning: Enter your password below to permanently delete your account and data.
              </p>
              <input
                type="password"
                placeholder="Enter password to confirm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-3 rounded-xl border text-sm outline-none ${
                  isDark
                    ? "bg-slate-950 border-slate-800 text-white placeholder-slate-500"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                }`}
              />

              <button
                onClick={handleDelete}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-3 rounded-xl transition shadow-lg shadow-red-600/20"
              >
                Permanently Confirm & Delete Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
