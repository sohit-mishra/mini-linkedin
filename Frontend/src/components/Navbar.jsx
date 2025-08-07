import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Logo from "@/assets/logo.svg";
import avatar from '@/assets/avatar.svg';
import { AuthContext } from "@/context/AuthContext";
import { showSuccess, showError } from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api"; 

export default function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const { setIsLoggedIn, setToken , setUserId} = useContext(AuthContext);
  const [data, setData] = useState({});


  const logout = async () => {
    try {
      const res = await api.post(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`
      );

      showSuccess(res.data.message);

      setIsLoggedIn(false);
      setToken(null);
      setUserId('');
      localStorage.removeItem("token");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      showError(err.response?.data?.error || "Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_API_URL}/api/auth/verify-token`
        );

        setData(response.data.user);
      } catch (error) {
        console.error("Error fetching admin details:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 w-full z-50 bg-white px-4 py-3 border-b shadow-sm flex items-center justify-between"
    >

      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="md:hidden">
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <img src={Logo} alt="logo" className="h-8 hidden md:block" />
      </div>

      <div className="flex items-center gap-2">
        <img
          src={data.avatar || avatar}
          alt="User Avatar"
          className="w-8 h-8 rounded-full object-cover border border-gray-300"
        />
        <span className="text-sm text-gray-800 hidden sm:inline">
          {data.name || "User"}
        </span>
        <button
          className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </motion.header>
  );
}
