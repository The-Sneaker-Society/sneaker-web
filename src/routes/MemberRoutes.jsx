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
import NewGroupPage from "../pages/GroupsPage/NewGroupPage";
import MySociety from "../pages/Dashboard/MySociety";
import Discover from "../pages/Dashboard/Discover";
import TheVault from "../pages/Vault/TheVault";
import ChatSidebar from "../pages/Chats/ChatSidebar";
import MemberSettings from "../pages/membersettings";
import PreviewContractPage from "../pages/ContractForm/PreviewContractPage";

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
        <Route
          path="groups"
          element={
            <Layout>
              <GroupsPage />
            </Layout>
          }
        />
        <Route
          path="groups/:id"
          element={
            <Layout>
              <NewGroupPage />
            </Layout>
          }
        />
        <Route
          path="my-society"
          element={
            <Layout>
              <MySociety />
            </Layout>
          }
        />
        <Route
          path="discover"
          element={
            <Layout>
              <Discover />
            </Layout>
          }
        />
        <Route
          path="the-vault"
          element={
            <Layout>
              <TheVault />
            </Layout>
          }
        />
        <Route
          path="messages"
          element={
            <Layout>
              <ChatSidebar />
            </Layout>
          }
        />
        <Route
          path="settings"
          element={
            <Layout>
              <MemberSettings />
            </Layout>
          }
        />
        <Route
          path="preview-contract"
          element={
            <Layout>
              <PreviewContractPage />
            </Layout>
          }
        />
      </Routes>
    </MemberProvider>
  );
};

export default MemberRoutes;
