import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { LoadingCircle } from "./Loaing";
import Layout from "./Layout";
import { Box } from "@mui/material";

export const ProtectedRoute = ({
  redirectPath = "/login",
  children,
  withLayout = true,
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

  return withLayout ? (
    <Layout>{children}</Layout>
  ) : (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        overflowY: "auto",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </Box>
  );
};
