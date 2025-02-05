import React from "react";
import { Container, Grid, Box, Typography } from "@mui/material";
import ContractStatusWidget from "../../components/ContractStatusWidget";
import { QrWidget } from "../../components/qrWidget";
import { StripeWidget } from "../../components/StripeWidget";
import ContractWidget from "../HomePage/ContractWidget";
import { useAuth } from "../../context/AuthContext";
import StyledButton from "../HomePage/StackedButton";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
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
        <Typography variant="h1" fontWeight="bold"
        sx={{
          marginLeft: "9rem"
        }}>
          Welcome, {user.firstName || "User"}
        </Typography>
        <StyledButton onClick={handleLogout} style={{ marginTop: "10px" }}>Log Out</StyledButton>
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
