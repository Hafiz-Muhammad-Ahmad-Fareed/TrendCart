import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "@clerk/react";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import useUserStore from "./stores/useUserStore";
import { useEffect } from "react";

function App() {
  const { userId } = useAuth();
  const { user, fetchUser } = useUserStore();

  useEffect(() => {
    if (userId && !user) {
      fetchUser();
    }
  }, [userId, user]);

  useEffect(() => {
    console.log("userId:", userId);
  }, [userId]);

  useEffect(() => {
    console.log("user:", user);
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>
      </div>

      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
