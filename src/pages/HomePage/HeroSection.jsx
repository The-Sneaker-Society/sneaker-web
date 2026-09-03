import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import StyledButton from "./StyledButton";
import { useColors } from "../../theme/colors";
import Sneakers from "../../../assets/sneakers-header.png";

function HeroSection({ onMemberSignupClick, onUserSignupClick }) {
  const colors = useColors();

  return (
    <Box
      component="section"
      sx={{
        bgcolor: colors.pageBg,
        color: colors.textPrimary,
        overflow: "hidden",
        py: { xs: 7, md: 11 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            alignItems: "center",
            display: "grid",
            gap: { xs: 5, md: 8 },
            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(0, 1.1fr) minmax(0, 0.9fr)",
            },
          }}
        >
          <Stack alignItems="flex-start" spacing={3}>
            <Typography
              sx={{
                bgcolor: "primary.main",
                borderRadius: 99,
                color: "primary.contrastText",
                fontSize: "0.8rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                px: 1.5,
                py: 0.75,
                textTransform: "uppercase",
              }}
              variant="overline"
            >
              Built for sneaker service professionals
            </Typography>

            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "2.65rem", sm: "3.4rem", md: "4.5rem" },
                letterSpacing: "-0.055em",
                lineHeight: 1.02,
                maxWidth: 760,
              }}
              variant="h1"
            >
              Run your sneaker business from one place.
            </Typography>

            <Typography
              color={colors.textSecondary}
              sx={{
                fontSize: { xs: "1.05rem", md: "1.2rem" },
                maxWidth: 640,
              }}
              variant="body1"
            >
              The Sneaker Society helps cleaning, restoration, repair, custom,
              and protection businesses organize service work, manage clients,
              and connect with other owners in the sneaker industry.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 2, sm: 1 }}
              sx={{ pt: 1 }}
            >
              <StyledButton onClick={onMemberSignupClick}>
                Start your business profile
              </StyledButton>

              <StyledButton onClick={onUserSignupClick}>
                Find a sneaker service
              </StyledButton>
            </Stack>

            <Typography color={colors.textSecondary} variant="body2">
              Manage jobs, clients, agreements, and your professional network.
            </Typography>
          </Stack>

          <Box
            sx={{
              alignItems: "center",
              bgcolor: "background.paper",
              border: 1,
              borderColor: "divider",
              borderRadius: 4,
              boxShadow: 4,
              display: "flex",
              justifyContent: "center",
              minHeight: { xs: 280, md: 420 },
              overflow: "hidden",
              p: { xs: 4, md: 6 },
              position: "relative",
            }}
          >
            <Box
              sx={{
                bgcolor: "primary.main",
                borderRadius: "50%",
                filter: "blur(8px)",
                height: { xs: 180, md: 260 },
                opacity: 0.18,
                position: "absolute",
                right: { xs: -72, md: -96 },
                top: { xs: -72, md: -96 },
                width: { xs: 180, md: 260 },
              }}
            />

            <Box
              alt="The Sneaker Society"
              component="img"
              src={Sneakers}
              sx={{
                maxHeight: { xs: 190, md: 270 },
                maxWidth: "100%",
                objectFit: "contain",
                position: "relative",
                width: "100%",
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default HeroSection;
