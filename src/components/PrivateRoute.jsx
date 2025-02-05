import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUser } from "@clerk/clerk-react";

export const ProtectedRoute = ({ redirectPath = "/login", children }) => {

  const { user,isLoaded } = useUser();

  if (!isLoaded)
    return (
      <p className="loading">
        <span>Checking credentials, wait a moment...</span>
      </p>
    );

  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};
