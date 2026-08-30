import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useColors } from "../../theme/colors";

function CallToAction({
  buttonText = "Create your business profile",
  descriptionText = "Join a community built for the people doing the work behind sneaker culture.",
  headingText = "Ready to bring your sneaker service business together?",
  onButtonClick,
  sx = {},
}) {
  const colors = useColors();

  return (
    <Box
      component="section"
      id="callToAction"
      sx={{
        bgcolor: colors.pageBg,
        color: colors.textPrimary,
        py: { xs: 7, md: 10 },
        ...sx,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            alignItems: "center",
            bgcolor: "primary.main",
            borderRadius: 2,
            color: "primary.contrastText",
            display: "grid",
            gap: 3,
            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(0, 1.25fr) auto",
            },
            overflow: "hidden",
            p: { xs: 3, sm: 5, md: 6 },
            position: "relative",
          }}
        >
          <Box
            sx={{
              bgcolor: "background.paper",
              borderRadius: "50%",
              height: { xs: 180, md: 280 },
              opacity: 0.1,
              position: "absolute",
              right: { xs: -80, md: -110 },
              top: { xs: -100, md: -140 },
              width: { xs: 180, md: 280 },
            }}
          />

          <Box sx={{ position: "relative" }}>
            <Typography component="h2" sx={{ mb: 1.5 }} variant="h2">
              {headingText}
            </Typography>

            <Typography sx={{ maxWidth: 690 }} variant="body1">
              {descriptionText}
            </Typography>
          </Box>

          <Button
            onClick={onButtonClick}
            sx={{
              bgcolor: "background.paper",
              border: 2,
              borderColor: "primary.main",
              color: "primary.main",
              fontWeight: 800,
              minWidth: { xs: "100%", md: 220 },
              position: "relative",

              "&:hover": {
                bgcolor: "action.hover",
                borderColor: "primary.light",
                color: "primary.light",
              },

              "&:focus-visible": {
                outline: "3px solid",
                outlineColor: "primary.contrastText",
                outlineOffset: 3,
              },
            }}
            variant="outlined"
          >
            {buttonText}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default CallToAction;
