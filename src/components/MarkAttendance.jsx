import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

function todayYMD() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function MarkAttendance() {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [marked, setMarked] = useState({ AFTERNOON: false, NIGHT: false });

  const user = auth.currentUser;
  const today = todayYMD();

  // Debug auth
  useEffect(() => {
    console.log("🔍 Auth Debug:");
    console.log("- Current user:", !!user);
    console.log("- User ID:", user?.uid);
    console.log("- User email:", user?.email);
    console.log("- Email verified:", user?.emailVerified);
    console.log("- Project ID:", db?.app?.options?.projectId);
  }, [user]);

  // Helper to check if a meal is already marked
  const checkMeal = async (meal) => {
    if (!user) return;
    const docId = `${user.uid}_${today}_${meal}`;
    const ref = doc(db, "attendance", docId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      setMarked((s) => ({ ...s, [meal]: true }));
    }
  };

  useEffect(() => {
    if (user) {
      checkMeal("AFTERNOON");
      checkMeal("NIGHT");
    }
  }, [user]);

  // Submit one meal
  const submitMeal = async (meal) => {
    setMsg("");
    setLoading(true);

    if (!user) {
      setLoading(false);
      return setMsg("Please login first.");
    }

    const docId = `${user.uid}_${today}_${meal}`;
    const ref = doc(db, "attendance", docId);

    try {
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setMarked((s) => ({ ...s, [meal]: true }));
        setLoading(false);
        return setMsg(`${meal} attendance already marked.`);
      }

      const writeData = {
        userId: user.uid,
        date: today,
        meal,
        createdAt: serverTimestamp(),
      };

      await setDoc(ref, writeData);
      setMarked((s) => ({ ...s, [meal]: true }));
      setMsg(`${meal} attendance saved! ✅`);
    } catch (error) {
      console.error("❌ Error submitting:", error);
      setMsg("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md bg-white rounded shadow">
      <div className="mb-2 text-sm">
        Name: <strong>{user?.displayName || user?.email || "Not logged in"}</strong>
      </div>
      <h3 className="text-lg font-semibold mb-2">Mark Attendance — {today}</h3>

      <button
        onClick={() => submitMeal("AFTERNOON")}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        disabled={loading || marked.AFTERNOON}
      >
        {marked.AFTERNOON ? "Afternoon Marked" : "Mark Afternoon"}
      </button>

      <button
        onClick={() => submitMeal("NIGHT")}
        className="mt-2 ml-2 px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        disabled={loading || marked.NIGHT}
      >
        {marked.NIGHT ? "Night Marked" : "Mark Night"}
      </button>

      {msg && <p className="mt-3 text-sm text-red-600">{msg}</p>}

      <div className="mt-4 p-2 bg-gray-100 text-xs">
        <strong>Debug Info:</strong>
        <div>User: {user?.uid ? `${user.uid.slice(0, 8)}...` : "None"}</div>
        <div>Email Verified: {user?.emailVerified ? "Yes" : "No"}</div>
        <div>Today: {today}</div>
        <div>Marked: {JSON.stringify(marked)}</div>
      </div>
    </div>
  );
}
