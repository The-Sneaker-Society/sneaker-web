import { Navigate } from "react-router-dom";
import { useSneakerMember } from "../context/MemberContext";
import { LoadingCircle } from "./LoadingCircle";

const SubscriptionRoute = ({ children }) => {
  const { member, loading } = useSneakerMember();

  if (loading) return <LoadingCircle />;

  if (member && !member.isSubscribed) {
    return <Navigate to="/member/subscriptions" replace />;
  }

  return <>{children}</>;
};

export default SubscriptionRoute;
