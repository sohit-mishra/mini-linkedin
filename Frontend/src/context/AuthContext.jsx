import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");

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

        const user = response.data?.user;

        if (response.status === 200 && user?.id) {
          setToken(localToken);
          setIsLoggedIn(true);
          setUserId(user.id);
        } else {
          throw new Error("Invalid response");
        }
      } catch (error) {
        console.error("Token verification failed:", error.message);
        localStorage.removeItem("token");
        setToken("");
        setIsLoggedIn(false);
        setUserId("");
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
        if (!newToken) {
          setUserId("");
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full p-4 text-center">
        <p>Loading...</p>
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
        userId,
        setUserId,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
