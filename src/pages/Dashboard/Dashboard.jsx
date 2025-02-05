import React from "react";
import { Container, Grid, Box, Typography } from "@mui/material";
import ContractStatusWidget from "../../components/ContractStatusWidget";
import { QrWidget } from "../../components/qrWidget";
import { StripeWidget } from "../../components/StripeWidget";
import ContractWidget from "../HomePage/ContractWidget";
import StyledButton from "../HomePage/StackedButton";
import { useUser, useClerk } from "@clerk/clerk-react";
import { UserDashboard } from "./UserDashBoard";

export const Dashboard = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

  const { role } = user.unsafeMetadata;

  const handleLogout = () => {
    signOut();
  };

  const MemberDashboard = () => {
    return (
      <Container maxWidth="lg" style={{ height: "100vh" }}>
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

        <Grid container spacing={2} style={{ height: "100%" }}>
          <Grid item xs={12} md={6}>
            <ContractWidget />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              <WidgetPlaceholder color="lightgreen" height="100%">
                <ContractStatusWidget />
              </WidgetPlaceholder>
              <WidgetPlaceholder height="100%">
                <StripeWidget />
              </WidgetPlaceholder>
              <WidgetPlaceholder color="red" height="100%">
                <QrWidget />
              </WidgetPlaceholder>
            </Box>
          </Grid>
        </Grid>
      </Container>
    );
  };

  const WidgetPlaceholder = ({ color, height, children }) => (
    <div
      style={{
        height: height,
        marginBottom: "8px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        borderRadius: "16px",
      }}
    >
      {children}
    </div>
  );

  if (role === "client") {
    return <UserDashboard />;
  } else {
    return <MemberDashboard />;
  }
};
