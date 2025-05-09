import React from "react";
import Grid from "@mui/material/Grid2";
import { Box, Typography } from "@mui/material";
import { useClerk } from "@clerk/clerk-react";
import ContractStatusWidget from "../../components/ContractStatusWidget";
import { QrWidget } from "../../components/qrWidget";
import { StripeWidget } from "../../components/StripeWidgets/StripeWidget";
import StyledButton from "../HomePage/StyledButton";
import { StripeSetUpWidget } from "../../components/StripeWidgets/StripeSetUpWidget";
import { ContractListWidget } from "../ContractsPage/ContractListWidget";
import SubscribeModal from "../../components/SubscribeModal";
import { useSneakerMember } from "../../context/MemberContext";
import { LoadingCircle } from "../../components/Loaing";

export const MemberDashboard = () => {
  const { member, loading } = useSneakerMember();
  const { signOut } = useClerk();

  const handleLogout = () => {
    signOut();
  };

  const WidgetWrapper = ({ children }) => {
    return <Box sx={{ height: "100%", width: "100%" }}>{children}</Box>;
  };

  if (loading) {
    return <LoadingCircle />;
  }

  const isSubscribed = member?.isSubscribed; // Assuming `isSubscribed` is part of the member object

  return (
    <>
      <SubscribeModal isSubscribed={isSubscribed} />
      <Grid container spacing={1} height="100%">
        <Grid size={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <Typography variant="h1" fontWeight="bold">
              Welcome, {member?.firstName || "member"}
            </Typography>
            <StyledButton onClick={handleLogout} style={{ marginTop: "10px" }}>
              Log Out
            </StyledButton>
          </Box>
        </Grid>
        {/* Left */}
        <Grid
          size={{ sm: 12, md: 6 }}
          sx={{
            width: "100%",
          }}
        >
          <ContractListWidget />
        </Grid>

        {/* Right */}
        <Grid
          size={{ sm: 12, md: 6 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <WidgetWrapper>
            <ContractStatusWidget />
          </WidgetWrapper>
          <WidgetWrapper>
            {member?.stripeConnectAccountId ? (
              <StripeWidget />
            ) : (
              <StripeSetUpWidget />
            )}
          </WidgetWrapper>
          <WidgetWrapper>
            <QrWidget />
          </WidgetWrapper>
        </Grid>
      </Grid>
    </>
  );
};
