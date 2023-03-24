import { createContext, useEffect, useState } from "react";
import { redirect } from "react-router-dom";
import {
  onAuthStateHasChanged,
  singInWithGoogle,
  logOut,
} from "../auth/services";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState({ userId: null, status: "checking" });

  useEffect(() => {
    onAuthStateHasChanged(setSession);
  }, []);

  const checking = () =>
    setSession((prev) => ({ ...prev, status: "checking" }));

  const handleLogOut = async () => {
    logOut();
    setSession({ userId: null, status: "no-authenticated" });
  };

  const validateAuth = (userId) => {
    if (userId) return setSession({ userId, status: "authenticated" });
    handleLogOut();
  };

  const handleLoginWithGoogle = async () => {
    checking();
    const userId = await singInWithGoogle();
    validateAuth(userId);
  };

  // my changes with the handle login

  const handleLogin = async (email, password) => {
    checking();
    try {
      const userId = await signInWithEmailAndPassword(email, password);
      validateAuth(userId);
    } catch (error) {
      console.error("Error signing in", error);
      setSession({ userId: null, status: "no-authenticated" });
    }
  };

  return (
    <AuthContext.Provider
      value={{ ...session, handleLoginWithGoogle, handleLogOut, handleLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

