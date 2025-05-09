import React from "react";
import { Routes, Route } from "react-router-dom";
import UserSignupPage from "../pages/SignupPage/UserSIgnupPage";
import UpdateProfilePage from "../pages/UpdateProfilePage/UpdateProfilePage";
import { ContractForm } from "../pages/ContractForm/ContractForm";
import { UserProvider } from "../context/UserContext";
import UserDashboard from "../pages/Dashboard/UserDashboard";
import Layout from "../components/Layout";

const UserRoutes = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path="signup-info" element={<UserSignupPage />} />
        <Route
          path="dashboard"
          element={
            <Layout>
              <UserDashboard />
            </Layout>
          }
        />
        <Route
          path="update-profile"
          element={
            <Layout>
              <UpdateProfilePage />
            </Layout>
          }
        />
        <Route
          path="new-contract/:memberId"
          element={
            <Layout>
              <ContractForm />
            </Layout>
          }
        />
      </Routes>
    </UserProvider>
  );
};

export default UserRoutes;
