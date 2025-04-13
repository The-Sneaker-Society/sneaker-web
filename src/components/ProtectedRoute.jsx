import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { LoadingCircle } from "./Loaing";
import Layout from "./Layout";
import { useSneakerUser } from "../context/UserContext";
import { Box } from "@mui/material";

export const ProtectedRoute = ({
  redirectPath = "/login",
  children,
  withLayout = true,
  subscriptionRequired = false,
}) => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { role, isSubscribed, loading: sneakerLoading } = useSneakerUser();

  const combinedLoading = !clerkLoaded || sneakerLoading;

  if (combinedLoading) {
    return <LoadingCircle />;
  }

  if (!clerkUser) {
    return <Navigate to={redirectPath} replace />;
  }

  if (subscriptionRequired && role === "member" && !isSubscribed) {
    return <Navigate to="/member/subscriptions" replace />;
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
