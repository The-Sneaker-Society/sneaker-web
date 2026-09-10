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

import Sneakers from "../../../assets/sneakers-header.png";

const CONTACT_EMAIL = "help@thesneakerssociety.com";
const INSTAGRAM_HANDLE = "@thesneakersociety1";
const INSTAGRAM_URL = "https://www.instagram.com/thesneakersociety1/";

function ContactMethod({ icon, label, href, value, external = false }) {
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
          color="text.primary"
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
  return (
    <Box
      component="section"
      id="Contact"
      sx={{
        bgcolor: "background.default",
        color: "text.primary",
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
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 620 }}
              variant="body1"
            >
              Reach out for help with membership, onboarding, platform access,
              or getting your sneaker-service business started on the platform.
            </Typography>

            <Stack spacing={2}>
              <ContactMethod
                href={`mailto:${CONTACT_EMAIL}`}
                icon={<EmailIcon />}
                label="Email"
                value={CONTACT_EMAIL}
              />

              <ContactMethod
                external
                href={INSTAGRAM_URL}
                icon={<InstagramIcon />}
                label="Instagram"
                value={INSTAGRAM_HANDLE}
              />
            </Stack>
          </Box>

          <Box
            sx={{
              alignItems: "center",
              bgcolor: "brandSurface.main",
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              display: "flex",
              justifyContent: "center",
              minHeight: { xs: 280, md: 440 },
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
                height: { xs: 180, md: 250 },
                opacity: 0.18,
                pointerEvents: "none",
                position: "absolute",
                right: { xs: -72, md: -96 },
                top: { xs: -72, md: -96 },
                width: { xs: 180, md: 250 },
              }}
            />

            <Box
              alt="The Sneaker Society"
              component="img"
              src={Sneakers}
              sx={{
                display: "block",
                maxHeight: { xs: 235, md: 325 },
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

export default ContactSection;
