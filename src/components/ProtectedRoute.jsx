import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { LoadingCircle } from "./Loaing";
import { Box } from "@mui/material";

export const ProtectedRoute = ({
  redirectPath = "/login",
  children,
  requireRole = null, // Default to null, making it optional
}) => {
  const { user: clerkUser, isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <LoadingCircle />;
  }

  if (!isSignedIn) {
    return <Navigate to={redirectPath} replace />;
  }

  if (requireRole) {
    const userRole = clerkUser?.unsafeMetadata?.role;
    const allowedRoles = Array.isArray(requireRole) ? requireRole : [requireRole];

    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};
