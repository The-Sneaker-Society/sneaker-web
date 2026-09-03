import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useColors } from "../../theme/colors";

function MainSection() {
  const colors = useColors();

  const highlights = [
    {
      title: "Stay organized",
      description:
        "Keep client details, service requests, agreements, and progress in one working system.",
    },
    {
      title: "Build trust",
      description:
        "Present a professional business profile and keep your service workflow visible to clients.",
    },
    {
      title: "Grow your network",
      description:
        "Connect with other cleaners, restorers, customizers, repair experts, and sneaker professionals.",
    },
  ];

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
            One platform, built for the culture
          </Typography>

          <Typography component="h2" maxWidth={720} variant="h2">
            Spend less time chasing details and more time delivering great work.
          </Typography>

          <Typography
            color={colors.textSecondary}
            maxWidth={660}
            variant="body1"
          >
            The Sneaker Society gives independent sneaker-service businesses a
            shared home for operations, customer relationships, and industry
            connection.
          </Typography>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, minmax(0, 1fr))",
            },
            mt: { xs: 5, md: 7 },
          }}
        >
          {highlights.map((highlight, index) => (
            <Box
              key={highlight.title}
              sx={{
                bgcolor: "background.paper",
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                minHeight: 220,
                p: 3,
              }}
            >
              <Typography
                color="primary.main"
                fontWeight={800}
                sx={{ mb: 4 }}
                variant="overline"
              >
                0{index + 1}
              </Typography>

              <Typography component="h3" sx={{ mb: 1.5 }} variant="h5">
                {highlight.title}
              </Typography>

              <Typography color={colors.textSecondary} variant="body2">
                {highlight.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default MainSection;
