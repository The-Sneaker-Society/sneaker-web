import { useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";

export const LogoutPage = () => {
  const { signOut } = useClerk();

  const handleLogoutPage = () => {
    signOut();
  };

  useEffect(() => {
    handleLogoutPage();
  }, []);

  return null;
};
