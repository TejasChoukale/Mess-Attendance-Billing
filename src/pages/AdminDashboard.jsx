// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // ✅ FIXED: Changed from "mealRequests" to "attendance"
    const unsub = onSnapshot(collection(db, "attendance"), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      // Sort by date/time, newest first
      list.sort((a, b) => {
        if (b.createdAt && a.createdAt) {
          return b.createdAt.toDate() - a.createdAt.toDate();
        }
        return 0;
      });
      setRequests(list);
    });
    return () => unsub();
  }, []);

  const handleUpdate = async (id, status) => {
    try {
      // ✅ FIXED: Using "attendance" collection
      await updateDoc(doc(db, "attendance", id), { 
        status,
        seenByUser: false // Reset so user sees the update
      });
      console.log(`✅ Updated ${id} to ${status}`);
    } catch (error) {
      console.error("❌ Error updating status:", error);
    }
  };

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded mb-6">
      <h2 className="text-lg font-semibold mb-4">📢 Meal Requests</h2>
      {requests.length === 0 && (
        <p className="text-gray-600">No requests yet.</p>
      )}
      <ul className="space-y-3">
        {requests.map((req) => (
          <li
            key={req.id}
            className="p-3 bg-white shadow rounded flex items-center justify-between"
          >
            <div>
              <p>
                <strong>{req.userId?.slice(0, 8)}...</strong> requested{" "}
                <span className="font-medium">{req.meal}</span> on {req.date}
              </p>
              <p className="text-sm text-gray-500">
                Status:{" "}
                <span
                  className={
                    req.status === "APPROVED"
                      ? "text-green-600 font-semibold"
                      : req.status === "REJECTED"
                      ? "text-red-600 font-semibold"
                      : "text-yellow-600 font-semibold"
                  }
                >
                  {req.status}
                </span>
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleUpdate(req.id, "APPROVED")}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={req.status === "APPROVED"}
              >
                Approve
              </button>
              <button
                onClick={() => handleUpdate(req.id, "REJECTED")}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={req.status === "REJECTED"}
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}