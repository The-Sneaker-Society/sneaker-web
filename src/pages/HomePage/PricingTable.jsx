import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import PricingCard from "./PricingCard";
import { useColors } from "../../theme/colors";

function PricingTable({ onMemberSignupClick, onUserSignupClick }) {
  const colors = useColors();

  return (
    <Box
      component="section"
      sx={{
        bgcolor: colors.pageBg,
        color: colors.textPrimary,
        py: { xs: 7, md: 10 },
      }}
    >
      <Container maxWidth="lg">
        <Stack alignItems="center" spacing={2} textAlign="center">
          <Typography color="primary.main" fontWeight={800} variant="overline">
            Simple, transparent pricing
          </Typography>

          <Typography component="h2" variant="h2">
            Choose how you want to use The Sneaker Society.
          </Typography>

          <Typography
            color={colors.textSecondary}
            maxWidth={640}
            variant="body1"
          >
            Start as a sneaker-service business owner to manage work and build
            your presence, or create a client account to discover trusted
            professionals.
          </Typography>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))",
            },
            margin: "0 auto",
            maxWidth: 920,
            mt: { xs: 5, md: 7 },
          }}
        >
          <PricingCard
            benefits={[
              "Professional business profile",
              "Client and service-request management",
              "Contracts and job workflow tools",
              "Access to the business-owner community",
            ]}
            buttonText="Start as a business"
            description="For sneaker cleaners, restorers, customizers, repair professionals, and service providers."
            highlighted
            onButtonClick={onMemberSignupClick}
            price="7.99"
            title="Business Member"
          />

          <PricingCard
            benefits={[
              "Browse participating sneaker-service professionals",
              "Submit service inquiries",
              "Track your service relationship",
              "Connect with local and specialty providers",
            ]}
            buttonText="Create a client account"
            description="For sneaker owners looking to find, connect with, and work with service professionals."
            onButtonClick={onUserSignupClick}
            price="0"
            title="Client Account"
          />
        </Box>

        <Typography
          color={colors.textSecondary}
          sx={{ display: "block", mt: 3, textAlign: "center" }}
          variant="caption"
        >
          Pricing and included features can be updated as the platform evolves.
        </Typography>
      </Container>
    </Box>
  );
}

export default PricingTable;
