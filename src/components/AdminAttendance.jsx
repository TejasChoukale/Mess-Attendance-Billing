// src/components/AdminAttendance.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  query,
  where,
  getDocs, // ✅ IMPORT ADDED
} from "firebase/firestore";

export default function AdminAttendance() {
  const [records, setRecords] = useState([]);
  const [userCache, setUserCache] = useState({});
  const [modalUser, setModalUser] = useState(null); // user object for modal
  const [billingData, setBillingData] = useState({}); // { "YYYY-MM": total }

  // Fetch all attendance records
  useEffect(() => {
    const q = collection(db, "attendance");
    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => {
            if (a.date === b.date) return a.meal.localeCompare(b.meal);
            return b.date.localeCompare(a.date);
          });
        setRecords(docs);
      },
      (err) => {
        console.error("admin snapshot error:", err);
        setRecords([]);
      }
    );
    return () => unsub();
  }, []);

  // Fetch user profile from /users/{uid}
  const getUserProfile = async (uid) => {
    if (userCache[uid]) return userCache[uid];
    try {
      const snap = await getDoc(doc(db, "users", uid));
      let profile = { name: uid, email: "" };
      if (snap.exists()) {
        const data = snap.data();
        profile = { name: data.name || uid, email: data.email || "" };
      }
      setUserCache((prev) => ({ ...prev, [uid]: profile }));
      return profile;
    } catch (err) {
      console.error("Error fetching user:", err);
      return { name: uid, email: "" };
    }
  };

  // Preload all unique user profiles whenever records change
  useEffect(() => {
    const uniqueIds = [...new Set(records.map((r) => r.userId))];
    uniqueIds.forEach((uid) => {
      if (!userCache[uid]) getUserProfile(uid);
    });
  }, [records]);

  // Toggle meal type
  const toggleMeal = async (rec) => {
    try {
      const ref = doc(db, "attendance", rec.id);
      const newMeal = rec.meal === "AFTERNOON" ? "NIGHT" : "AFTERNOON";
      await updateDoc(ref, { meal: newMeal });
    } catch (err) {
      console.error("toggle meal error:", err);
    }
  };

  // Delete record
  const deleteRec = async (rec) => {
    try {
      await deleteDoc(doc(db, "attendance", rec.id));
    } catch (err) {
      console.error("delete error:", err);
    }
  };

  // Format time in 12-hour AM/PM
  const formatTime = (ts) => {
    if (!ts?.toDate) return "-";
    return ts.toDate().toLocaleString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      day: "2-digit",
      month: "short",
    });
  };

  // Fetch billing for user
  const fetchBillingForUser = async (uid) => {
    const q = query(collection(db, "attendance"), where("userId", "==", uid));
    const snap = await getDocs(q);
    const tempBilling = {};
    snap.forEach((doc) => {
      const r = doc.data();
      const month = r.date.slice(0, 7); // YYYY-MM
      if (!tempBilling[month]) tempBilling[month] = 0;
      tempBilling[month] += r.meal === "AFTERNOON" ? 40 : 60;
    });
    setBillingData(tempBilling);
  };

  const handleUserClick = async (uid) => {
    const profile = userCache[uid];
    setModalUser(profile || { name: uid, email: "" });
    await fetchBillingForUser(uid);
  };

  const closeModal = () => {
    setModalUser(null);
    setBillingData({});
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 mt-6">
      <h2 className="font-semibold text-lg mb-3">
        Admin Attendance Management
      </h2>

      {records.length === 0 ? (
        <p className="text-sm text-gray-600">No records yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-2 px-3 rounded-tl-lg">User</th>
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Meal</th>
                <th className="py-2 px-3">Marked At</th>
                <th className="py-2 px-3 rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, idx) => {
                const profile = userCache[r.userId];
                return (
                  <tr
                    key={r.id}
                    className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} border-t`}
                  >
                    <td
                      className="py-2 px-3 cursor-pointer text-blue-600 hover:underline"
                      onClick={() => handleUserClick(r.userId)}
                    >
                      {profile ? `${profile.name} (${profile.email})` : "Loading..."}
                    </td>
                    <td className="py-2 px-3">{r.date}</td>
                    <td className="py-2 px-3">{r.meal === "AFTERNOON" ? "Lunch 🍲" : "Dinner 🍛"}</td>
                    <td className="py-2 px-3">{formatTime(r.createdAt)}</td>
                    <td className="py-2 px-3 space-x-2">
                      <button
                        onClick={() => toggleMeal(r)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                      >
                        Toggle Meal
                      </button>
                      <button
                        onClick={() => deleteRec(r)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for billing */}
      {modalUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={closeModal}
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-3">
              {modalUser.name} ({modalUser.email}) — Monthly Billing
            </h3>
            {Object.keys(billingData).length === 0 ? (
              <p>Loading...</p>
            ) : (
              <div className="space-y-1">
                {Object.entries(billingData).map(([month, total]) => (
                  <div key={month}>
                    {month}: ₹{total}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
