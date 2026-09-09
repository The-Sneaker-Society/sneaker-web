import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import AdminDisputeQueuePage from "../pages/Admin/AdminDisputeQueuePage";
import AdminDisputeDetailPage from "../pages/Admin/AdminDisputeDetailPage";

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
      <Route path="*" element={<Navigate to="disputes" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
