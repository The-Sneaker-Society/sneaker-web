import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSneakerUser } from "../context/UserContext";

export const Blockers = () => {
  const navigate = useNavigate();
  const { role, isLoading, isSubscribed } = useSneakerUser();

  useEffect(() => {
    if (isLoading || isSubscribed === undefined) return; // Wait until the user and subscription status are fully loaded

    console.log("Current role:", { role });

    if (role === "member" && !isSubscribed) {
      navigate("member/subscriptions", { replace: true });
    }
  }, [role, isLoading, navigate, isSubscribed]);

  return null;
};
