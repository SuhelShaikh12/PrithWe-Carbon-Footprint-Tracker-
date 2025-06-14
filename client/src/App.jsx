import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './Layout';
import Home from './pages/Home';
import ContactUs from './pages/ContactUs';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm'
import Calculator from './pages/Calculator';
import AboutUs from './pages/AboutUs';
import Information from './pages/Information';
import ResetPassword from './pages/ResetPassword';
import History from './pages/History';
import AdminDashBoard from './pages/AdminDashboard';
import Tips from './pages/Tips';
import UserDetails from './pages/UserDetails';
import Spinner from './components/Spinner';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Router>
      <ToastContainer autoClose={2000} position="top-center" newestOnTop />
      <Layout setLoggedIn={setLoggedIn}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/contactUs" element={<ContactUs />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/information" element={<Information />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/calculator" element={<Calculator />} />
          
          {/* Auth routes */}
          <Route path="/register" element={<RegisterForm />} />
          <Route
            path="/login"
            element={
              loggedIn ? <Navigate to="/dashboard" /> : <LoginForm setLoggedIn={setLoggedIn} />
            }
          />
          <Route path="/resetPassword" element={<ResetPassword />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={loggedIn ? <AdminDashBoard /> : <Navigate to="/login" />}
          />
          <Route
            path="/history"
            element={loggedIn ? <History /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/user/:userId"
            element={loggedIn ? <UserDetails /> : <Navigate to="/login" />}
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;