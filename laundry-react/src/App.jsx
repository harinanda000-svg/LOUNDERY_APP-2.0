import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import AdminDashboard from "./pages/AdminDashboard";
import Customers from "./pages/Customers";
import Login from "./pages/Login";
import Signup from "./pages/signup";

function App() {
  return (
    <div className="min-h-screen bg-[#eef6fc]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;