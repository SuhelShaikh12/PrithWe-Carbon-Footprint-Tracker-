


// import  { useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// const RegistrFom = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     type: "user",
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const { name, email, password, type } = formData;
//     if (!name || !email || !password || !type) {
//       return toast.error("Please fill in all fields.");
//     }

//     try {
//       await axios.post("/api/auth/register", formData);
//       toast.success("Registered successfully. Please verify your email.");
//       navigate("/verify-email");
//     } catch (error) {
//       const message = error.response?.data?.message || "Registration failed";
//       toast.error(message);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Register</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           name="name"
//           type="text"
//           placeholder="Name"
//           value={formData.name}
//           onChange={handleChange}
//           className="w-full p-2 mb-3 border rounded"
//         />
//         <input
//           name="email"
//           type="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           className="w-full p-2 mb-3 border rounded"
//         />
//         <input
//           name="password"
//           type="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           className="w-full p-2 mb-3 border rounded"
//         />
//         <select
//           name="type"
//           value={formData.type}
//           onChange={handleChange}
//           className="w-full p-2 mb-4 border rounded"
//         >
//           <option value="user">User</option>
//           <option value="admin">Admin</option>
//         </select>
//         <button
//           type="submit"
//           className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
//         >
//           Register
//         </button>
//       </form>
//     </div>
//   );
// };

// export default RegistrFom;



import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function RegistrFom() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState(""); // "Household" or "Business"
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!name || !email || !password || !type) {
      toast.error("Please fill all fields");
      return false;
    }
    if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      toast.error("Invalid email");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be 6+ characters");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const res = await axios.post(
        "/api/auth/register",
        { name, email, password, type },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      navigate("/login"); // Redirect to login after success
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Your form inputs */}
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
      />
      <select value={type} onChange={e => setType(e.target.value)}>
        <option value="">Select User Type</option>
        <option value="Household">Household</option>
        <option value="Business">Business</option>
      </select>
      <button onClick={handleRegister} disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
    </div>
  );
}

export default RegistrFom;
