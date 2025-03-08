import React from "react";
import UserDashboard from "./UserDashboard";
import { useSneakerUser } from "../../context/UserContext";
import { LoadingCircle } from "../../components/Loaing";
import { MemberDashboard } from "./MemberDashboard";

export const Dashboard = () => {
  const { role, loading } = useSneakerUser();

  if (loading) return <LoadingCircle />;

  if (role === "client") {
    return <UserDashboard />;
  }

  return <MemberDashboard />;
};

export default Dashboard;
