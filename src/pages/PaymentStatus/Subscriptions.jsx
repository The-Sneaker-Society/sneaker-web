import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useSneakerMember } from "../../context/MemberContext";
import { ActivateSubscription } from "./ActivateSubscription";
import { CancelSubscription } from "./CancelSubscription";
import { NewSubscription } from "./NewSubscription";
import { LoadingCircle } from "../../components/LoadingCircle";

export const Subscriptions = () => {
  const { member, loading } = useSneakerMember();
  const isSubscribed = member?.isSubscribed;
  const [subscriptionState, setSubscriptionState] = useState("loading");

  // Determine subscription state
  useEffect(() => {
    if (member) {
      if (isSubscribed && member.stripeCustomerId) {
        setSubscriptionState("active");
      } else if (!isSubscribed && member.stripeCustomerId) {
        setSubscriptionState("previously_active");
      } else {
        setSubscriptionState("none");
      }
    } else {
      setSubscriptionState("none");
    }
  }, [member, isSubscribed]);

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
