


// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";

// function RegisterForm() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [type, setType] = useState(""); // Household or Business
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const validateForm = () => {
//     if (!name || !email || !password || !type) {
//       toast.error("Please fill in all fields");
//       return false;
//     }
//     if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
//       toast.error("Invalid email format");
//       return false;
//     }
//     if (password.length < 6) {
//       toast.error("Password must be at least 6 characters");
//       return false;
//     }
//     return true;
//   };

//   const handleRegister = async () => {
//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       const res = await axios.post(
//         "/api/auth/register",
//         { name, email, password, type },
//         { withCredentials: true }
//       );
//       toast.success(res.data.message || "Registration successful!");
//       navigate("/login"); // Redirect to login after registration
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         value={name}
//         onChange={e => setName(e.target.value)}
//         placeholder="Name"
//         autoComplete="name"
//       />
//       <input
//         type="email"
//         value={email}
//         onChange={e => setEmail(e.target.value)}
//         placeholder="Email"
//         autoComplete="email"
//       />
//       <input
//         type="password"
//         value={password}
//         onChange={e => setPassword(e.target.value)}
//         placeholder="Password"
//         autoComplete="new-password"
//       />
//       <select value={type} onChange={e => setType(e.target.value)}>
//         <option value="">Select User Type</option>
//         <option value="Household">Household</option>
//         <option value="Business">Business</option>
//       </select>
//       <button onClick={handleRegister} disabled={loading}>
//         {loading ? "Registering..." : "Register"}
//       </button>
//     </div>
//   );
// }

// export default RegisterForm;



// RegisterForm.jsx (upon success, redirect to /verify-email)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    // Call backend to register user
    const res = await fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, type: 'user' }),
    });
    if (res.ok) {
      // Redirect to verify email page on success
      navigate('/verify-email');
    } else {
      // handle error (e.g. show message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterForm;
