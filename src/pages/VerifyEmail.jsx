// src/pages/VerifyEmail.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow text-center">
        <h2 className="text-2xl font-semibold mb-4">Verify your email</h2>
        <p className="mb-4">A verification email was sent. Open it and click the link to verify your account. After that, sign in again.</p>
        <button className="py-2 px-4 bg-blue-600 text-white rounded" onClick={() => navigate("/login")}>Back to Login</button>
      </div>
    </div>
  );
}
