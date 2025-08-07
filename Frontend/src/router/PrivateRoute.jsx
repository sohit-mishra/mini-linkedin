import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";

export default function PrivateRoute({ children }) {
  const { isLoggedIn, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="w-full p-4 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
