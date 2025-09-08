// src/pages/Dashboard.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import MarkAttendance from "../components/MarkAttendance";
import MyAttendanceHistory from "../components/MyAttendanceHistory";

export default function Dashboard() {
  const { user, claims } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
  };

  const isAdmin = claims?.email === "tejaschoukale99@gmail.com"; // ✅ matches Firestore rules

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Top bar with username + actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-700">Signed in as</div>
            <div className="text-lg font-semibold">
              {user?.displayName || user?.email}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {isAdmin && (
              <button
                onClick={() => navigate("/admin")}
                className="py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                Go to Admin Panel
              </button>
            )}
            <button
              onClick={handleLogout}
              className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Main content */}
        {isAdmin ? (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded mb-6 text-sm text-yellow-800">
            ✅ You are logged in as <strong>Admin</strong>. Use the button above
            to manage attendance records.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <MarkAttendance />
            <MyAttendanceHistory />
          </div>
        )}

        <div className="mt-6 text-sm text-gray-600">
          <p>UID: {user?.uid}</p>
          <p>Role: {isAdmin ? "admin" : "user"}</p>
        </div>
      </div>
    </div>
  );
}
