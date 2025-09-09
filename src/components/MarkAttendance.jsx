// src/components/MarkAttendance.jsx
import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc, updateDoc, serverTimestamp, onSnapshot } from "firebase/firestore";

function todayYMD() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function MarkAttendance() {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [marked, setMarked] = useState({ AFTERNOON: false, NIGHT: false });
  const [popup, setPopup] = useState(null);

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

  // Real-time listener for a meal
  const checkMealRealtime = (meal) => {
    if (!user) return;

    const docId = `${user.uid}_${today}_${meal}`;
    const ref = doc(db, "attendance", docId);

    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setMarked((s) => ({ ...s, [meal]: true }));

        // Show popup if status changed and user hasn't seen it
        if (data.status && !data.seenByUser) {
          setPopup({ meal, status: data.status, ref });
        }
      }
    });

    return unsub;
  };

  // Set up real-time listeners
  useEffect(() => {
    if (user) {
      const unsubAfternoon = checkMealRealtime("AFTERNOON");
      const unsubNight = checkMealRealtime("NIGHT");

      return () => {
        unsubAfternoon && unsubAfternoon();
        unsubNight && unsubNight();
      };
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
        status: "PENDING", // Default status
        seenByUser: false, // User hasn't seen admin response yet
        createdAt: serverTimestamp(),
      };

      console.log("📝 Writing data:", writeData);
      await setDoc(ref, writeData);
      setMarked((s) => ({ ...s, [meal]: true }));
      setMsg(`${meal} attendance saved! ✅ Status: PENDING`);
      
    } catch (error) {
      console.error("❌ Error submitting:", error);
      
      if (error.code === 'permission-denied') {
        setMsg("Permission denied. Please contact admin to update Firestore security rules.");
      } else if (error.code === 'unauthenticated') {
        setMsg("Authentication required. Please sign in again.");
      } else {
        setMsg("Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Mark popup as seen
  const closePopup = async () => {
    if (popup?.ref) {
      try {
        await updateDoc(popup.ref, { seenByUser: true });
        console.log("✅ Marked as seen by user");
      } catch (error) {
        console.error("❌ Error marking as seen:", error);
      }
    }
    setPopup(null);
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

      {popup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
            <h2 className="text-lg font-bold mb-2">🍽 Status Update</h2>
            <p className="text-gray-700 mb-4">
              Your <strong>{popup.meal}</strong> request has been:
            </p>
            <p
              className={`mb-4 text-lg font-bold ${
                popup.status === "APPROVED"
                  ? "text-green-600"
                  : popup.status === "REJECTED"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {popup.status === "APPROVED" ? "✅ APPROVED" : 
               popup.status === "REJECTED" ? "❌ REJECTED" : "⏳ PENDING"}
            </p>
            <button
              onClick={closePopup}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

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
