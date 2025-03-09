import React from "react";
import Grid from "@mui/material/Grid2";
import { Container, Box, Typography } from "@mui/material";
import { extendTheme, styled } from "@mui/material/styles";
import { useUser, useClerk } from "@clerk/clerk-react";
import ContractStatusWidget from "../../components/ContractStatusWidget";
import { QrWidget } from "../../components/qrWidget";
import { StripeWidget } from "../../components/StripeWidgets/StripeWidget";
import StyledButton from "../HomePage/StyledButton";
import { StripeSetUpWidget } from "../../components/StripeWidgets/StripeSetUpWidget";
import { ContractListWidget } from "../ContractsPage/ContractListWidget";
import { useSneakerUser } from "../../context/UserContext";

export const MemberDashboard = () => {
  const { user } = useSneakerUser();

  const handleLogout = () => {
    signOut();
  };

  const { signOut } = useClerk();

  const Skeleton = styled("div")(({ theme, height }) => ({
    backgroundColor: theme.palette.action.hover,
    border: 1,
    borderRadius: theme.shape.borderRadius,
    height,
    content: '" "',
  }));

  const WidgetWrapper = ({ children }) => {
    return <Box sx={{ height: "100%", width: "100%" }}>{children}</Box>;
  };

  return (
    <>
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
              Welcome, {user?.firstName || "User"}
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
            {user?.stripeConnectAccountId ? (
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
