🍽 MessMate – Smart Mess Attendance & Billing System

MessMate is a real-time mess management system built with React + Firebase.
It allows students/users to mark their meal attendance (Lunch/Dinner), while the admin manages approvals, billing, and notifications seamlessly.

🚀 Features
👤 User Side

✅ Login & Signup with Firebase Authentication

✅ Mark Lunch or Dinner once per day

✅ Real-time popup when admin approves/rejects meal requests

✅ Responsive design – works smoothly on desktop & mobile

✅ Profile info with email/name display

🛠 Admin Side

📢 Dashboard showing all meal requests (Pending, Approved, Rejected)

✅ Accept/Reject requests with a single click

🔄 Real-time updates reflected on the user side instantly

📊 Manage billing for monthly/individual users

🏗 Tech Stack

Frontend: React + Vite + TailwindCSS

Backend: Firebase Firestore (NoSQL database)

Auth: Firebase Authentication

Hosting: Vercel (CI/CD with GitHub)

📂 Project Structure
src/
 ├── components/        # Reusable UI components
 │   ├── MarkAttendance.jsx
 │   ├── AttendancePopup.jsx
 │   └── ...
 ├── pages/             # Page-level components
 │   ├── AdminDashboard.jsx
 │   ├── Home.jsx
 │   └── ...
 ├── firebase.js        # Firebase configuration
 ├── main.jsx           # Routes setup
 └── App.jsx            # Main app entry

⚡️ Installation & Setup

Clone the repo

git clone https://github.com/TejasChoukale/Mess-Attendance-Billing
cd MessMate


Install dependencies

npm install


Setup Firebase

Create a Firebase project on Firebase Console

Enable Authentication (Email/Password)

Setup Firestore Database

Copy your Firebase config and paste it inside src/firebase.js

// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


Run locally

npm run dev


Deployed on Vercel :-https://mess-attendance-billing.vercel.app/

Add Firebase environment variables if needed

Deploy 🚀

🔒 Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() { return request.auth != null; }
    function isAdmin() { return isAuthenticated() && request.auth.token.email == 'your-admin-email@gmail.com'; }
    function isOwnUser(userId) { return isAuthenticated() && request.auth.uid == userId; }

    match /attendance/{docId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAdmin();
    }

    match /users/{userId} {
      allow read, write: if isOwnUser(userId) || isAdmin();
    }

    match /adminData/{docId} {
      allow read, write: if isAdmin();
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}

📸 Screenshots 



🤝 Contributing

Pull requests are welcome! If you’d like to add new features, feel free to fork and submit a PR.

📜 License

MIT License © 2025 [Tejas Choukale]
