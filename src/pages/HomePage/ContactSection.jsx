import React from "react";
import {
  Box,
  Container,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useColors } from "../../theme/colors";
import Sneakers from "../../../assets/sneakers-header.png";

function ContactMethod({ icon, label, href, value, external = false }) {
  const colors = useColors();

  return (
    <Box
      sx={{
        alignItems: "center",
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        display: "flex",
        gap: 2,
        minHeight: 132,
        p: { xs: 2.5, sm: 3 },
        transition: (theme) =>
          theme.transitions.create(["border-color", "background-color"], {
            duration: theme.transitions.duration.short,
          }),
        "&:hover": {
          bgcolor: "action.hover",
          borderColor: "primary.main",
        },
      }}
    >
      <IconButton
        aria-label={label}
        component="a"
        href={href}
        rel={external ? "noreferrer" : undefined}
        target={external ? "_blank" : undefined}
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          flexShrink: 0,
          height: 48,
          width: 48,
          "&:hover": {
            bgcolor: "primary.dark",
          },
        }}
      >
        {icon}
      </IconButton>

      <Box sx={{ minWidth: 0 }}>
        <Typography component="h3" fontWeight={700} variant="h5">
          {label}
        </Typography>

        <Link
          color={colors.textPrimary}
          href={href}
          rel={external ? "noreferrer" : undefined}
          sx={{
            display: "inline-block",
            fontWeight: 600,
            mt: 0.75,
            overflowWrap: "anywhere",
            textDecorationColor: "primary.main",
            textUnderlineOffset: 4,
            "&:hover": {
              color: "primary.main",
            },
          }}
          target={external ? "_blank" : undefined}
          variant="body1"
        >
          {value}
        </Link>
      </Box>
    </Box>
  );
}

function ContactSection() {
  const colors = useColors();

  return (
    <Box
      component="section"
      id="Contact"
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
            gap: { xs: 5, md: 8 },
            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(0, 1.1fr) minmax(0, 0.9fr)",
            },
          }}
        >
          <Box>
            <Typography
              color="primary.main"
              fontWeight={800}
              sx={{ mb: 1 }}
              variant="overline"
            >
              Let&apos;s connect
            </Typography>

            <Typography component="h2" sx={{ mb: 2 }} variant="h2">
              Questions about The Sneaker Society?
            </Typography>

            <Typography
              color={colors.textSecondary}
              sx={{ mb: 4, maxWidth: 620 }}
              variant="body1"
            >
              Reach out for help with membership, onboarding, platform access,
              or getting your sneaker-service business started on the platform.
            </Typography>

            <Stack spacing={2}>
              <ContactMethod
                href="mailto:help@thesneakerssociety.com"
                icon={<EmailIcon />}
                label="Email"
                value="help@thesneakerssociety.com"
              />

              <ContactMethod
                external
                href="https://www.instagram.com/thesneakersociety1/"
                icon={<InstagramIcon />}
                label="Instagram"
                value="@thesneakersociety1"
              />
            </Stack>
          </Box>

          <Box
            sx={{
              alignItems: "center",
              bgcolor: "background.paper",
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              display: "flex",
              justifyContent: "center",
              minHeight: { xs: 280, md: 440 },
              overflow: "hidden",
              p: { xs: 4, md: 6 },
            }}
          >
            <Box
              alt="The Sneaker Society"
              component="img"
              src={Sneakers}
              sx={{
                maxHeight: { xs: 235, md: 325 },
                maxWidth: "100%",
                objectFit: "contain",
                width: "100%",
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default ContactSection;
