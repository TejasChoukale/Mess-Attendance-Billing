// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged , getIdTokenResult} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);      // firebase User object or null
  const [loading, setLoading] = useState(true); // while checking auth state
  const [claims, setClaims] = useState({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async(u) => {
      setUser(u);
      if (u){
        const idTokenResult = await getIdTokenResult(u, /* force kartoy Refresh */ false);
        setClaims(idTokenResult.claims || {});
      } else{
        setClaims({});
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const refreshClaims = async () => {
    if (!auth.currentUser) return null;
    const idTokenResult = await getIdTokenResult(auth.currentUser,true);
    setClaims(idTokenResult.claims || {});
    return idTokenResult.claims || {};
  }

  return (
    <AuthContext.Provider value={{ user, loading, claims, refreshClaims }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
