
// import { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const VerifyEmail = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const initialEmail = location.state?.email || "";

//   const [email, setEmail] = useState(initialEmail);
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const isValidEmail = (email) =>
//     /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

//   const handleSendOtp = async () => {
//     if (!isValidEmail(email)) {
//       toast.error("Please enter a valid email address.");
//       return;
//     }

//     setLoading(true);
//     try {
//       await axios.post("/api/auth/send-otp", { email: email.toLowerCase() });
//       toast.success("OTP sent to your email.");
//       setOtpSent(true);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to send OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     if (!otp.match(/^\d{4,6}$/)) {
//       toast.error("Please enter a valid OTP.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.post("/api/auth/verify-otp", {
//         email: email.toLowerCase(),
//         otp,
//       });
//       toast.success(res.data.message || "Email verified successfully!");
//       setTimeout(() => navigate("/login"), 2000);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "OTP verification failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="verify-email-container max-w-md mx-auto p-6 bg-gray-200 rounded-lg">
//       <ToastContainer autoClose={4000} position="top-center" newestOnTop />
//       <h2 className="text-center font-medium text-xl py-4">Email Verification</h2>

//       {!otpSent ? (
//         <>
//           <label htmlFor="email" className="block mb-2 font-medium">
//             Enter your registered email:
//           </label>
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value.trim())}
//             placeholder="Enter your registered email"
//             required
//             disabled={otpSent}
//             className="w-full rounded-lg px-3 p-2 mb-4"
//           />
//           <button
//             type="button"
//             onClick={handleSendOtp}
//             disabled={loading}
//             className="btn w-full p-2 rounded-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white"
//           >
//             {loading ? "Sending OTP..." : "Send OTP"}
//           </button>
//         </>
//       ) : (
//         <form onSubmit={handleVerifyOtp} className="flex flex-col space-y-4">
//           <label htmlFor="otp" className="block font-medium">
//             Enter OTP sent to your email:
//           </label>
//           <input
//             type="text"
//             id="otp"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value.trim())}
//             placeholder="Enter OTP"
//             required
//             className="w-full rounded-lg px-3 p-2"
//           />
//           <button
//             type="submit"
//             disabled={loading}
//             className="btn p-2 rounded-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white"
//           >
//             {loading ? "Verifying..." : "Verify OTP"}
//           </button>
//           <button
//             type="button"
//             onClick={() => {
//               setOtpSent(false);
//               setOtp("");
//             }}
//             className="underline text-sm text-gray-600 hover:text-gray-800"
//           >
//             Resend OTP
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default VerifyEmail;


// src/pages/VerifyEmail.jsx
import  { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleSendOTP = async () => {
    try {
      if (!email) return toast.error("Email is required");
      const response = await axios.post("/api/auth/send-otp", { email });
      if (response.status === 200) {
        setOtpSent(true);
        toast.success("OTP sent to your email.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending OTP");
    }
  };

  const handleVerify = async () => {
    try {
      setVerifying(true);
      const response = await axios.post("/api/auth/verify-otp", { email, otp });
      if (response.status === 200) {
        toast.success("Email verified successfully");
        setOtp(""); // Clear input
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-xl font-bold mb-4">Email Verification</h2>

      <input
        type="email"
        placeholder="Enter your registered email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />
      <button
        onClick={handleSendOTP}
        className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
      >
        Send OTP
      </button>

      {otpSent && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 mt-4 mb-2 border rounded"
          />
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
          >
            {verifying ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}
    </div>
  );
};

export default VerifyEmail;
