import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../api/authService";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showDelete, setShowDelete] = useState(false);
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    authService
      .getProfile()
      .then((res) => setUser(res.data))
      .catch(() => console.error("Profile fetch failed"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    if (!password) {
      alert("Enter password to confirm");
      return;
    }

    try {
      await authService.deleteAccount(password);

      alert("Account deleted successfully");

      localStorage.clear();

      navigate("/login");
    } catch (err) {
      alert(err.response?.data || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-6 text-gray-500 animate-pulse">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        {/* USER INFO */}
        <p className="mb-3">
          <span className="font-semibold">Name:</span> {user?.name || "N/A"}
        </p>

        <p className="mb-3">
          <span className="font-semibold">Email:</span> {user?.email || "N/A"}
        </p>

        <p>
          <span className="font-semibold">Role:</span> {user?.role || "USER"}
        </p>

        <div className="mt-6 border-t pt-4">
          <button
            onClick={() => setShowDelete(!showDelete)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Delete Account
          </button>

          {showDelete && (
            <div className="mt-4">
              <input
                type="password"
                placeholder="Enter password to confirm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-red-400 outline-none"
              />

              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Confirm Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
