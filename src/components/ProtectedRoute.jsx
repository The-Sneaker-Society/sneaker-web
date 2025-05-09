import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { LoadingCircle } from "./Loaing";
import { Box } from "@mui/material";

export const ProtectedRoute = ({
  redirectPath = "/login",
  children,
  requireMember = false,
}) => {
  const { user: clerkUser, isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <LoadingCircle />;
  }

  if (!isSignedIn) {
    return <Navigate to={redirectPath} replace />;
  }

  if (requireMember && clerkUser?.publicMetadata?.role !== "member") {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};
