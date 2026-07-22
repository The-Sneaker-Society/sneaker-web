import { Box } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import { useSneakerMember } from "../context/MemberContext";
import { LoadingCircle } from "./LoadingCircle";

const OnboardingGuard = () => {
  const { member, loading } = useSneakerMember();

  if (loading) return <Box sx={{ width: "100%", height: "100vh", display: "flex" }}><LoadingCircle /></Box>;

  if (!member) {
    return <Navigate to="/member/generate" replace />;
  }

  if (!member.firstName) {
    return <Navigate to="/member/onboarding" replace />;
  }

  return <Outlet />;
};

export default OnboardingGuard;
