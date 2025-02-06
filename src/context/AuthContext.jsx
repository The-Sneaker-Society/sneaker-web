import { useMutation, useQuery } from "@apollo/client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { CURRENT_MEMBER } from "./graphql/getMemberById";
import { CURRENT_USER } from "./graphql/getCurrentUser";
import { useNavigate } from "react-router-dom";
import {
  getAdditionlInfo,
  signUpWithEmailPassword,
  signInWithEmailAndPass,
  signInWithGoogle,
  logOut,
} from "../auth/services";
import { CREATE_MEMBER } from "../pages/SignUpMemberPage/graphql/addMember";
import { CREATE_USER } from "../pages/SignUpMemberPage/graphql/addUser";
import {
  UPDATE_MEMBER,
  CHANGE_MEMBER_PASSWORD,
} from "../pages/UpdateProfilePage/graphql/updateMember";
import { update } from "lodash";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);
  const [authToken, setAuthToken] = useState(() =>
    localStorage.getItem("authToken")
  );

  const [updateMember] = useMutation(UPDATE_MEMBER, {
    onError: (error) => {
      console.error("Error updating member:", error);
      throw error;
    },
  });

  const [changeMemberPassword] = useMutation(CHANGE_MEMBER_PASSWORD, {
    onError: (error) => {
      console.error("Error changing password:", error);
      throw error;
    },
  });

  const {
    data: currentMemberData,
    error: currentMemberError,
    refetch: currentMemberRefetch,
  } = useQuery(CURRENT_MEMBER, {
    skip: !authToken || userType === "USER",
    onError: (error) => {
      console.error("Error fetching current member:", error);
      if (error.message.includes("unauthorized")) {
        handleTokenError();
      }
    },
  });

  const {
    data: currentUserData,
    error: currentUserError,
    refetch: currentUserRefetch,
  } = useQuery(CURRENT_USER, {
    skip: !authToken || userType === "MEMBER",
    onError: (error) => {
      console.error("Error fetching current user:", error);
      if (error.message.includes("unauthorized")) {
        handleTokenError();
      }
    },
  });

  const [createMember] = useMutation(CREATE_MEMBER, {
    onError: (error) => {
      console.error("Error creating member:", error);
      throw error;
    },
  });

  const [createUser] = useMutation(CREATE_USER, {
    onError: (error) => {
      console.error("Error creating user:", error);
      throw error;
    },
  });

  const handleTokenError = () => {
    localStorage.removeItem("authToken");
    setAuthToken(null);
    setUser(null);
    navigate("/login");
  };

  const setToken = async (firebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken();
      localStorage.setItem("authToken", token);
      setAuthToken(token);
      return token;
    } catch (error) {
      console.error("Error setting token:", error);
      handleTokenError();
      throw error;
    }
  };

  const refetchUser = async () => {
    setLoading(true);
    try {
      const { data: memberData } = await currentMemberRefetch();
      if (memberData?.currentMember) {
        setUser(memberData.currentMember);
        setUserType("MEMBER");
        setLoading(false);
        return;
      }

      const { data: userData } = await currentUserRefetch();
      if (userData?.currentUser) {
        setUser(userData.currentUser);
        setUserType("USER");
      }
    } catch (error) {
      console.error("Error refetching user:", error);
      handleTokenError();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const determineUserType = async () => {
      if (!authToken) {
        setLoading(false);
        return;
      }

      // Check for member first
      if (currentMemberData?.currentMember) {
        setUser(currentMemberData.currentMember);
        setUserType("MEMBER");
        setLoading(false);
        return;
      }

      // Only check for user if not a member
      if (currentUserData?.currentUser) {
        setUser(currentUserData.currentUser);
        setUserType("USER");
      }

      setLoading(false);
    };

    determineUserType();
  }, [currentMemberData, currentUserData, authToken]);

  useEffect(() => {
    if (
      currentMemberError?.message.includes("unauthorized") ||
      currentUserError?.message.includes("unauthorized")
    ) {
      handleTokenError();
    }
  }, [currentMemberError, currentUserError]);

  const handleGoogleLogin = async (userType) => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      const moreInfo = getAdditionlInfo(result);
      const { user: firebaseUser } = result;

      if (!firebaseUser) throw new Error("No user returned from Google login");

      await setToken(firebaseUser);

      if (moreInfo.isNewUser && userType === "MEMBER") {
        await createMember({
          variables: {
            data: {
              firebaseId: firebaseUser.uid,
              email: firebaseUser.email,
            },
          },
        });
      }

      if (moreInfo.isNewUser && userType === "USER") {
        await createUser({
          variables: {
            data: {
              firebaseId: firebaseUser.uid,
              email: firebaseUser.email,
            },
          },
        });
      }

      await refetchUser();
      return firebaseUser;
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignupWithEmailAndPassword = async (
    email,
    password,
    userType
  ) => {
    setLoading(true);
    try {
      const firebaseUser = await signUpWithEmailPassword(email, password);
      await setToken(firebaseUser);

      if (userType === "MEMBER") {
        await createMember({
          variables: {
            data: {
              firebaseId: firebaseUser.uid,
              email: firebaseUser.email,
            },
          },
        });
      }

      if (userType === "USER") {
        console.log("creating user");
        await createUser({
          variables: {
            data: {
              firebaseId: firebaseUser.uid,
              email: firebaseUser.email,
            },
          },
        });
      }

      await refetchUser();
      return firebaseUser;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithEmailAndPass = async (email, password) => {
    setLoading(true);
    try {
      const firebaseUser = await signInWithEmailAndPass(email, password);
      console.log(firebaseUser);
      await setToken(firebaseUser);

      await refetchUser();
      return firebaseUser;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logOut();
      localStorage.removeItem("authToken");
      setAuthToken(null);
      setUser(null);
      setUserType(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (profileData) => {
    setLoading(true);
    try {
      const { data } = await updateMember({
        variables: { data: profileData },
      });
      await refetchUser();
      return data.updateMember;
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    try {
      const { data } = await changeMemberPassword({
        variables: { data: { currentPassword, newPassword } },
      });
      return data.changeMemberPassword;
    } catch (error) {
      console.error("Password change error", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Handle Member Data
    if (currentMemberData?.currentMember) {
      setUser(currentMemberData.currentMember);
    } else if (currentMemberError) {
      console.error("Error fetching current member:", currentMemberError);
      if (currentMemberError.message.includes("unauthorized")) {
        handleTokenError();
      }
    }

    // Handle User Data
    if (currentUserData?.currentUser) {
      setUser(currentUserData.currentUser);
    } else if (currentUserError) {
      console.error("Error fetching current user:", currentUserError);
      if (currentUserError.message.includes("unauthorized")) {
        handleTokenError();
      }
    }

    // Set loading to false after processing both queries
    setLoading(false);
  }, [
    currentUserData,
    currentUserError,
    currentMemberData,
    currentMemberError,
  ]);

  const value = {
    user,
    loading,
    userType,
    isAuthenticated: !!user && !!authToken,
    refetchUser,
    handleLoginWithEmailAndPass,
    handleSignupWithEmailAndPassword,
    handleGoogleLogin,
    handleLogout,
    handleUpdateProfile,
    handleChangePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


export default AuthProvider;
