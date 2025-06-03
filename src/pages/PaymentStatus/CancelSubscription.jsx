import React, { useState } from "react";
import { Box, Typography, Grid, useTheme, useMediaQuery } from "@mui/material";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { LoadingCircle } from "../../components/Loaing";
import InfoIcon from '@mui/icons-material/Info';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import StyledButton from "../HomePage/StyledButton";
import SubscriptionCard from "../../components/SubscriptionCard";
import { GET_SUBSCRIPTION_DETAILS, CANCEL_SUBSCRIPTION, PAUSE_SUBSCRIPTION } from "../../context/graphql/subscriptionQueries";
import { format } from 'date-fns';

export const CancelSubscription = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Separate states for cancel and pause loading
  const [cancelLoading, setCancelLoading] = useState(false);
  const [pauseLoading, setPauseLoading] = useState(false);

  // Query subscription details
  const { loading, error, data } = useQuery(GET_SUBSCRIPTION_DETAILS);

  // Mutations
  const [cancelSubscription] = useMutation(CANCEL_SUBSCRIPTION);
  const [pauseSubscription] = useMutation(PAUSE_SUBSCRIPTION);

  // Handle cancel subscription
  const handleCancel = async () => {
    setCancelLoading(true);
    try {
      await cancelSubscription();
      navigate('/dashboard');
    } catch (err) {
      console.error("Error cancelling subscription:", err);
      setCancelLoading(false);
    }
  };

  // Handle pause subscription
  const handlePause = async () => {
    setPauseLoading(true);
    try {
      await pauseSubscription();
      navigate('/dashboard');
    } catch (err) {
      console.error("Error pausing subscription:", err);
      setPauseLoading(false);
    }
  };

  // Features list for the subscription card
  const features = [
    "Custom Portfolio Showcase",
    "Custom Intake Form",
    "Unlimited Intakes",
    "Fast Payouts",
    "Direct Messaging",
    "Detailed Business Analytics"
  ];

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <LoadingCircle />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 4, color: "white" }}>
        <Typography>Error loading subscription details: {error.message}</Typography>
      </Box>
    );
  }

  // Format the subscription end date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return format(new Date(timestamp), 'MM/dd/yyyy');
  };

  const subscriptionDetails = data?.subscriptionDetails || {};

  return (
    <Box sx={{
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      minHeight: "100vh",
      backgroundColor: "black"
    }}>
      {/* Left Side - Manage Section */}
      <Box sx={{
        flex: 1,
        p: { xs: 3, sm: 5 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}>
        <Typography variant="h1" sx={{
          fontSize: { xs: "3rem", sm: "4rem" },
          fontWeight: "bold",
          color: "white",
          mb: 4
        }}>
          Manage
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{
            fontSize: { xs: "1.8rem", sm: "2.2rem" },
            fontWeight: "bold",
            color: "white",
            mb: 3
          }}>
            Details
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <InfoIcon sx={{ color: "white", mr: 2 }} />
            <Typography sx={{ color: "white" }}>
              Status: <span style={{ fontWeight: "normal" }}>Active</span>
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <EventNoteIcon sx={{ color: "white", mr: 2 }} />
            <Typography sx={{ color: "white" }}>
              Next Billing Date: <span style={{ fontWeight: "normal" }}>{formatDate(subscriptionDetails.currentPeriodEnd)}</span>
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <CreditCardIcon sx={{ color: "white", mr: 2 }} />
            <Typography sx={{ color: "white" }}>
              Payment Method: <span style={{ fontWeight: "normal" }}>
                {subscriptionDetails.paymentMethod ?
                  `${subscriptionDetails.paymentMethod.brand} ****${subscriptionDetails.paymentMethod.last4}` :
                  'N/A'}
              </span>
            </Typography>
          </Box>
        </Box>

        <Box sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2
        }}>
          <StyledButton
            onClick={handleCancel}
            disabled={cancelLoading || pauseLoading}
            style={{ borderColor: '#FF5252' }}
          >
            {cancelLoading ? <LoadingCircle /> : "Cancel"}
          </StyledButton>

          <StyledButton
            onClick={handlePause}
            disabled={pauseLoading || cancelLoading}
          >
            {pauseLoading ? <LoadingCircle /> : "Pause"}
          </StyledButton>
        </Box>
      </Box>

      {/* Right Side - Subscription Card */}
      <Box sx={{
        flex: 1,
        display: { xs: "none", md: "flex" }
      }}>
        <SubscriptionCard features={features} />
      </Box>
    </Box>
  );
};
