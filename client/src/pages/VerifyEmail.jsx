


// import { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const VerifyEmail = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Get userId from location or localStorage
//   const userId = location.state?.userId || localStorage.getItem("userId");

//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!userId) {
//       toast.error("Missing user information. Please register again.");
//       navigate("/register");
//     } else {
//       localStorage.setItem("userId", userId);
//     }
//   }, [userId, navigate]);

//   const handleVerify = async (e) => {
//     e.preventDefault();

//     if (!otp.match(/^\d{4,6}$/)) {
//       toast.error("Please enter a valid 6-digit OTP.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.post("/api/auth/verify-otp", { userId, otp });
//       toast.success(res.data.message || "Email verified successfully!");
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
//         <input
//           type="text"
//           maxLength={6}
//           value={otp}
//           onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
//           placeholder="Enter 6-digit OTP"
//           required
//           className="rounded-lg px-3 p-2 text-center tracking-widest text-lg"
//         />
//         <button
//           type="submit"
//           disabled={loading}
//           className="btn p-2 rounded-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white"
//         >
//           {loading ? "Verifying..." : "Verify OTP"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default VerifyEmail;


import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Prefill email if passed in navigation state from registration page
  const initialEmail = location.state?.email || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validate email format
  const isValidEmail = (email) =>
    /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

  const handleSendOtp = async () => {
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/auth/send-otp", { email });
      toast.success("OTP sent to your email.");
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.match(/^\d{4,6}$/)) {
      toast.error("Please enter a valid OTP.");
      return;
    }

    setLoading(true);
    try {
      // Verify OTP, backend should accept email + otp (or adapt accordingly)
      const res = await axios.post("/api/auth/verify-otp", { email, otp });
      toast.success(res.data.message || "Email verified successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-email-container max-w-md mx-auto p-6 bg-gray-200 rounded-lg">
      <ToastContainer autoClose={4000} position="top-center" newestOnTop />
      <h2 className="text-center font-medium text-xl py-4">Email Verification</h2>

      {!otpSent ? (
        <>
          <label htmlFor="email" className="block mb-2 font-medium">
            Enter your registered email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            placeholder="Enter your registered email"
            required
            className="w-full rounded-lg px-3 p-2 mb-4"
          />
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={loading}
            className="btn w-full p-2 rounded-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </>
      ) : (
        <form onSubmit={handleVerifyOtp} className="flex flex-col space-y-4">
          <label htmlFor="otp" className="block font-medium">
            Enter OTP sent to your email:
          </label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value.trim())}
            placeholder="Enter OTP"
            required
            className="w-full rounded-lg px-3 p-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn p-2 rounded-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          <button
            type="button"
            onClick={() => setOtpSent(false)}
            className="underline text-sm text-gray-600 hover:text-gray-800"
          >
            Resend OTP
          </button>
        </form>
      )}
    </div>
  );
};

export default VerifyEmail;
