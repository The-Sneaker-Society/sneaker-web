import React from "react";
import { Routes, Route } from "react-router-dom";
import { ContractReviewPage } from "../pages/ContractsPage/ContractReviewPage";
import { ContractPage } from "../pages/ContractsPage/Contracts";
import { Subscriptions } from "../pages/PaymentStatus/Subscriptions";
import SuccessPage from "../pages/PaymentStatus/SubscriptionSuccess";
import { MemberProvider } from "../context/MemberContext";
import { MemberDashboard } from "../pages/Dashboard/MemberDashboard";
import Layout from "../components/Layout";
import { ChatDashboardMember } from "../pages/Chats/ChatDashboardMember";
import { GenerateMember } from "../pages/GenerateMember/GenerateMember";
import { OnboardMember } from "../pages/OnboardMember/OnboardMember";
import GroupsPage from "../pages/Groups/Groups";
import SubscriptionRoute from "../components/SubscriptionRoute";

const MemberRoutes = () => {
  return (
    <MemberProvider>
      <Routes>
        <Route path="generate" element={<GenerateMember />} />
        <Route path="onboarding" element={<OnboardMember />} />
        <Route
          path="dashboard"
          element={
            <Layout>
              <SubscriptionRoute>
                <MemberDashboard />
              </SubscriptionRoute>
            </Layout>
          }
        />
        <Route
          path="chats/:id"
          element={
            <Layout>
              <SubscriptionRoute>
                <ChatDashboardMember />
              </SubscriptionRoute>
            </Layout>
          }
        />
        <Route
          path="contract/:id"
          element={
            <Layout>
              <SubscriptionRoute>
                <ContractReviewPage />
              </SubscriptionRoute>
            </Layout>
          }
        />
        <Route
          path="contracts"
          element={
            <Layout>
              <SubscriptionRoute>
                <ContractPage />
              </SubscriptionRoute>
            </Layout>
          }
        />
        {/* Excluded from guard — unsubscribed members need access to these */}
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
        <Route path="groups"
          element={
            <Layout>
              <SubscriptionRoute>
                <GroupsPage />
              </SubscriptionRoute>
            </Layout>
          }
        />
      </Routes>
    </MemberProvider>
  );
};

export default MemberRoutes;
