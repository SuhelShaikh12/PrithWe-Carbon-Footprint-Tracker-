



// import { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";

// const VerifyEmail = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Grab userId from state or localStorage (persist if user refreshes page)
//   const userId = location.state?.userId || localStorage.getItem("userId");

//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!userId) {
//       // If no userId, redirect to registration page
//       navigate("/register");
//     } else {
//       // Save userId for persistence in localStorage
//       localStorage.setItem("userId", userId);
//     }
//   }, [userId, navigate]);

//   const handleVerify = async (e) => {
//     e.preventDefault();

//     if (otp.length !== 6) {
//       toast.error("OTP must be 6 digits");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.post("/api/auth/verify-otp", { userId, otp });
//       toast.success(res.data.message);
//       localStorage.removeItem("userId");
//       setTimeout(() => navigate("/login"), 2000);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "OTP verification failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="verify-email-container">
//       <ToastContainer autoClose={4000} position="top-center" newestOnTop />
//       <h2 className="text-center font-medium text-xl py-4">Enter OTP</h2>

//       <form
//         onSubmit={handleVerify}
//         className="max-w-md mx-auto flex flex-col space-y-4 p-6 bg-gray-200 rounded-lg"
//       >
//         {/* No email input here */}
//         <input
//           type="text"
//           maxLength={6}
//           value={otp}
//           onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
//           placeholder="Enter 6-digit OTP"
//           required
//           className="rounded-lg px-3 p-2"
//         />
//         <button
//           type="submit"
//           disabled={loading}
//           className="btn p-2 rounded-full bg-green-500 hover:bg-green-600"
//         >
//           {loading ? "Verifying..." : "Verify OTP"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default VerifyEmail;


import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get userId from location or localStorage
  const userId = location.state?.userId || localStorage.getItem("userId");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      toast.error("Missing user information. Please register again.");
      navigate("/register");
    } else {
      localStorage.setItem("userId", userId);
    }
  }, [userId, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp.match(/^\d{4,6}$/)) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/verify-otp", { userId, otp });
      toast.success(res.data.message || "Email verified successfully!");
      localStorage.removeItem("userId");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-email-container">
      <ToastContainer autoClose={4000} position="top-center" newestOnTop />
      <h2 className="text-center font-medium text-xl py-4">Enter OTP</h2>

      <form
        onSubmit={handleVerify}
        className="max-w-md mx-auto flex flex-col space-y-4 p-6 bg-gray-200 rounded-lg"
      >
        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter 6-digit OTP"
          required
          className="rounded-lg px-3 p-2 text-center tracking-widest text-lg"
        />
        <button
          type="submit"
          disabled={loading}
          className="btn p-2 rounded-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};

export default VerifyEmail;
