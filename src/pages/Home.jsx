// src/pages/Home.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Home() {
  const { user, claims } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
  };

  const isAdmin = claims?.email === "tejaschoukale99@gmail.com";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500">
      {/* Navigation Bar */}
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white">🍽️ MessMate</span>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                // Logged in user
                <>
                  <div className="text-white text-sm">
                    Welcome, <span className="font-semibold">{user.displayName || user.email}</span>
                  </div>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    Dashboard
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => navigate("/admin")}
                      className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors font-medium"
                    >
                      Admin Panel
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                // Not logged in
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center text-white mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Smart Mess Management
            <span className="block text-yellow-300 mt-2">Made Simple</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Track attendance, manage billing, and streamline your mess operations with our modern digital solution.
          </p>
          
          {!user && (
            <div className="space-x-4">
              <button
                onClick={() => navigate("/signup")}
                className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-colors transform hover:scale-105"
              >
                Get Started Free
              </button>
              <button
                onClick={() => navigate("/login")}
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
              >
                Sign In
              </button>
            </div>
          )}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-colors">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-bold text-white mb-3">Easy Attendance</h3>
            <p className="text-white/80">Mark your meal attendance with just one click. No more paper registers or manual tracking.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-colors">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold text-white mb-3">Auto Billing</h3>
            <p className="text-white/80">Automatic bill calculation based on actual attendance. Transparent and fair billing system.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-colors">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-bold text-white mb-3">Secure & Fast</h3>
            <p className="text-white/80">Enterprise-grade security with lightning-fast performance. Your data is always protected.</p>
          </div>
        </div>

        {/* User Status Section */}
        {user && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Welcome back! 👋</h2>
            <p className="text-white/90 text-lg mb-6">
              You're signed in as <span className="font-semibold">{user.displayName || user.email}</span>
            </p>
            <div className="space-x-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Go to Dashboard
              </button>
              {isAdmin && (
                <button
                  onClick={() => navigate("/admin")}
                  className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
                >
                  Admin Panel
                </button>
              )}
            </div>
            <div className="mt-4 text-sm text-white/70">
              Role: {isAdmin ? "Administrator" : "User"}
            </div>
          </div>
        )}

        {/* Features for non-logged in users */}
        {!user && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-8">Why Choose MessMate?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="text-left">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-white text-lg">Real-time attendance tracking</span>
                </div>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-white text-lg">Automated billing system</span>
                </div>
              </div>
              <div className="text-left">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-white text-lg">Admin approval workflow</span>
                </div>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-white text-lg">Mobile-friendly interface</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-black/20 border-t border-white/10 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white/80 mb-4">
            <span className="font-semibold">MessMate</span> - Smart Mess Management Solution
          </div>
          <div className="text-white/60 text-sm">
            © 2025 MessMate. Built with ❤️ for better mess management.
          </div>
        </div>
      </footer>
    </div>
  );
}