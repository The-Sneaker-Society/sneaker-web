import React from "react";
import { Routes, Route } from "react-router-dom";
import { ContractReviewPage } from "../pages/ContractsPage/ContractReviewPage";
import { ContractPage } from "../pages/ContractsPage/Contracts";
import { Subscriptions } from "../pages/PaymentStatus/Subscriptions";
import SuccessPage from "../pages/PaymentStatus/SubscriptionSuccess";
import { MemberProvider } from "../context/MemberContext";
import { MemberDashboard } from "../pages/Dashboard/MemberDashboard";
import MemberSignupPage from "../pages/SignupPage/SignupPage";
import Layout from "../components/Layout";
import { ChatDashboardMember } from "../pages/Chats/ChatDashboardMember";
import { GenerateMember } from "../pages/GenerateMember/GenerateMember";
import { OnboardMember } from "../pages/OnboardMember/OnboardMember";

const MemberRoutes = () => {
  return (
    <MemberProvider>
      <Routes>
        <Route path="generate" element={<GenerateMember />} />
        <Route path="onboarding" element={<OnboardMember />} />
        <Route path="signup-info" element={<MemberSignupPage />} />
        <Route
          path="dashboard"
          element={
            <Layout>
              <MemberDashboard />
            </Layout>
          }
        />
        <Route
          path="chats/:id"
          element={
            <Layout>
              <ChatDashboardMember />
            </Layout>
          }
        />
        <Route
          path="contract/:id"
          element={
            <Layout>
              <ContractReviewPage />
            </Layout>
          }
        />
        <Route
          path="contracts"
          element={
            <Layout>
              <ContractPage />
            </Layout>
          }
        />
        <Route
          path="subscriptions"
          element={
            <Layout>
              <Subscriptions />
            </Layout>
          }
        />
        <Route
          path="subscription-success"
          element={
            <Layout>
              <SuccessPage />
            </Layout>
          }
        />
      </Routes>
    </MemberProvider>
  );
};

export default MemberRoutes;
