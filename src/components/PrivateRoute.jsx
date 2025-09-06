// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-4">Checking authentication...</div>;
  return user ? children : <Navigate to="/login" replace />;
}
