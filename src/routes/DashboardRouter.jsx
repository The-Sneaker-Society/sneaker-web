import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const DashboardRouter = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const role = user.unsafeMetadata?.role;
      if (role === "member") {
        navigate("/member/dashboard");
      } else if (role === "client") {
        navigate("/user/dashboard");
      } else {
        navigate("/error"); 
      }
    }
  }, [user, navigate]);

  return null;
};

export default DashboardRouter;
