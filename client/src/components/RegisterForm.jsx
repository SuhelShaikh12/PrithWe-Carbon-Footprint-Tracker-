import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import Logo from "../assets/google.png";

function RegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    type: "", // Household or Business
  });

  const [loading, setLoading] = useState(false);
  const [showCreatePass, setShowCreatePass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const { name, email, password, confirmPassword, type } = formData;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!name.match(/^[a-zA-Z ]+$/)) {
      toast.error("Name must contain only alphabets");
      return false;
    }
    if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      toast.error("Invalid email address");
      return false;
    }
    if (password.length < 6 || !password.match(/[!@#$%^&*(),.?":{}|<>]/)) {
      toast.error("Password must be at least 6 characters long and contain a special symbol");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    if (!type) {
      toast.error("Please select whether you are a Household or Business");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post("/api/auth/register", {
        name,
        email,
        password,
        type,
      });

      if (response.data.userId) {
        localStorage.setItem("userId", response.data.userId);
        toast.success("Sign up successful! Please verify your email.");
        setTimeout(() => navigate("/verifyEmail", { state: { userId: response.data.userId } }), 2000);
      }
    } catch (error) {
      console.error("Error registering user:", error.response || error);
      toast.error(error.response?.data?.message || "Error registering user");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!(type === "Household" || type === "Business")) {
      toast.warn("Please select Household or Business to sign up with Google");
      return;
    }
    window.location.href = `https://prithwe.onrender.com/auth/google?userType=${type}`;
  };

  return (
    <div className="register-container">
      <ToastContainer autoClose={4000} position="top-center" newestOnTop />
      <h2 className="text-center font-medium text-xl md:text-2xl py-4">Signup Form</h2>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 max-w-md mx-auto bg-gray-200 p-6 rounded-lg">
        <input
          type="text"
          name="name"
          value={name}
          placeholder="Enter Your Name"
          onChange={handleChange}
          required
          className="rounded-lg px-3 p-2 md:px-4 md:p-3"
        />

        <input
          type="email"
          name="email"
          value={email}
          placeholder="Enter Your Email ID"
          onChange={handleChange}
          required
          className="rounded-lg px-3 p-2 md:px-4 md:p-3"
        />

        <label className="relative">
          <input
            type={showCreatePass ? "text" : "password"}
            name="password"
            value={password}
            placeholder="Create a Password"
            onChange={handleChange}
            required
            className="w-full rounded-lg px-3 p-2 md:px-4 md:p-3"
            minLength={6}
          />
          <span
            onClick={() => setShowCreatePass(!showCreatePass)}
            className="absolute right-3 top-3 cursor-pointer z-10"
            aria-label="Toggle password visibility"
          >
            {showCreatePass ? (
              <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
            ) : (
              <AiOutlineEye fontSize={24} fill="#AFB2BF" />
            )}
          </span>
        </label>

        <label className="relative">
          <input
            type={showConfirmPass ? "text" : "password"}
            name="confirmPassword"
            value={confirmPassword}
            placeholder="Confirm Password"
            onChange={handleChange}
            required
            className="w-full rounded-lg px-3 p-2 md:px-4 md:p-3"
            minLength={6}
          />
          <span
            onClick={() => setShowConfirmPass(!showConfirmPass)}
            className="absolute right-3 top-3 cursor-pointer z-10"
            aria-label="Toggle confirm password visibility"
          >
            {showConfirmPass ? (
              <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
            ) : (
              <AiOutlineEye fontSize={24} fill="#AFB2BF" />
            )}
          </span>
        </label>

        <div className="p-3">
          I need to Calculate CF for: <br />
          <label className="inline-flex items-center mt-2">
            <input
              type="radio"
              name="type"
              value="Household"
              checked={type === "Household"}
              onChange={handleChange}
              required
              className="mr-2"
            />
            Household
          </label>
          <br />
          <label className="inline-flex items-center mt-2">
            <input
              type="radio"
              name="type"
              value="Business"
              checked={type === "Business"}
              onChange={handleChange}
              required
              className="mr-2"
            />
            Business
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn p-2 rounded-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400"
        >
          {loading ? "Registering..." : "Sign Up"}
        </button>

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="flex-shrink mx-4 text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="btn flex items-center justify-center p-2 rounded-full bg-blue-400 hover:bg-blue-600 mt-4"
        >
          <img src={Logo} alt="Google logo" className="w-6 h-6 mr-2" />
          Signup with Google
        </button>

        <div className="signIn text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-700 hover:underline">
            Login here
          </Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
