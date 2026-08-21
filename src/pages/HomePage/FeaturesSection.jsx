import React from "react";
import { Box, Container, Typography } from "@mui/material";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import { useColors } from "../../theme/colors";

const features = [
  {
    title: "Client communication in one place",
    description:
      "Keep service inquiries, client updates, and job conversations organized instead of losing details across DMs, text messages, and email threads.",
    icon: ConnectWithoutContactIcon,
  },
  {
    title: "Business analytics",
    description:
      "Understand demand, monitor your work, and use clear business insights to make stronger decisions as your sneaker-service operation grows.",
    icon: AnalyticsIcon,
  },
  {
    title: "A profile that builds trust",
    description:
      "Showcase your specialty, services, and professional identity so sneaker owners can confidently choose the right provider for their work.",
    icon: VolunteerActivismIcon,
  },
  {
    title: "Detailed service intake",
    description:
      "Capture the condition, requested work, notes, and service expectations before a cleaning, restoration, repair, custom project, or protective treatment begins.",
    icon: ReceiptLongIcon,
  },
];

function FeatureCard({ feature, index }) {
  const colors = useColors();
  const Icon = feature.icon;

  return (
    <Box
      component="article"
      sx={{
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        color: colors.textPrimary,
        display: "flex",
        flexDirection: "column",
        minHeight: 290,
        p: { xs: 3, md: 4 },
        transition: (theme) =>
          theme.transitions.create(
            ["border-color", "box-shadow", "transform"],
            { duration: theme.transitions.duration.short },
          ),
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: 4,
          transform: "translateY(-4px)",
        },
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          bgcolor: "primary.main",
          borderRadius: "50%",
          color: "primary.contrastText",
          display: "flex",
          height: 56,
          justifyContent: "center",
          mb: 4,
          width: 56,
        }}
      >
        <Icon fontSize="medium" />
      </Box>

      <Typography
        color="primary.main"
        fontWeight={800}
        sx={{ mb: 1 }}
        variant="overline"
      >
        0{index + 1}
      </Typography>

      <Typography component="h3" sx={{ mb: 1.5 }} variant="h4">
        {feature.title}
      </Typography>

      <Typography color={colors.textSecondary} variant="body1">
        {feature.description}
      </Typography>
    </Box>
  );
}

function FeaturesSection() {
  const colors = useColors();

  return (
    <Box
      component="section"
      id="Features"
      sx={{
        bgcolor: colors.pageBg,
        color: colors.textPrimary,
        py: { xs: 7, md: 10 },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 720, mb: { xs: 5, md: 7 } }}>
          <Typography
            color="primary.main"
            fontWeight={800}
            sx={{ mb: 1 }}
            variant="overline"
          >
            Built for the workflow
          </Typography>

          <Typography component="h2" sx={{ mb: 2 }} variant="h2">
            Everything your sneaker-service business needs to stay organized.
          </Typography>

          <Typography color={colors.textSecondary} variant="body1">
            Create a more professional experience for your clients while keeping
            the operations behind every service simple, visible, and connected.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))",
            },
          }}
        >
          {features.map((feature, index) => (
            <FeatureCard feature={feature} index={index} key={feature.title} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default FeaturesSection;
