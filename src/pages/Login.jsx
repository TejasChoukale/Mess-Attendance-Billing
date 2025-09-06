// src/pages/Login.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;
      if (!user.emailVerified) {
        setInfo("Please verify your email before accessing the dashboard.");
        navigate("/verify-email");
        return;
      }
      navigate("/dashboard");
    } catch (err) {
      setError(parseFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  // <-- This is the missing function. It sends password reset email.
  const handleReset = async () => {
    setError("");
    setInfo("");
    if (!email) {
      setError("Enter your email to receive a password reset link.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setInfo("Password reset email sent. Please check your inbox (and spam).");
    } catch (err) {
      setError(parseFirebaseError(err));
    }
  };

  function parseFirebaseError(err) {
    switch (err?.code) {
      case "auth/user-not-found": return "No account exists with this email.";
      case "auth/wrong-password": return "Incorrect password.";
      case "auth/invalid-email": return "Invalid email address.";
      case "auth/too-many-requests": return "Too many attempts. Try again later.";
      default: return (err && err.message) || "Authentication failed. Try again.";
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-semibold mb-6">Sign in</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="w-full p-2 border rounded"
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full p-2 border rounded"
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-600">{error}</p>}
          {info && <p className="text-green-600">{info}</p>}
          <div className="flex items-center justify-between">
            <button type="submit" className="py-2 px-4 bg-green-600 text-white rounded" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <button type="button" onClick={handleReset} className="text-sm text-blue-600">
              Forgot?
            </button>
          </div>
        </form>
        <p className="mt-4 text-sm">
          No account? <Link to="/signup" className="text-blue-600">Create one</Link>
        </p>
      </div>
    </div>
  );
}
