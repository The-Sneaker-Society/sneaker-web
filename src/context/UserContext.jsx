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
  // const test = clerkUser.unsafeMetadata;

  const role = clerkUser?.unsafeMetadata.role;

  const { data, loading, error } = useQuery(
    role === "member" ? CURRENT_MEMBER : CURRENT_USER
  );

  const user = useMemo(() => {
    if (loading || error) return null;
    return data?.currentUser || data?.currentMember || null;
  }, [data, loading, error]);

  return (
    <UserContext.Provider value={{ user, loading, error, role }}>
      {children}
    </UserContext.Provider>
  );
};
