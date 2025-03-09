import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { LoadingCircle } from "./Loaing";
import Layout from "./Layout";

export const ProtectedRoute = ({
  redirectPath = "/login",
  children,
  withLayout = true, // Add a prop to control layout rendering
}) => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <LoadingCircle />;

  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  // Conditionally render the Layout component
  return withLayout ? <Layout>{children}</Layout> : children;
};