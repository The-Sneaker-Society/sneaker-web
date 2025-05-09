import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useSneakerUser } from "../../context/UserContext";
import { ActivateSubscription } from "./ActivateSubscription";
import { CancelSubscription } from "./CancelSubscription";
import { NewSubscription } from "./NewSubscription";
import { LoadingCircle } from "../../components/Loaing";

export const Subscriptions = () => {
  const { user, isSubscribed, loading } = useSneakerUser();
  const [subscriptionState, setSubscriptionState] = useState("loading");

  // Determine subscription state
  useEffect(() => {
    if (user) {
      if (isSubscribed && user.stripeCustomerId) {
        setSubscriptionState("active");
      } else if (!isSubscribed && user.stripeCustomerId) {
        setSubscriptionState("previously_active");
      } else {
        setSubscriptionState("none");
      }
    } else {
      setSubscriptionState("none");
    }
  }, [user, isSubscribed]);

  const renderSubscriptionContent = (state) => {
    switch (state) {
      case "previously_active":
        return <ActivateSubscription />;
      case "active":
        return <CancelSubscription />;
      case "none":
        return <NewSubscription />;
      default:
        return <Typography>Unknown subscription state.</Typography>;
    }
  };

  if (loading) {
    return <LoadingCircle />;
  }

  return <Box>{renderSubscriptionContent(subscriptionState)}</Box>;
};
