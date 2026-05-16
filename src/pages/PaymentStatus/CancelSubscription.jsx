import React, { useState } from "react";
import { Box, Typography, Button, CircularProgress, Divider, useTheme, useMediaQuery } from "@mui/material";
import { useMutation, useQuery } from "@apollo/client";
import { LoadingCircle } from "../../components/LoadingCircle";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CollectionsIcon from "@mui/icons-material/Collections";
import VerifiedIcon from "@mui/icons-material/Verified";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import InsightsIcon from "@mui/icons-material/Insights";
import { GET_SUBSCRIPTION_DETAILS, CANCEL_SUBSCRIPTION, PAUSE_SUBSCRIPTION, REACTIVATE_SUBSCRIPTION } from "../../context/graphql/subscriptionQueries";
import { format } from "date-fns";

const FEATURES = [
  { icon: AttachMoneyIcon,       label: "Get paid quickly, directly to your bank" },
  { icon: AllInclusiveIcon,      label: "Unlimited contracts — no caps on how much you can grow" },
  { icon: CollectionsIcon,       label: "Show off your work with a portfolio built for closers" },
  { icon: VerifiedIcon,          label: "Professional contracts your clients can count on" },
  { icon: ChatBubbleOutlineIcon, label: "Stay connected with clients without leaving the app" },
  { icon: InsightsIcon,          label: "Know your numbers — track revenue, volume, and growth" },
];

const DetailRow = ({ icon: Icon, label, value, valueColor }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
    <Icon sx={{ color: "rgba(255,255,255,0.35)", fontSize: "1.1rem", flexShrink: 0 }} />
    <Box>
      <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </Typography>
      <Typography sx={{ color: valueColor || "white", fontSize: "0.95rem", fontWeight: 500 }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

export const CancelSubscription = () => {
  const [cancelLoading, setCancelLoading] = useState(false);
  const [pauseLoading, setPauseLoading] = useState(false);
  const [reactivateLoading, setReactivateLoading] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_SUBSCRIPTION_DETAILS);
  const [cancelSubscription] = useMutation(CANCEL_SUBSCRIPTION);
  const [pauseSubscription] = useMutation(PAUSE_SUBSCRIPTION);
  const [reactivateSubscription] = useMutation(REACTIVATE_SUBSCRIPTION);

  const handleCancel = async () => {
    setCancelLoading(true);
    try {
      await cancelSubscription();
      await refetch();
      setCancelLoading(false);
    } catch (err) {
      console.error("Error cancelling subscription:", err);
      setCancelLoading(false);
    }
  };

  const handlePause = async () => {
    setPauseLoading(true);
    try {
      await pauseSubscription();
      await refetch();
      setPauseLoading(false);
    } catch (err) {
      console.error("Error pausing subscription:", err);
      setPauseLoading(false);
    }
  };

  const handleReactivate = async () => {
    setReactivateLoading(true);
    try {
      await reactivateSubscription();
      await refetch();
      setReactivateLoading(false);
    } catch (err) {
      console.error("Error reactivating subscription:", err);
      setReactivateLoading(false);
    }
  };

  if (loading) return <LoadingCircle />;

  if (error) {
    return (
      <Box sx={{ minHeight: "100vh", width: "100%", bgcolor: "black", display: "flex", alignItems: "center", justifyContent: "center", p: 4 }}>
        <Typography sx={{ color: "rgba(255,255,255,0.5)" }}>
          Error loading subscription details: {error.message}
        </Typography>
      </Box>
    );
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return format(new Date(timestamp), "MM/dd/yyyy");
  };

  const subscriptionDetails = data?.subscriptionDetails || {};
  const { cancelAtPeriodEnd, isPaused, currentPeriodEnd } = subscriptionDetails;

  const paymentMethod = subscriptionDetails.paymentMethod
    ? `${subscriptionDetails.paymentMethod.brand} ****${subscriptionDetails.paymentMethod.last4}`
    : "N/A";

  const statusLabel = isPaused
    ? "Paused"
    : cancelAtPeriodEnd
    ? `Cancels ${formatDate(currentPeriodEnd)}`
    : "Active";

  const statusColor = isPaused
    ? "#F59E0B"
    : cancelAtPeriodEnd
    ? "#FF5252"
    : "#4caf50";

  // Billing date row label + value changes based on state
  const billingLabel = isPaused || cancelAtPeriodEnd ? "Access Ends" : "Next Billing Date";
  const billingValue = formatDate(currentPeriodEnd);

  // Headline + subtitle change based on state
  const headline = isPaused
    ? "Your plan is paused."
    : cancelAtPeriodEnd
    ? "Cancellation scheduled."
    : "Manage your plan.";

  const subtitle = isPaused
    ? `Billing is paused. You still have full access until ${formatDate(currentPeriodEnd)}, then your account will go inactive until you reactivate.`
    : cancelAtPeriodEnd
    ? `Your plan will cancel on ${formatDate(currentPeriodEnd)}. You keep full access until then — no further charges.`
    : "Need to step back? You can pause or cancel your subscription below. Your data stays safe either way.";

  const isDisabled = cancelLoading || pauseLoading || reactivateLoading;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        bgcolor: "black",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "flex-start", md: "center" },
        gap: { xs: 6, md: 10 },
        px: { xs: 3, sm: 6 },
        py: { xs: 6, sm: 8 },
        overflow: "auto",
      }}
    >
      {/* Left — Manage */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WorkspacePremiumIcon sx={{ color: "#FFD100", fontSize: "1.4rem" }} />
          <Typography sx={{ color: "#FFD100", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Essential Plan
          </Typography>
        </Box>

        <Typography variant="h2" fontWeight={800} sx={{ color: "white", fontSize: { xs: "2.6rem", sm: "3.5rem" }, lineHeight: 1.1, letterSpacing: "-1px" }}>
          {headline}
        </Typography>

        <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
          {subtitle}
        </Typography>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", my: 1 }} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <DetailRow icon={InfoOutlinedIcon} label="Status" value={statusLabel} valueColor={statusColor} />
          <DetailRow icon={EventNoteIcon} label={billingLabel} value={billingValue} />
          <DetailRow icon={CreditCardIcon} label="Payment Method" value={paymentMethod} />
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", my: 1 }} />

        <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
          <Typography fontWeight={800} sx={{ color: "#FFD100", fontSize: { xs: "3.8rem", sm: "4.5rem" }, lineHeight: 1 }}>
            $7.99
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "1rem" }}>/ month</Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mt: 1 }}>
          {isPaused || cancelAtPeriodEnd ? (
            <>
              <Button
                onClick={handleReactivate}
                disabled={isDisabled}
                sx={{
                  bgcolor: "#FFD100", color: "black", borderRadius: "8px", px: 4, py: 1.5,
                  fontSize: "15px", fontWeight: 700, textTransform: "none", minWidth: 140, minHeight: 48,
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#e6bc00", boxShadow: "none" },
                  "&.Mui-disabled": { bgcolor: "rgba(255,209,0,0.35)", color: "rgba(0,0,0,0.4)" },
                }}
              >
                {reactivateLoading ? <CircularProgress size={20} thickness={3} sx={{ color: "black" }} /> : "Reactivate Plan"}
              </Button>

              {/* Always allow cancellation even when paused */}
              {!cancelAtPeriodEnd && (
                <Button
                  onClick={handleCancel}
                  disabled={isDisabled}
                  sx={{
                    bgcolor: "transparent", color: "rgba(255,255,255,0.4)", borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.12)", px: 4, py: 1.5,
                    fontSize: "15px", fontWeight: 600, textTransform: "none", minWidth: 140, minHeight: 48,
                    boxShadow: "none",
                    "&:hover": { bgcolor: "rgba(255,82,82,0.08)", borderColor: "rgba(255,82,82,0.4)", color: "#FF5252", boxShadow: "none" },
                    "&.Mui-disabled": { opacity: 0.4 },
                  }}
                >
                  {cancelLoading ? <CircularProgress size={20} thickness={3} sx={{ color: "rgba(255,255,255,0.4)" }} /> : "Cancel Plan"}
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                onClick={handlePause}
                disabled={isDisabled}
                sx={{
                  bgcolor: "#FFD100", color: "black", borderRadius: "8px", px: 4, py: 1.5,
                  fontSize: "15px", fontWeight: 700, textTransform: "none", minWidth: 140, minHeight: 48,
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#e6bc00", boxShadow: "none" },
                  "&.Mui-disabled": { bgcolor: "rgba(255,209,0,0.35)", color: "rgba(0,0,0,0.4)" },
                }}
              >
                {pauseLoading ? <CircularProgress size={20} thickness={3} sx={{ color: "black" }} /> : "Pause"}
              </Button>

              <Button
                onClick={handleCancel}
                disabled={isDisabled}
                sx={{
                  bgcolor: "transparent", color: "rgba(255,255,255,0.4)", borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.12)", px: 4, py: 1.5,
                  fontSize: "15px", fontWeight: 600, textTransform: "none", minWidth: 140, minHeight: 48,
                  boxShadow: "none",
                  "&:hover": { bgcolor: "rgba(255,82,82,0.08)", borderColor: "rgba(255,82,82,0.4)", color: "#FF5252", boxShadow: "none" },
                  "&.Mui-disabled": { opacity: 0.4 },
                }}
              >
                {cancelLoading ? <CircularProgress size={20} thickness={3} sx={{ color: "rgba(255,255,255,0.4)" }} /> : "Cancel Plan"}
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Right — Features card */}
      <Box
        sx={{
          flex: 1,
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "16px",
          p: { xs: 3, sm: 4 },
          bgcolor: "#0d0d0d",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", letterSpacing: "0.12em" }}>
          What's included
        </Typography>

        {FEATURES.map(({ icon: Icon, label }) => (
          <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Icon sx={{ color: "#FFD100", fontSize: "1.2rem", flexShrink: 0 }} />
            <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.95rem" }}>
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
