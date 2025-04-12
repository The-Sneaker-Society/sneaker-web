import React, { useEffect, useState } from "react";
import { useMutation, gql } from "@apollo/client";

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
        const { data } = await syncStripeDataMutation();

        if (!data.syncStripeData.success) {
          throw new Error("Failed to sync Stripe data.");
        }

        setSyncStatus("success");
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
    return <div>Sync successful! You will be redirected shortly.</div>; // Add redirection here
  }

  if (syncStatus === "error") {
    return <div>Error syncing Stripe data. Please try again.</div>;
  }

  return null;
};

export default SuccessPage;
