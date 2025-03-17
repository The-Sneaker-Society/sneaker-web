import React from "react";
import UserDashboard from "./UserDashboard";
import { useSneakerUser } from "../../context/UserContext";
import { LoadingCircle } from "../../components/Loaing";
import { MemberDashboard } from "./MemberDashboard";
import { Box } from "@mui/material";

export const Dashboard = () => {
  const { role, loading } = useSneakerUser();

  if (loading)
    return (
      <Box sx={{ width: "100%" }}>
        <LoadingCircle />
      </Box>
    );

  if (role === "client") {
    return <UserDashboard />;
  }

  return <MemberDashboard />;
};

export default Dashboard;
