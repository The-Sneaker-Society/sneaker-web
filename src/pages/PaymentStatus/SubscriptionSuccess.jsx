import React, { useEffect, useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { Navigate } from "react-router-dom";

const SYNC_STRIPE_DATA = gql`
  mutation SyncStripeData {
    syncStripeData {
      success
    }
  }
`;

const SuccessPage = () => {
  const [syncStatus, setSyncStatus] = useState("pending");
  const [syncStripeDataMutation] = useMutation(SYNC_STRIPE_DATA);

  useEffect(() => {
    const syncStripeData = async () => {
      try {
        const { data } = await syncStripeDataMutation({
          onCompleted: () => {
            setSyncStatus("success");
          },
        });

        if (!data.syncStripeData.success) {
          throw new Error("Failed to sync Stripe data.");
        }
      } catch (error) {
        console.error("Error syncing Stripe data:", error);
        setSyncStatus("error");
      }
    };

    syncStripeData();
  }, [syncStripeDataMutation]);

  if (syncStatus === "pending") {
    return <div>Syncing Stripe data...</div>;
  }

  if (syncStatus === "success") {
    return <Navigate to="/dashboard" replace />;
  }

  if (syncStatus === "error") {
    return <div>Error syncing Stripe data. Please try again.</div>;
  }

  return null;
};

export default SuccessPage;
