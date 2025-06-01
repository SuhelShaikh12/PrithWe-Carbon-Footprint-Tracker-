

// // export default VerifyEmail;
// import { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const VerifyEmail = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const userId = location.state?.userId || localStorage.getItem("userId");

//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!userId) {
//       navigate("/register");
//     } else {
//       localStorage.setItem("userId", userId);
//       toast.success("OTP sent to your email. Please check.");
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
//       toast.success(res.data.message || "Email verified successfully!");
//       localStorage.removeItem("userId");
//       setTimeout(() => navigate("/login"), 2000);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to verify OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="verify-email-container">
//       <ToastContainer autoClose={4000} position="top-center" newestOnTop />
//       <h2 className="text-center font-medium text-xl py-4">Verify Your Email</h2>

//       <div className="max-w-md mx-auto flex flex-col space-y-4 p-6 bg-gray-200 rounded-lg">
//         <form onSubmit={handleVerify} className="flex flex-col space-y-4">
//           <input
//             type="text"
//             maxLength={6}
//             value={otp}
//             onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
//             placeholder="Enter 6-digit OTP"
//             required
//             className="rounded-lg px-3 p-2"
//           />
//           <button
//             type="submit"
//             disabled={loading}
//             className="btn p-2 rounded-full bg-green-500 hover:bg-green-600"
//           >
//             {loading ? "Verifying..." : "Verify OTP"}
//           </button>
//         </form>
//       </div>
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
  const userId = location.state?.userId || localStorage.getItem("userId");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60); // 60 seconds

  useEffect(() => {
    if (!userId) {
      navigate("/register");
    } else {
      localStorage.setItem("userId", userId);
      toast.info("An OTP has been sent to your email.");
    }
  }, [userId, navigate]);

  // Countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/verify-otp", { userId, otp });
      toast.success(res.data.message || "Email verified successfully!");
      localStorage.removeItem("userId");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/send-otp", { userId });
      toast.success(res.data.message || "OTP resent to your email");
      setResendTimer(60); // reset timer
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-email-container">
      <ToastContainer autoClose={4000} position="top-center" newestOnTop />
      <h2 className="text-center font-medium text-xl py-4">Verify Your Email</h2>

      <div className="max-w-md mx-auto flex flex-col space-y-4 p-6 bg-gray-200 rounded-lg">
        <form onSubmit={handleVerify} className="flex flex-col space-y-4">
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter 6-digit OTP"
            required
            className="rounded-lg px-3 p-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="btn p-2 rounded-full bg-green-500 hover:bg-green-600"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {resendTimer > 0 ? (
          <p className="text-center text-gray-600">Resend OTP in {resendTimer}s</p>
        ) : (
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={loading}
            className="text-blue-600 underline hover:text-blue-800 text-center"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
