import { useQuery } from "@apollo/client";
import { createContext, useContext, useMemo } from "react";
import { CURRENT_MEMBER } from "./graphql/getCurrentMember";

const MemberContext = createContext();

export const useSneakerMember = () => {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error("useSneakerMember must be used within a MemberProvider");
  }
  return context;
};

export const MemberProvider = ({ children }) => {
  const { data, loading, error, refetch } = useQuery(CURRENT_MEMBER, {
    fetchPolicy: "cache-first",
  });

  const member = useMemo(() => {
    if (loading || error) return null;
    return data?.currentMember || null;
  }, [data, loading, error]);

  return (
    <MemberContext.Provider value={{ member, loading, error, refetch }}>
      {children}
    </MemberContext.Provider>
  );
};