import {  useState } from "react";
import { auth , db } from "../firebase"; 
import { createUserWithEmailAndPassword ,sendEmailVerification, updateProfile} from "firebase/auth";
import { doc,setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate, Link} from "react-router-dom";


export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        if (!name.trim()) return setError("Please enter your name");
        if (password.length < 6) return setError("Password must be at least 6 characters and make it strong DIDI/DADA");
        setLoading(true);

        try {
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCred.user;

            await updateProfile(user, {displayName: name});

            await setDoc(doc(db, "users", user.uid), {
                name:name,
                email:user.email,
                role: "user",
                createdAt: serverTimestamp()
            });

            await sendEmailVerification(user);

            navigate("/verify-email"); // neeeded to check this i think it might casue error
    
        } catch (err){

            setError(err.message || "failed to create account ,try to contact developer");
        } finally {
            setLoading(false);
        }

    };

    function parseFirebaseError(err){
        switch(err.code){
            case "auth/email-already-in-use": return "Email already in use bro/sis.";
            case "auth/invalid-email": return "Invalid email sir/maam";
            case "auth/weak-password": return "Password is too weak , make it strong like you sister/brother";
            default: return err.message || "Failed to create account.";

        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-semibold mb-6">Create account</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <input className="w-full p-2 border rounded" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
          <input className="w-full p-2 border rounded" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="w-full p-2 border rounded" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <p className="text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-blue-600 text-white rounded">
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
         <p className="mt-4 text-sm">Already have an account? <Link to="/login" className="text-blue-600">Sign in</Link></p>
      </div>
    </div>
    
    );


}