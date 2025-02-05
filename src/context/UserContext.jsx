import { useUser } from "@clerk/clerk-react";
import { createContext, useContext } from "react";

const UserContext = createContext();

export const useSneakerUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useSneakerUser Error not used in context");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const { user } = useUser();

  const values = { email: "", id: "", role: "" };
  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};
