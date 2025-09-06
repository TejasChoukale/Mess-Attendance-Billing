// src/pages/Dashboard.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Dashboard() {
  const { user, claims } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-4">Welcome, {user?.displayName || user?.email}</h1>
      <p className="mb-2">UID: {user?.uid}</p>
      <p className="mb-4">Role (trusted claim): {claims?.role || "user (default)"}</p>
      <div>
        <button onClick={handleLogout} className="py-2 px-4 bg-red-600 text-white rounded">Sign out</button>
      </div>
    </div>
  );
}
