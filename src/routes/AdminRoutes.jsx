import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import AdminDisputeQueuePage from "../pages/Admin/AdminDisputeQueuePage";
import AdminDisputeDetailPage from "../pages/Admin/AdminDisputeDetailPage";
import AdminContractsPage from "../pages/Admin/AdminContractsPage";
import AdminContractDetailPage from "../pages/Admin/AdminContractDetailPage";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="disputes"
        element={
          <Layout>
            <AdminDisputeQueuePage />
          </Layout>
        }
      />
      <Route
        path="disputes/:orderRef"
        element={
          <Layout>
            <AdminDisputeDetailPage />
          </Layout>
        }
      />
      <Route
        path="contracts"
        element={
          <Layout>
            <AdminContractsPage />
          </Layout>
        }
      />
      <Route
        path="contracts/:orderRef"
        element={
          <Layout>
            <AdminContractDetailPage />
          </Layout>
        }
      />
      <Route path="*" element={<Navigate to="disputes" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
