


// // import { useState } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import { ToastContainer, toast } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";
// // import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
// // import Logo from "../assets/google.png";

// // const LoginForm = () => {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [type, setType] = useState("");
// //   const [showPassword, setShowPassword] = useState(false);
// //   const navigate = useNavigate();

// //   const validateForm = () => {
// //     if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
// //       toast.error("Invalid email address");
// //       return false;
// //     }
// //     if (password.length < 6) {
// //       toast.error("Password must be at least 6 characters long");
// //       return false;
// //     }
// //     if (!type) {
// //       toast.error("Please select whether you are a household or business");
// //       return false;
// //     }
// //     return true;
// //   };

// //   const handleLogin = async () => {
// //     if (!validateForm()) return;

// //     try {
// //       const response = await axios.post(
// //         "https://prithwe.onrender.com/login",
// //         { email, password, type },
// //         { withCredentials: true } // important for sending cookies to backend
// //       );

// //       // Backend response format: { message: 'Login successful', user: {...} }
// //       toast.success(response.data.message || "Login successful!");
// //       navigate("/dashboard"); // redirect after login

// //     } catch (error) {
// //       console.error("Login error:", error.response || error);
// //       toast.error(
// //         error.response?.data?.message || "Error logging in. Please try again."
// //       );
// //     }
// //   };

// //   const handleGoogleLogin = () => {
// //     if (type !== "Household" && type !== "Business") {
// //       toast.warn("Please select Household or Business to sign in with Google");
// //       return;
// //     }
// //     window.location.href = `https://prithwe.onrender.com/auth/google?userType=${type}`;
// //   };

// //   return (
// //     <div>
// //       <ToastContainer autoClose={4000} position="top-center" newestOnTop />
// //       <div className="login m-4 flex justify-center items-center space-x-2 my-16">
// //         <div className="loginBox flex flex-col bg-gray-200 p-5 md:p-10 space-y-3 rounded-lg justify-center">
// //           <h1 className="text-center font-medium text-xl md:text-2xl py-4">
// //             Login Form
// //           </h1>

// //           <div className="inputs flex flex-col space-y-2">
// //             <input
// //               type="email"
// //               className="username rounded-lg px-3 p-2 md:px-4 md:p-3"
// //               placeholder="Enter Your Email ID"
// //               value={email}
// //               onChange={(e) => setEmail(e.target.value)}
// //               required
// //             />

// //             <label className="relative">
// //               <input
// //                 type={showPassword ? "text" : "password"}
// //                 className="w-full password rounded-lg px-3 p-2 md:px-4 md:p-3"
// //                 placeholder="Enter Password"
// //                 value={password}
// //                 onChange={(e) => setPassword(e.target.value)}
// //                 required
// //               />
// //               <span
// //                 onClick={() => setShowPassword(!showPassword)}
// //                 className="absolute right-3 top-3 cursor-pointer z-10"
// //                 aria-label="Toggle password visibility"
// //               >
// //                 {showPassword ? (
// //                   <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
// //                 ) : (
// //                   <AiOutlineEye fontSize={24} fill="#AFB2BF" />
// //                 )}
// //               </span>
// //             </label>

// //             <div className="radioButtons p-3">
// //               I am logging in as: <br />
// //               <label>
// //                 <input
// //                   type="radio"
// //                   name="option"
// //                   value="Household"
// //                   checked={type === "Household"}
// //                   onChange={(e) => setType(e.target.value)}
// //                   required
// //                 />{" "}
// //                 Household
// //               </label>
// //               <br />
// //               <label>
// //                 <input
// //                   type="radio"
// //                   name="option"
// //                   value="Business"
// //                   checked={type === "Business"}
// //                   onChange={(e) => setType(e.target.value)}
// //                   required
// //                 />{" "}
// //                 Business
// //               </label>
// //             </div>
// //           </div>

// //           <button
// //             onClick={handleLogin}
// //             className="btn p-2 rounded-full bg-green-500 hover:bg-green-600"
// //           >
// //             Login
// //           </button>

// //           <div className="relative flex py-5 items-center">
// //             <div className="flex-grow border-t border-gray-400"></div>
// //             <span className="flex-shrink mx-4 text-gray-400">or</span>
// //             <div className="flex-grow border-t border-gray-400"></div>
// //           </div>

// //           <button
// //             onClick={handleGoogleLogin}
// //             className="btn flex items-center justify-center p-2 rounded-full bg-blue-400 hover:bg-blue-600 mt-4"
// //           >
// //             <img src={Logo} alt="Google logo" className="w-6 h-6 mr-2" />
// //             Login with Google
// //           </button>

// //           <div className="signUp">
// //             Do not have an account?{" "}
// //             <Link to="/register" className="text-blue-700 hover:underline">
// //               Sign up here
// //             </Link>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default LoginForm;


// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
// import Logo from "../assets/google.png";

// const LoginForm = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [type, setType] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const validateForm = () => {
//     if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
//       toast.error("Invalid email address");
//       return false;
//     }
//     if (password.length < 6) {
//       toast.error("Password must be at least 6 characters long");
//       return false;
//     }
//     if (!type) {
//       toast.error("Please select whether you are a household or business");
//       return false;
//     }
//     return true;
//   };

//   const handleLogin = async () => {
//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       const response = await axios.post(
//         "https://prithwe.onrender.com/login",
//         { email, password, type },
//         { withCredentials: true }
//       );

//       toast.success(response.data.message || "Login successful!");
//       navigate("/dashboard");
//     } catch (error) {
//       console.error("Login error:", error.response || error);
//       toast.error(
//         error.response?.data?.message || "Error logging in. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = () => {
//     if (type !== "Household" && type !== "Business") {
//       toast.warn("Please select Household or Business to sign in with Google");
//       return;
//     }
//     window.location.href = `https://prithwe.onrender.com/auth/google?userType=${type}`;
//   };

//   return (
//     <div>
//       <ToastContainer autoClose={4000} position="top-center" newestOnTop />
//       <div className="login m-4 flex justify-center items-center space-x-2 my-16">
//         <div className="loginBox flex flex-col bg-gray-200 p-5 md:p-10 space-y-3 rounded-lg justify-center">
//           <h1 className="text-center font-medium text-xl md:text-2xl py-4">
//             Login Form
//           </h1>

//           <div className="inputs flex flex-col space-y-2">
//             <input
//               type="email"
//               className="username rounded-lg px-3 p-2 md:px-4 md:p-3"
//               placeholder="Enter Your Email ID"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />

//             <label className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 className="w-full password rounded-lg px-3 p-2 md:px-4 md:p-3"
//                 placeholder="Enter Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <span
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-3 cursor-pointer z-10"
//                 aria-label="Toggle password visibility"
//               >
//                 {showPassword ? (
//                   <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
//                 ) : (
//                   <AiOutlineEye fontSize={24} fill="#AFB2BF" />
//                 )}
//               </span>
//             </label>

//             <div className="radioButtons p-3">
//               I am logging in as: <br />
//               <label>
//                 <input
//                   type="radio"
//                   name="option"
//                   value="Household"
//                   checked={type === "Household"}
//                   onChange={(e) => setType(e.target.value)}
//                   required
//                 />{" "}
//                 Household
//               </label>
//               <br />
//               <label>
//                 <input
//                   type="radio"
//                   name="option"
//                   value="Business"
//                   checked={type === "Business"}
//                   onChange={(e) => setType(e.target.value)}
//                   required
//                 />{" "}
//                 Business
//               </label>
//             </div>
//           </div>

//           <button
//             onClick={handleLogin}
//             disabled={loading}
//             className={`btn p-2 rounded-full ${
//               loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
//             }`}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>

//           <div className="relative flex py-5 items-center">
//             <div className="flex-grow border-t border-gray-400"></div>
//             <span className="flex-shrink mx-4 text-gray-400">or</span>
//             <div className="flex-grow border-t border-gray-400"></div>
//           </div>

//           <button
//             onClick={handleGoogleLogin}
//             className="btn flex items-center justify-center p-2 rounded-full bg-blue-400 hover:bg-blue-600 mt-4"
//           >
//             <img src={Logo} alt="Google logo" className="w-6 h-6 mr-2" />
//             Login with Google
//           </button>

//           <div className="signUp">
//             Do not have an account?{" "}
//             <Link to="/register" className="text-blue-700 hover:underline">
//               Sign up here
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginForm;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function LoginForm({ setLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState(""); // add user type state
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email || !password || !type) {
      toast.error("Please fill in email, password, and select user type");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await axios.post(
        "/api/auth/login",
        { email, password, type },  // send type as well
        { withCredentials: true }
      );
      toast.success(res.data.message || "Login successful!");
      setLoggedIn(true);
      navigate("/calculator"); // Redirect to calculator or dashboard
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      setLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        autoComplete="email"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        autoComplete="current-password"
      />
      <select value={type} onChange={e => setType(e.target.value)}>
        <option value="">Select User Type</option>
        <option value="Household">Household</option>
        <option value="Business">Business</option>
      </select>
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}

export default LoginForm;

