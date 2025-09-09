// src/pages/UserDashboard.jsx
import React from "react";
import MarkAttendance from "../components/MarkAttendance";
import MyAttendanceHistory from "../components/MyAttendanceHistory";

export default function UserDashboard() {
  return (
    <div className="grid grid-cols-1 gap-6">
      <MarkAttendance />
      <MyAttendanceHistory />
    </div>
  );
}
