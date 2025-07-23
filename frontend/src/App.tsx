import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function Login() {
  return <div className="p-8">Login Page</div>;
}
function Register() {
  return <div className="p-8">Register Page</div>;
}
function Dashboard() {
  return <div className="p-8">Dashboard</div>;
}
function BookRide() {
  return <div className="p-8">Book a Ride</div>;
}
function RideHistory() {
  return <div className="p-8">Ride History</div>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/book" element={<BookRide />} />
        <Route path="/history" element={<RideHistory />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
