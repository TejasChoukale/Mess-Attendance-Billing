// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claims, setClaims] = useState({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const idTokenResult = await getIdTokenResult(u, false);
        setClaims(idTokenResult.claims || {});
      } else {
        setClaims({});
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const refreshClaims = async () => {
    if (!auth.currentUser) return null;
    const idTokenResult = await getIdTokenResult(auth.currentUser, true);
    setClaims(idTokenResult.claims || {});
    return idTokenResult.claims || {};
  };

  // ✅ Admin check (same email as in Firestore rules)
  const isAdmin =
    user?.email === "tejaschoukale99@gmail.com" || claims.admin === true;

  return (
    <AuthContext.Provider
      value={{ user, loading, claims, isAdmin, refreshClaims }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
