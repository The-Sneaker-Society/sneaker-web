import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { LoadingCircle } from "./Loaing";

export const ProtectedRoute = ({ redirectPath = "/login", children }) => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <LoadingCircle />;

  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};
