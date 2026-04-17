// import { useEffect, useState } from "react";
// import { axiosInstance } from "./lib/axios";
// import { Show, SignInButton, UserButton } from "@clerk/react";

// function App() {
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     axiosInstance
//       .get("/health")
//       .then((response) => setMessage(response.data))
//       .catch((error) => console.error("Error fetching data:", error));
//   }, []);

//   return (
//     <>
//       <header>
//         <Show when="signed-out">
//           <SignInButton />
//         </Show>
//         <Show when="signed-in">
//           <UserButton />
//         </Show>
//       </header>
//       <h1 className="text-3xl font-bold underline text-center mt-10">
//         {message.message || "Loading..."}
//       </h1>
//     </>
//   );
// }

// export default App;

import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background gradient */}
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
