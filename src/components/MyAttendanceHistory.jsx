// src/components/MyAttendanceHistory.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

export default function MyAttendanceHistory() {
  const [records, setRecords] = useState([]);
  const [billing, setBilling] = useState({ afternoon: 0, night: 0, total: 0 });

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "attendance"),
      where("userId", "==", user.uid),
      orderBy("date", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setRecords(docs);

        // 🔹 Calculate billing for current month only
        const now = new Date();
        const thisMonth = now.toISOString().slice(0, 7); // e.g. "2025-09"

        let afternoonCount = 0;
        let nightCount = 0;

        docs.forEach((r) => {
          if (!r.date?.startsWith(thisMonth)) return;
          if (r.meal === "AFTERNOON") afternoonCount++;
          if (r.meal === "NIGHT") nightCount++;
        });

        const total = afternoonCount * 40 + nightCount * 60;
        setBilling({ afternoon: afternoonCount, night: nightCount, total });
      },
      (err) => {
        console.error("history snapshot error:", err);
        setRecords([]);
        setBilling({ afternoon: 0, night: 0, total: 0 });
      }
    );

    return () => unsub();
  }, []);

  // 🔹 Format timestamp safely
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

  return (
    <div className="bg-white rounded-xl shadow p-4 mt-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg">My Attendance History</h2>
        <div className="text-sm text-gray-700">
          <span className="font-medium">This Month Bill: </span>
          <span className="text-green-700 font-semibold">₹{billing.total}</span>
        </div>
      </div>

      {records.length === 0 ? (
        <p className="text-sm text-gray-600">No records yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-2 px-3 rounded-tl-lg">Date</th>
                <th className="py-2 px-3">Meal</th>
                <th className="py-2 px-3">Marked At</th>
                <th className="py-2 px-3 rounded-tr-lg">Price</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, idx) => (
                <tr
                  key={r.id}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } border-t`}
                >
                  <td className="py-2 px-3">{r.date}</td>
                  <td className="py-2 px-3">
                    {r.meal === "AFTERNOON" ? "Lunch 🍲" : "Dinner 🍛"}
                  </td>
                  <td className="py-2 px-3">{formatTime(r.createdAt)}</td>
                  <td className="py-2 px-3">
                    {r.meal === "AFTERNOON" ? "₹40" : "₹60"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
