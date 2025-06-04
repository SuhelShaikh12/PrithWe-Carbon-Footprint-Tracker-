// import { useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// const VerifyEmail = () => {
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [verifying, setVerifying] = useState(false);
//   const [sending, setSending] = useState(false);

//   const handleSendOTP = async () => {
//     const trimmedEmail = email.trim().toLowerCase();

//     if (!trimmedEmail) {
//       return toast.error("Please enter your registered email");
//     }

//     setSending(true);

//     try {
//       const response = await axios.post("/api/auth/send-otp", {
//         email: trimmedEmail,
//       });

//       if (response.status === 200) {
//         setOtpSent(true);
//         toast.success("OTP sent to your email.");
//       }
//     } catch (error) {
//       const message =
//         error?.response?.data?.message || "Failed to send OTP. Please try again.";
//       toast.error(message);
//     } finally {
//       setSending(false);
//     }
//   };

//   const handleVerify = async () => {
//     if (!otp) return toast.error("Please enter the OTP");

//     setVerifying(true);

//     try {
//       const response = await axios.post("/api/auth/verify-otp", {
//         email: email.trim().toLowerCase(),
//         otp,
//       });

//       if (response.status === 200) {
//         toast.success("Email verified successfully!");
//         setOtp("");
//         setOtpSent(false);
//       }
//     } catch (error) {
//       const message =
//         error?.response?.data?.message || "OTP verification failed. Please try again.";
//       toast.error(message);
//     } finally {
//       setVerifying(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4 max-w-md">
//       <h2 className="text-2xl font-semibold mb-4 text-center">Email Verification</h2>

//       <input
//         type="email"
//         placeholder="Enter your registered email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         className="w-full p-3 mb-4 border border-gray-300 rounded"
//         disabled={otpSent}
//       />

//       {!otpSent && (
//         <button
//           onClick={handleSendOTP}
//           disabled={sending}
//           className={`w-full py-2 text-white rounded ${
//             sending ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
//           }`}
//         >
//           {sending ? "Sending OTP..." : "Send OTP"}
//         </button>
//       )}

//       {otpSent && (
//         <>
//           <input
//             type="text"
//             placeholder="Enter OTP"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             className="w-full p-3 mt-4 mb-2 border border-gray-300 rounded"
//           />

//           <button
//             onClick={handleVerify}
//             disabled={verifying}
//             className={`w-full py-2 text-white rounded ${
//               verifying ? "bg-green-300" : "bg-green-600 hover:bg-green-700"
//             }`}
//           >
//             {verifying ? "Verifying..." : "Verify OTP"}
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default VerifyEmail;




import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function VerifyEmail() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  // Send OTP to backend
  async function sendOtp() {
    console.log("Email entered:", email); // ✅ This logs what you're sending

    if (!email.trim()) {
      alert('⚠️ Please enter your registered email.');
      return;
    }

    try {
      const res = await fetch('/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setOtpSent(true);
        alert("✅ OTP sent to your email.");
      } else {
        const data = await res.json();
        alert(data.message || '❌ Failed to send OTP.');
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      alert('❌ Network error while sending OTP.');
    }
  }

  // Verify OTP
  async function verifyOtp() {
    if (!otp.trim()) {
      alert("⚠️ Please enter the OTP.");
      return;
    }

    try {
      const res = await fetch('/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      if (res.ok) {
        alert("✅ Email verified successfully.");
        navigate('/dashboard');
      } else {
        alert('❌ OTP is incorrect or expired.');
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      alert("❌ Network error while verifying OTP.");
    }
  }

  return (
    <div>
      <h2>Verify Email</h2>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Registered Email"
        disabled={otpSent}
      />
      {!otpSent && <button onClick={sendOtp}>Send OTP</button>}
      {otpSent && (
        <>
          <input
            type="text"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}
    </div>
  );
}

export default VerifyEmail;
