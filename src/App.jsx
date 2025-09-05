import React, { useEffect } from "react";
import { app } from "./firebase";

function App() {
  // Run once when component mounts
  useEffect(() => {
    console.log("Firebase initialized:", app.name);
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">
        Tailwind is Working ✅
      </h1>
    </div>
  );
}

export default App;
