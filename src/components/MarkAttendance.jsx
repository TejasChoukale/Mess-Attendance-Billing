import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

function todayYMD() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function MarkAttendance() {
  const [meals, setMeals] = useState({ AFTERNOON: false, NIGHT: false });
  const [msg, setMsg] = useState("");
  const [already, setAlready] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = auth.currentUser;
  const today = todayYMD();

  // Debug auth state
  useEffect(() => {
    console.log("🔍 Auth Debug:");
    console.log("- Current user:", !!user);
    console.log("- User ID:", user?.uid);
    console.log("- User email:", user?.email);
    console.log("- Email verified:", user?.emailVerified);
    console.log("- Project ID:", db?.app?.options?.projectId);
  }, [user]);

  const toggle = (k) => setMeals((s) => ({ ...s, [k]: !s[k] }));

  const submit = async () => {
    console.log("🚀 Starting submit...");
    setMsg("");
    setLoading(true);

    // Check auth first
    if (!user) {
      console.log("❌ No user found");
      setLoading(false);
      return setMsg("Please login first.");
    }

    console.log("✅ User found:", user.uid);
    console.log("✅ User email verified:", user.emailVerified);

    if (!meals.AFTERNOON && !meals.NIGHT) {
      console.log("❌ No meals selected");
      setLoading(false);
      return setMsg("Select at least one meal.");
    }

    console.log("✅ Meals selected:", meals);

    try {
      const docId = `${user.uid}_${today}`;
      console.log("📝 Document ID:", docId);
      
      const ref = doc(db, "attendance", docId);
      console.log("📄 Document reference created");

      // Test basic read access first
      console.log("🔍 Testing read access...");
      const snap = await getDoc(ref);
      console.log("✅ Read successful. Document exists:", snap.exists());
      
      if (snap.exists()) {
        console.log("📄 Existing document data:", snap.data());
        setAlready(true);
        setLoading(false);
        return setMsg("Attendance already marked for today.");
      }

      // Test write access
      console.log("✍️ Testing write access...");
      const writeData = {
        userId: user.uid,
        date: today,
        meals: {
          AFTERNOON: !!meals.AFTERNOON,
          NIGHT: !!meals.NIGHT,
        },
        createdAt: serverTimestamp(),
      };
      
      console.log("📊 Data to write:", writeData);
      
      await setDoc(ref, writeData);

      console.log("✅ Write successful!");
      setMsg("Attendance saved successfully!");
      setAlready(true);
      
    } catch (error) {
      console.log("❌ Complete error object:", error);
      console.log("❌ Error code:", error.code);
      console.log("❌ Error message:", error.message);
      
      if (error.code === 'permission-denied') {
        setMsg(`Permission denied. User: ${!!user}, Email verified: ${user?.emailVerified}`);
      } else {
        setMsg("Error: " + error.code + " - " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md bg-white rounded shadow">
      <div className="mb-2 text-sm">
        Name: <strong>{user?.displayName || user?.email || 'Not logged in'}</strong>
      </div>
      <h3 className="text-lg font-semibold mb-2">Mark Attendance — {today}</h3>

      <label className="block">
        <input 
          type="checkbox" 
          checked={meals.AFTERNOON} 
          onChange={() => toggle("AFTERNOON")} 
          disabled={loading || already}
        />{" "}
        <span className="ml-2">Afternoon (Lunch)</span>
      </label>

      <label className="block mt-2">
        <input 
          type="checkbox" 
          checked={meals.NIGHT} 
          onChange={() => toggle("NIGHT")} 
          disabled={loading || already}
        />{" "}
        <span className="ml-2">Night (Dinner)</span>
      </label>

      <button 
        onClick={submit} 
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50" 
        disabled={loading || already}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>

      {msg && <p className="mt-2 text-sm text-red-600">{msg}</p>}
      
      {/* Simple Debug info */}
      <div className="mt-4 p-2 bg-gray-100 text-xs">
        <strong>Debug Info:</strong>
        <div>User: {user?.uid ? `${user.uid.slice(0, 8)}...` : 'None'}</div>
        <div>Email Verified: {user?.emailVerified ? 'Yes' : 'No'}</div>
        <div>Document ID: {user?.uid ? `${user.uid}_${today}` : 'No user'}</div>
        <div>Project: {db?.app?.options?.projectId || 'Unknown'}</div>
      </div>
    </div>
  );
}