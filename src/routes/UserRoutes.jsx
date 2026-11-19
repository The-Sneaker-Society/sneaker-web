import { Routes, Route, Navigate } from "react-router-dom";
import UserSignupPage from "../pages/SignupPage/UserSIgnupPage";
import UserSettingsPage from "../pages/UpdateProfilePage/UserSettingsPage";
import { ContractForm } from "../pages/ContractForm/ContractForm";
import ReviewProtectPage from "../pages/ReviewProtect/ReviewProtectPage";
import UserContractPage from "../pages/ContractsPage/UserContractPage";
import { UserProvider } from "../context/UserContext";
import UserDashboard from "../pages/Dashboard/UserDashboard";
import Layout from "../components/Layout";
import { ChatDashboardUser } from "../pages/Chats/ChatDashboardUser";

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
          path="chats/:id"
          element={
            <Layout>
              <ChatDashboardUser />
            </Layout>
          }
        />

        <Route
          path="settings"
          element={
            <Layout>
              <UserSettingsPage />
            </Layout>
          }
        />

        <Route
          path="update-profile"
          element={<Navigate to="/user/settings" replace />}
        />

        <Route
          path="new-contract/:memberId"
          element={
            <Layout>
              <ContractForm />
            </Layout>
          }
        />

        <Route
          path="review-protect/:orderRef"
          element={
            <Layout>
              <ReviewProtectPage />
            </Layout>
          }
        />

        <Route
          path="contract/:orderRef"
          element={
            <Layout>
              <UserContractPage />
            </Layout>
          }
        />
      </Routes>
    </UserProvider>
  );
};

export default UserRoutes;
