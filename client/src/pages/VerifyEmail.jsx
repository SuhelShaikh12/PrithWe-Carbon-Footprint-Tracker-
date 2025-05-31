


// import { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";

// const VerifyEmail = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   // Get userId from location state or localStorage (pass it after register)
//   const userId = location.state?.userId || localStorage.getItem("userId");

//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);

//   if (!userId) {
//     // No userId, redirect to register or login
//     navigate("/register");
//   }

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
//       // Clear stored userId if any
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
//       <form onSubmit={handleVerify} className="max-w-md mx-auto flex flex-col space-y-4 p-6 bg-gray-200 rounded-lg">
//         <input
//           type="text"
//           maxLength={6}
//           value={otp}
//           onChange={(e) => setOtp(e.target.value.replace(/\D/, ""))}
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

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId || localStorage.getItem("userId");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      navigate("/register");
    }
  }, [userId, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/verify-otp", { userId, otp });
      toast.success(res.data.message);
      localStorage.removeItem("userId");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-email-container">
      <ToastContainer autoClose={4000} position="top-center" newestOnTop />
      <h2 className="text-center font-medium text-xl py-4">Verify Your Email</h2>
      <form onSubmit={handleVerify} className="max-w-md mx-auto flex flex-col space-y-4 p-6 bg-gray-200 rounded-lg">
        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/, ""))}
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
    </div>
  );
};

export default VerifyEmail;
