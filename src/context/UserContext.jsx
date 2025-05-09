import { useQuery } from "@apollo/client";
import { useUser } from "@clerk/clerk-react";
import { createContext, useContext, useMemo } from "react";
import { CURRENT_USER } from "./graphql/getCurrentUser";
import { CURRENT_MEMBER } from "./graphql/getCurrentMember";

const UserContext = createContext();

export const useSneakerUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useSneakerUser Error not used in context");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();

  const role = clerkUser?.unsafeMetadata.role;

  const { data, loading, error } = useQuery(
    role === "member" ? CURRENT_MEMBER : CURRENT_USER,
    {
      fetchPolicy: "cache-first", // Use cached data first, then fetch from the network if needed
    }
  );

  const user = useMemo(() => {
    if (loading || error) return null;
    return data?.currentUser || data?.currentMember || null;
  }, [data, loading, error]);

  const isSubscribed = useMemo(() => {
    if (loading || !clerkLoaded) return undefined; // Wait until both user and Clerk data are fully loaded
    if (user) {
      return user.isSubscribed || false;
    }
    return false;
  }, [user, loading, clerkLoaded]);

  return (
    <UserContext.Provider value={{ user, loading, error, role, isSubscribed }}>
      {children}
    </UserContext.Provider>
  );
};
