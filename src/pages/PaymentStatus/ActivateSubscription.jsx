import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useMutation, useQuery } from "@apollo/client";
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
import { LoadingCircle } from "../../components/LoadingCircle";
import {
  GET_SUBSCRIPTION_DETAILS,
  REACTIVATE_SUBSCRIPTION,
  CREATE_MEMBER_SUBSCRIPTION,
} from "../../context/graphql/subscriptionQueries";
import { format } from "date-fns";

const FEATURES = [
  { icon: AttachMoneyIcon,       label: "Get paid quickly, directly to your bank" },
  { icon: AllInclusiveIcon,      label: "Unlimited contracts — no caps on how much you can grow" },
  { icon: CollectionsIcon,       label: "Show off your work with a portfolio built for closers" },
  { icon: VerifiedIcon,          label: "Professional contracts your clients can count on" },
  { icon: ChatBubbleOutlineIcon, label: "Stay connected with clients without leaving the app" },
  { icon: InsightsIcon,          label: "Know your numbers — track revenue, volume, and growth" },
];

const DetailRow = ({ icon: Icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
    <Icon sx={{ color: "rgba(255,255,255,0.35)", fontSize: "1.1rem", flexShrink: 0 }} />
    <Box>
      <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </Typography>
      <Typography sx={{ color: "white", fontSize: "0.95rem", fontWeight: 500 }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

export const ActivateSubscription = () => {
  const [processing, setProcessing] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_SUBSCRIPTION_DETAILS);

  const hasSubscriptionHistory = !!data?.subscriptionDetails?.currentPeriodEnd;

  const [reactivateSubscription] = useMutation(REACTIVATE_SUBSCRIPTION, {
    onCompleted: () => {
      refetch();
      setProcessing(false);
    },
    onError: (err) => {
      console.error("Error reactivating subscription:", err);
      setProcessing(false);
    },
  });

  const [createSubscription] = useMutation(CREATE_MEMBER_SUBSCRIPTION);

  const handleReactivate = async () => {
    setProcessing(true);
    try {
      if (hasSubscriptionHistory) {
        await reactivateSubscription();
      } else {
        const { data } = await createSubscription();
        if (data?.createMemberSubsctiprion) {
          window.location.href = data.createMemberSubsctiprion;
        } else {
          console.error("No checkout URL returned.");
          setProcessing(false);
        }
      }
    } catch (err) {
      console.error("Error processing subscription:", err);
      setProcessing(false);
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
  const { isPaused, cancelAtPeriodEnd } = subscriptionDetails;

  const paymentMethod = subscriptionDetails.paymentMethod
    ? `${subscriptionDetails.paymentMethod.brand} ****${subscriptionDetails.paymentMethod.last4}`
    : "N/A";

  const statusLabel = isPaused ? "Paused" : "Cancelled";

  const headline = isPaused
    ? "Your plan is paused."
    : hasSubscriptionHistory
    ? "Welcome back."
    : "One last step.";

  const subtitle = isPaused
    ? "Your subscription is paused — no charges are being made. Reactivate below to pick up right where you left off."
    : hasSubscriptionHistory
    ? "Your subscription is no longer active. Reactivate below to restore full access and keep your business running."
    : "It looks like your subscription wasn't completed. Start it now to unlock your account and get to work.";

  const ctaLabel = hasSubscriptionHistory ? "Reactivate Subscription" : "Start Subscription";

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
      {/* Left — Reactivate */}
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

        {hasSubscriptionHistory && (
          <>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <DetailRow icon={InfoOutlinedIcon} label="Status" value={statusLabel} />
              <DetailRow icon={EventNoteIcon} label="Last Billing Date" value={formatDate(subscriptionDetails.currentPeriodEnd)} />
              <DetailRow icon={CreditCardIcon} label="Payment Method" value={paymentMethod} />
            </Box>
            <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", my: 1 }} />
          </>
        )}

        <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
          <Typography fontWeight={800} sx={{ color: "#FFD100", fontSize: { xs: "3.8rem", sm: "4.5rem" }, lineHeight: 1 }}>
            $7.99
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "1rem" }}>/ month</Typography>
        </Box>

        <Button
          onClick={handleReactivate}
          disabled={processing}
          sx={{
            mt: 1,
            alignSelf: "flex-start",
            bgcolor: "#FFD100", color: "black", borderRadius: "8px",
            px: 5, py: 1.5, fontSize: "15px", fontWeight: 700,
            textTransform: "none", minWidth: 200, minHeight: 48, boxShadow: "none",
            "&:hover": { bgcolor: "#e6bc00", boxShadow: "none" },
            "&.Mui-disabled": { bgcolor: "rgba(255,209,0,0.35)", color: "rgba(0,0,0,0.4)" },
          }}
        >
          {processing ? <CircularProgress size={20} thickness={3} sx={{ color: "black" }} /> : ctaLabel}
        </Button>
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
