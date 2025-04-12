import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useSneakerUser } from "../../context/UserContext";
import { ActivateSubscription } from "./ActivateSubscription";
import { CancelSubscription } from "./CancelSubscription";
import { NewSubscription } from "./NewSubscription";

export const Subscriptions = () => {
  const { user, isSubscribed } = useSneakerUser();
  const [subscriptionState, setSubscriptionState] = useState(null);

  // Determine subscription state
  React.useEffect(() => {
    if (isSubscribed && user?.stripeCustomerId) {
      setSubscriptionState("active");
    } else if (!isSubscribed && user?.stripeCustomerId) {
      setSubscriptionState("previously_active");
    } else {
      setSubscriptionState("none");
    }
  }, [user, isSubscribed]);

  const renderSubscriptionContent = () => {
    switch (subscriptionState) {
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

  return <Box>{renderSubscriptionContent()}</Box>;
};
