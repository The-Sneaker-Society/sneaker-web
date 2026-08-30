import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useColors } from "../../theme/colors";

function AboutSection() {
  const navigate = useNavigate();
  const colors = useColors();

  return (
    <Box
      component="section"
      id="aboutSection"
      sx={{
        bgcolor: colors.pageBg,
        color: colors.textPrimary,
        py: { xs: 7, md: 10 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            alignItems: "center",
            display: "grid",
            gap: { xs: 4, md: 8 },
            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(0, 0.85fr) minmax(0, 1.15fr)",
            },
          }}
        >
          <Box
            sx={{
              bgcolor: "primary.main",
              borderRadius: 2,
              color: "primary.contrastText",
              display: "flex",
              minHeight: { xs: 220, md: 320 },
              p: { xs: 3, md: 5 },
            }}
          >
            <Typography
              component="span"
              sx={{
                alignSelf: "flex-end",
                fontSize: { xs: "2.75rem", md: "4.25rem" },
                fontWeight: 800,
                letterSpacing: "-0.06em",
                lineHeight: 0.98,
              }}
            >
              Built by and for sneaker culture.
            </Typography>
          </Box>

          <Box>
            <Typography
              color="primary.main"
              fontWeight={800}
              sx={{ mb: 1 }}
              variant="overline"
            >
              About The Sneaker Society
            </Typography>

            <Typography component="h2" sx={{ mb: 2 }} variant="h2">
              A better way to run sneaker-service businesses.
            </Typography>

            <Typography
              color={colors.textSecondary}
              sx={{ mb: 3 }}
              variant="body1"
            >
              The Sneaker Society brings together the people who keep sneaker
              culture moving: cleaners, restorers, repair specialists,
              customizers, and providers of protective treatments.
            </Typography>

            <Typography
              color={colors.textSecondary}
              sx={{ mb: 4 }}
              variant="body1"
            >
              We are building a practical platform for managing the work behind
              each service while helping independent professionals build trust,
              strengthen their brand, and connect with the wider community.
            </Typography>

            <Button onClick={() => navigate("/about")} variant="outlined">
              Learn more about us
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default AboutSection;
