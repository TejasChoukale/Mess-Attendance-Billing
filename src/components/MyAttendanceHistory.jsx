// src/components/MyAttendanceHistory.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

export default function MyAttendanceHistory() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const q = query(
      collection(db, "attendance"),
      where("userId", "==", user.uid),
      orderBy("date", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setRecords(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => {
      console.error("history snapshot error:", err);
      setRecords([]);
    });
    return () => unsub();
  }, []);

  return (
    <div className="bg-white rounded shadow p-4 mt-6">
      <h2 className="font-semibold mb-3">My Attendance History</h2>
      {records.length === 0 ? (
        <p className="text-sm">No records yet.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr><th className="py-1">Date</th><th className="py-1">Meals</th><th className="py-1">Marked At</th></tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r.id} className="border-t">
                <td className="py-2">{r.date}</td>
                <td className="py-2">
                  {r.meals?.AFTERNOON ? "Lunch " : ""}{r.meals?.NIGHT ? "Dinner" : ""}
                </td>
                <td className="py-2">{r.createdAt?.toDate ? r.createdAt.toDate().toLocaleString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
