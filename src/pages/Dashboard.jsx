// src/pages/Dashboard.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import MarkAttendance from "../components/MarkAttendance";
import MyAttendanceHistory from "../components/MyAttendanceHistory";

export default function Dashboard() {
  const { user, claims } = useAuth();

  const handleLogout = async () => { await signOut(auth); };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Top bar with username at top-left */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-700">Signed in as</div>
            <div className="text-lg font-semibold">{user?.displayName || user?.email}</div>
          </div>
          <div>
            <button onClick={handleLogout} className="py-2 px-4 bg-red-600 text-white rounded">Sign out</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <MarkAttendance />
          <MyAttendanceHistory />
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <p>UID: {user?.uid}</p>
          <p>Role (trusted claim): {claims?.role || "user (default)"}</p>
        </div>
      </div>
    </div>
  );
}
