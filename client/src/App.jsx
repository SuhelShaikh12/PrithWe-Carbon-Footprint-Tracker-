


// import { useEffect, useState } from "react";
// import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// import Layout from "./Layout";
// import Home from "./pages/Home";
// import ContactUs from "./pages/ContactUs";
// import Login from "./pages/Login";
// import Calculator from "./pages/Calculator";
// import AboutUs from "./pages/AboutUs";
// import Information from "./pages/Information";
// import ResetPassword from "./pages/ResetPassword";
// import History from "./pages/History";
// import AdminDashBoard from "./pages/AdminDashboard";
// import Tips from "./pages/Tips";
// import UserDetails from "./pages/UserDetails";
// import Spinner from "./components/Spinner";
// import Error from "./pages/Error";
// import ScrollToTop from "./components/ScrollToTop";
// import RegistrFom from "./components/RegistrFom"; // Registration component

// import axios from "axios";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./Scrollbar.css";

// function App() {
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkLoginStatus = async () => {
//       try {
//         const response = await axios.get("/api/auth/login/status", {
//           withCredentials: true,
//         });
//         setLoggedIn(response.status === 200);
//       } catch (error) {
//         setLoggedIn(false);
//         console.error("Error checking login status:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkLoginStatus();
//   }, []);

//   if (loading) {
//     return <Spinner setLoading={setLoading} />;
//   }

//   return (
//     <Router>
//       <ToastContainer autoClose={2000} position="top-center" newestOnTop />
//       <Layout setLoggedIn={setLoggedIn}>
//         <ScrollToTop />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/contactUs" element={<ContactUs />} />
//           <Route path="/aboutUs" element={<AboutUs />} />
//           <Route path="/information" element={<Information />} />
//           <Route path="/tips" element={<Tips />} />
//           <Route path="/resetPassword" element={<ResetPassword />} />
//           <Route path="/admin/user/:userId" element={<UserDetails />} />
//           <Route path="/dashboard" element={<AdminDashBoard />} />
//           {/* Registration route: After success, redirect to login page */}
//           <Route path="/register" element={<RegistrFom />} />
//           {/* Login route: if logged in redirect to calculator, else show login */}
//           <Route
//             path="/login"
//             element={
//               loggedIn ? <Navigate to="/calculator" /> : <Login setLoggedIn={setLoggedIn} />
//             }
//           />
//           {/* Protected routes only accessible if logged in */}
//           <Route
//             path="/calculator"
//             element={loggedIn ? <Calculator /> : <Navigate to="/login" />}
//           />
//           <Route
//             path="/history"
//             element={loggedIn ? <History /> : <Navigate to="/login" />}
//           />
//           <Route path="/logout" element={<Home />} />
//           <Route path="*" element={<Error />} />
//         </Routes>
//       </Layout>
//     </Router>
//   );
// }

// export default App;


// import { useEffect, useState } from "react";
// import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// import Layout from "./Layout";
// import Home from "./pages/Home";
// import ContactUs from "./pages/ContactUs";
// import Login from "./pages/Login";
// import Calculator from "./pages/Calculator";
// import AboutUs from "./pages/AboutUs";
// import Information from "./pages/Information";
// import ResetPassword from "./pages/ResetPassword";
// import History from "./pages/History";
// import AdminDashBoard from "./pages/AdminDashboard";
// import Tips from "./pages/Tips";
// import UserDetails from "./pages/UserDetails";
// import Spinner from "./components/Spinner";
// import Error from "./pages/Error";
// import ScrollToTop from "./components/ScrollToTop";
// import RegistrFom from "./components/RegistrFom";

// import axios from "axios";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./Scrollbar.css";

// function App() {
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkLoginStatus = async () => {
//       try {
//         const response = await axios.get("/api/auth/login/status", {
//           withCredentials: true,
//         });
//         setLoggedIn(response.status === 200);
//       } catch (error) {
//         setLoggedIn(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkLoginStatus();
//   }, []);

//   if (loading) {
//     return <Spinner setLoading={setLoading} />;
//   }

//   return (
//     <Router>
//       <ToastContainer autoClose={2000} position="top-center" newestOnTop />
//       <Layout setLoggedIn={setLoggedIn}>
//         <ScrollToTop />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/contactUs" element={<ContactUs />} />
//           <Route path="/aboutUs" element={<AboutUs />} />
//           <Route path="/information" element={<Information />} />
//           <Route path="/tips" element={<Tips />} />
//           <Route path="/resetPassword" element={<ResetPassword />} />
//           <Route path="/admin/user/:userId" element={<UserDetails />} />
//           <Route path="/dashboard" element={<AdminDashBoard />} />

//           {/* Registration: Redirect to login after successful registration */}
//           <Route path="/register" element={<RegistrFom />} />

//           {/* Login: Redirect to calculator if already logged in */}
//           <Route
//             path="/login"
//             element={
//               loggedIn ? <Navigate to="/calculator" /> : <Login setLoggedIn={setLoggedIn} />
//             }
//           />

//           {/* Protected routes */}
//           <Route
//             path="/calculator"
//             element={loggedIn ? <Calculator /> : <Navigate to="/login" />}
//           />
//           <Route
//             path="/history"
//             element={loggedIn ? <History /> : <Navigate to="/login" />}
//           />

//           <Route path="/logout" element={<Home />} />
//           <Route path="*" element={<Error />} />
//         </Routes>
//       </Layout>
//     </Router>
//   );
// }

// export default App;


import { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./Layout";
import Home from "./pages/Home";
import ContactUs from "./pages/ContactUs";
import LoginForm from "./components/LoginForm"; // ✅ Corrected import
import Calculator from "./pages/Calculator";
import AboutUs from "./pages/AboutUs";
import Information from "./pages/Information";
import ResetPassword from "./pages/ResetPassword";
import History from "./pages/History";
import AdminDashBoard from "./pages/AdminDashboard";
import Tips from "./pages/Tips";
import UserDetails from "./pages/UserDetails";
import Spinner from "./components/Spinner";
import Error from "./pages/Error";
import ScrollToTop from "./components/ScrollToTop";
import RegisterForm from "./components/RegisterForm"; // ✅ Correct import

import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Scrollbar.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get("/api/auth/login/status", {
          withCredentials: true,
        });
        setLoggedIn(response.status === 200);
      } catch (error) {
        setLoggedIn(false);
        console.error("Error checking login status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (loading) {
    return <Spinner setLoading={setLoading} />;
  }

  return (
    <Router>
      <ToastContainer autoClose={2000} position="top-center" newestOnTop />
      <Layout setLoggedIn={setLoggedIn}>
        <ScrollToTop />
        <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/contactUs" element={<ContactUs />} />
  <Route path="/aboutUs" element={<AboutUs />} />
  <Route path="/information" element={<Information />} />
  <Route path="/tips" element={<Tips />} />
  <Route path="/resetPassword" element={<ResetPassword />} />
  <Route path="/admin/user/:userId" element={<UserDetails />} />
  <Route path="/dashboard" element={<AdminDashBoard />} />
  <Route path="/register" element={<RegisterForm />} />
  <Route
    path="/login"
    element={
      loggedIn ? <Navigate to="/dashboard" /> : <LoginForm setLoggedIn={setLoggedIn} />
    }
  />

  {/* ✅ Calculator is now public */}
  <Route path="/calculator" element={<Calculator />} />

  {/* History is still protected */}
  <Route
    path="/history"
    element={loggedIn ? <History /> : <Navigate to="/login" />}
  />

  <Route path="/logout" element={<Home />} />
  <Route path="*" element={<Error />} />
</Routes>

      </Layout>
    </Router>
  );
}

export default App;
