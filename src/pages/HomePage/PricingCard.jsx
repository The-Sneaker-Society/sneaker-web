import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useColors } from "../../theme/colors";

function PricingCard({
  title = "Society Member",
  price = "7.99",
  period = "/ month",
  description = "Everything you need to build and manage your sneaker service business.",
  benefits = [],
  buttonText = "Get started",
  onButtonClick,
  highlighted = false,
}) {
  const colors = useColors();

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: 2,
        borderColor: highlighted ? "primary.main" : "divider",
        borderRadius: 2,
        boxShadow: highlighted ? 5 : 0,
        color: colors.textPrimary,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        position: "relative",
        p: 3,
      }}
    >
      {highlighted && (
        <Typography
          sx={{
            alignSelf: "flex-start",
            bgcolor: "primary.main",
            borderRadius: 99,
            color: "primary.contrastText",
            fontWeight: 800,
            mb: 2,
            px: 1.25,
            py: 0.5,
          }}
          variant="caption"
        >
          MOST POPULAR
        </Typography>
      )}

      <Typography component="h3" fontWeight={800} variant="h4">
        {title}
      </Typography>

      <Typography
        color={colors.textSecondary}
        sx={{ minHeight: 48, mt: 1 }}
        variant="body2"
      >
        {description}
      </Typography>

      <Stack alignItems="baseline" direction="row" spacing={1} sx={{ my: 3 }}>
        <Typography
          component="span"
          fontWeight={800}
          sx={{ fontSize: { xs: "2.75rem", md: "3.25rem" }, lineHeight: 1 }}
        >
          ${price}
        </Typography>

        <Typography
          color={colors.textSecondary}
          component="span"
          variant="body2"
        >
          {period}
        </Typography>
      </Stack>

      <Button
        color="primary"
        fullWidth
        onClick={onButtonClick}
        sx={{
          mb: 3,
          ...(highlighted && {
            color: "primary.contrastText",
          }),
        }}
        variant={highlighted ? "contained" : "outlined"}
      >
        {buttonText}
      </Button>

      <Stack spacing={1.5} sx={{ mt: "auto" }}>
        {benefits.map((benefit) => (
          <Stack
            alignItems="flex-start"
            direction="row"
            key={benefit}
            spacing={1}
          >
            <CheckCircleOutlineIcon
              color="primary"
              fontSize="small"
              sx={{ mt: "2px" }}
            />

            <Typography color={colors.textSecondary} variant="body2">
              {benefit}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

export default PricingCard;
