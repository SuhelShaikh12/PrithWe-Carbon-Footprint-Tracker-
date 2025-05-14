

// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
// import Logo from "../assets/google.png"; // Adjust this path as needed

// function LoginForm() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [type, setType] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       if (!validateForm()) return;

//       const response = await axios.post("https://prithwe.onrender.com/login", {
//         email,
//         password,
//         type,
//       });

//       if (response.data.token) {
//         // Store the JWT token in localStorage
//         localStorage.setItem("token", response.data.token);

//         toast.success("Login successful!");
//         navigate("/dashboard"); // Adjust the route to the dashboard or wherever you want to go
//       }
//     } catch (error) {
//       console.error("Error logging in:", error.response || error);
//       if (error.response?.data) {
//         toast.error(error.response.data.message || "Error logging in");
//       } else {
//         toast.error("Error logging in");
//       }
//     }
//   };

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

//   const handleGoogleLogin = () => {
//     if (!(type === "Household" || type === "Business")) {
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
//           <h1 className="text-center font-medium text-xl md:text-2xl py-4">Login Form</h1>
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
//               <input
//                 type="radio"
//                 name="option"
//                 value="Household"
//                 onChange={(e) => setType(e.target.value)}
//                 required
//               />{" "}
//               Household
//               <br />
//               <input
//                 type="radio"
//                 name="option"
//                 value="Business"
//                 onChange={(e) => setType(e.target.value)}
//                 required
//               />{" "}
//               Business
//             </div>
//           </div>
//           <button
//             onClick={handleLogin}
//             className="btn p-2 rounded-full bg-green-500 hover:bg-green-600"
//           >
//             Login
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
// }

// export default LoginForm;


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import Logo from "../assets/google.png"; // Adjust this path as needed

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (!validateForm()) return;

      const response = await axios.post("https://prithwe.onrender.com/login", {
        email,
        password,
        type,
      }, { withCredentials: true }); // Ensures session cookie is sent/received

      if (response.data.sessionKey) {
        // Store the session key in a cookie
        document.cookie = `sessionKey=${response.data.sessionKey}; path=/; Secure; HttpOnly`;

        toast.success("Login successful!");
        navigate("/dashboard"); // Adjust the route to the dashboard or wherever you want to go
      }
    } catch (error) {
      console.error("Error logging in:", error.response || error);
      if (error.response?.data) {
        toast.error(error.response.data.message || "Error logging in");
      } else {
        toast.error("Error logging in");
      }
    }
  };

  const validateForm = () => {
    if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      toast.error("Invalid email address");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }

    if (!type) {
      toast.error("Please select whether you are a household or business");
      return false;
    }

    return true;
  };

  const handleGoogleLogin = () => {
    if (!(type === "Household" || type === "Business")) {
      toast.warn("Please select Household or Business to sign in with Google");
      return;
    }
    window.location.href = `https://prithwe.onrender.com/auth/google?userType=${type}`;
  };

  return (
    <div>
      <ToastContainer autoClose={4000} position="top-center" newestOnTop />
      <div className="login m-4 flex justify-center items-center space-x-2 my-16">
        <div className="loginBox flex flex-col bg-gray-200 p-5 md:p-10 space-y-3 rounded-lg justify-center">
          <h1 className="text-center font-medium text-xl md:text-2xl py-4">Login Form</h1>
          <div className="inputs flex flex-col space-y-2">
            <input
              type="email"
              className="username rounded-lg px-3 p-2 md:px-4 md:p-3"
              placeholder="Enter Your Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full password rounded-lg px-3 p-2 md:px-4 md:p-3"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer z-10"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
            </label>

            <div className="radioButtons p-3">
              I am logging in as: <br />
              <input
                type="radio"
                name="option"
                value="Household"
                onChange={(e) => setType(e.target.value)}
                required
              />{" "}
              Household
              <br />
              <input
                type="radio"
                name="option"
                value="Business"
                onChange={(e) => setType(e.target.value)}
                required
              />{" "}
              Business
            </div>
          </div>
          <button
            onClick={handleLogin}
            className="btn p-2 rounded-full bg-green-500 hover:bg-green-600"
          >
            Login
          </button>
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="flex-shrink mx-4 text-gray-400">or</span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>
          <button
            onClick={handleGoogleLogin}
            className="btn flex items-center justify-center p-2 rounded-full bg-blue-400 hover:bg-blue-600 mt-4"
          >
            <img src={Logo} alt="Google logo" className="w-6 h-6 mr-2" />
            Login with Google
          </button>
          <div className="signUp">
            Do not have an account?{" "}
            <Link to="/register" className="text-blue-700 hover:underline">
              Sign up here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
