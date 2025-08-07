import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [userId, setUserId] = useState('');


  useEffect(() => {
    const verifyToken = async () => {
      const localToken = localStorage.getItem("token");
      if (!localToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/verify-token`,
          {
            headers: {
              Authorization: `Bearer ${localToken}`,
            },
          }
        );


        if (response.status === 200) {
          setToken(localToken);
          setIsLoggedIn(true);
          setUserId(response.data.user.id)
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        setIsLoggedIn(false);
        localStorage.removeItem("token");
        setToken("");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "token") {
        const newToken = event.newValue || "";
        setToken(newToken);
        setIsLoggedIn(!!newToken);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full p-4">
        <div className="text-center mb-2">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        token,
        setToken,
        userId, setUserId
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
