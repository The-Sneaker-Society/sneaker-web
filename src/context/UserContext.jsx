import { useQuery } from "@apollo/client";
import { useUser } from "@clerk/clerk-react";
import { createContext, useContext, useMemo } from "react";
import { CURRENT_USER } from "./graphql/getCurrentUser";

const UserContext = createContext();

export const useSneakerUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useSneakerUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();

  const { data, loading, error } = useQuery(CURRENT_USER, {
    fetchPolicy: "cache-first",
  });

  const user = useMemo(() => {
    if (loading || error) return null;
    return data?.currentUser || null;
  }, [data, loading, error]);

  return (
    <UserContext.Provider value={{ user, loading, error, clerkUser, clerkLoaded }}>
      {children}
    </UserContext.Provider>
  );
};
