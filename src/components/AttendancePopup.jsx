// src/components/AttendancePopup.jsx
import { useEffect } from "react";

export default function AttendancePopup({ visible, message, status, onClose }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose(); // auto close after 5 sec (optional)
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
        <h2 className="text-lg font-bold mb-2">🍽 Attendance Marked</h2>
        <p className="text-gray-700 mb-4">{message}</p>

        {/* 🔹 Show status if available */}
        {status && (
          <p
            className={`mb-4 font-semibold ${
              status === "ACCEPTED"
                ? "text-green-600"
                : status === "REJECTED"
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            Status: {status}
          </p>
        )}

        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
