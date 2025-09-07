// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");

// initialize admin once
if (!admin.apps || !admin.apps.length) {
  admin.initializeApp();
}

const { onAuthUserCreate, setUserRole } = require("./users.js"); // your existing file


exports.onAuthUserCreate = onAuthUserCreate;
exports.setUserRole = setUserRole;
exports.markAttendance = markAttendance;
