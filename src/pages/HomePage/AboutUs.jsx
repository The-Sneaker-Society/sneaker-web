import React from "react";
import {
  Box,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";
import { useColors } from "../../theme/colors";

const principles = [
  {
    number: "01",
    title: "Respect the craft",
    description:
      "Sneaker cleaning, restoration, repair, customization, and protection work demand skill, attention, and care. The platform should reflect that professionalism.",
  },
  {
    number: "02",
    title: "Make business easier",
    description:
      "Independent service providers should spend less time tracking details across messages and more time delivering exceptional work for their clients.",
  },
  {
    number: "03",
    title: "Strengthen the community",
    description:
      "The sneaker industry grows when skilled professionals can build trust, share visibility, and connect with the people who value their work.",
  },
];

const testimonials = [
  {
    quote:
      "The Sneaker Society gives me a more professional way to organize client requests and keep every restoration job on track.",
    name: "Sneaker Service Professional",
    role: "Restoration and Cleaning Business",
  },
  {
    quote:
      "Having one place for my services, client conversations, and business profile makes it easier to focus on the actual work.",
    name: "Independent Business Owner",
    role: "Custom Sneaker Specialist",
  },
  {
    quote:
      "The platform makes it easier for clients to understand what I offer and feel confident before they trust me with their sneakers.",
    name: "Community Member",
    role: "Sneaker Repair Provider",
  },
];

function SectionLabel({ children }) {
  return (
    <Typography
      color="primary.main"
      fontWeight={800}
      sx={{ mb: 1 }}
      variant="overline"
    >
      {children}
    </Typography>
  );
}

function AboutUs() {
  const colors = useColors();

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    window.scrollTo({
      top: section.offsetTop - 88,
      behavior: "smooth",
    });
  };

  return (
    <Box
      sx={{
        bgcolor: colors.pageBg,
        color: colors.textPrimary,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header
        contactRef={() => scrollToSection("about-contact")}
        featureRef={() => scrollToSection("about-mission")}
        onButtonClick={() => {
          window.location.assign("/member/signup");
        }}
        onLoginButtonClick={() => {
          window.location.assign("/login");
        }}
        onRedirectClick={() => {
          window.location.assign("/");
        }}
        pricingRef={() => scrollToSection("about-principles")}
      />

      <Box component="main" sx={{ flex: 1 }}>
        <Box
          component="section"
          sx={{
            bgcolor: colors.pageBg,
            py: { xs: 7, md: 11 },
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ maxWidth: 900 }}>
              <SectionLabel>About The Sneaker Society</SectionLabel>

              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: "2.8rem", sm: "3.8rem", md: "5rem" },
                  letterSpacing: "-0.06em",
                  lineHeight: 1.02,
                  mb: 3,
                }}
                variant="h1"
              >
                Built for the people who keep sneaker culture moving.
              </Typography>

              <Typography
                color={colors.textSecondary}
                sx={{
                  fontSize: { xs: "1.05rem", md: "1.25rem" },
                  maxWidth: 760,
                }}
                variant="body1"
              >
                The Sneaker Society is a business-management and community
                platform for sneaker-service professionals. We help cleaners,
                restorers, repair specialists, customizers, and protective
                treatment providers organize work, build trust, and grow their
                businesses.
              </Typography>
            </Box>
          </Container>
        </Box>

        <Box
          component="section"
          id="about-mission"
          sx={{
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
            borderTop: 1,
            py: { xs: 7, md: 10 },
            scrollMarginTop: "88px",
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: "grid",
                gap: { xs: 4, md: 8 },
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "minmax(0, 0.85fr) minmax(0, 1.15fr)",
                },
              }}
            >
              <Box>
                <SectionLabel>Our mission</SectionLabel>

                <Typography component="h2" variant="h2">
                  Give independent sneaker-service businesses a stronger
                  foundation.
                </Typography>
              </Box>

              <Stack spacing={3}>
                <Typography color={colors.textSecondary} variant="body1">
                  Great sneaker work is personal. A customer trusts a
                  professional with a pair that may carry financial value,
                  memories, or real cultural significance. The business systems
                  behind that work should be just as thoughtful.
                </Typography>

                <Typography color={colors.textSecondary} variant="body1">
                  We are building The Sneaker Society to help providers manage
                  their operations, present their services professionally, and
                  create a clearer experience from the first client inquiry to
                  the completed service.
                </Typography>
              </Stack>
            </Box>
          </Container>
        </Box>

        <Box
          component="section"
          id="about-principles"
          sx={{
            bgcolor: colors.pageBg,
            py: { xs: 7, md: 10 },
            scrollMarginTop: "88px",
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ maxWidth: 700, mb: { xs: 5, md: 7 } }}>
              <SectionLabel>What guides us</SectionLabel>

              <Typography component="h2" sx={{ mb: 2 }} variant="h2">
                A platform grounded in practical work and real community.
              </Typography>

              <Typography color={colors.textSecondary} variant="body1">
                The product is designed around the work people already do every
                day, with tools and connections that help service businesses
                operate with more confidence.
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(3, minmax(0, 1fr))",
                },
              }}
            >
              {principles.map((principle) => (
                <Paper
                  elevation={0}
                  key={principle.number}
                  sx={{
                    bgcolor: "background.paper",
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 2,
                    minHeight: 260,
                    p: 3,
                  }}
                >
                  <Typography
                    color="primary.main"
                    fontWeight={800}
                    sx={{ mb: 4 }}
                    variant="overline"
                  >
                    {principle.number}
                  </Typography>

                  <Typography component="h3" sx={{ mb: 1.5 }} variant="h5">
                    {principle.title}
                  </Typography>

                  <Typography color={colors.textSecondary} variant="body2">
                    {principle.description}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Container>
        </Box>

        <Box
          component="section"
          sx={{
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
            borderTop: 1,
            py: { xs: 7, md: 10 },
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ maxWidth: 700, mb: { xs: 5, md: 7 } }}>
              <SectionLabel>Community perspective</SectionLabel>

              <Typography component="h2" sx={{ mb: 2 }} variant="h2">
                Built around the people doing the work.
              </Typography>

              <Typography color={colors.textSecondary} variant="body1">
                These are example statements until you replace them with
                approved member feedback or verified customer testimonials.
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(3, minmax(0, 1fr))",
                },
              }}
            >
              {testimonials.map((testimonial) => (
                <Paper
                  elevation={0}
                  key={testimonial.role}
                  sx={{
                    bgcolor: "background.default",
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 270,
                    p: 3,
                  }}
                >
                  <Typography
                    color="primary.main"
                    component="span"
                    sx={{
                      fontSize: "3rem",
                      fontWeight: 800,
                      lineHeight: 0.8,
                      mb: 2,
                    }}
                  >
                    “
                  </Typography>

                  <Typography
                    color={colors.textSecondary}
                    sx={{ flex: 1 }}
                    variant="body1"
                  >
                    {testimonial.quote}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography fontWeight={700} variant="body2">
                    {testimonial.name}
                  </Typography>

                  <Typography color={colors.textSecondary} variant="caption">
                    {testimonial.role}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Container>
        </Box>

        <Box
          component="section"
          id="about-contact"
          sx={{
            bgcolor: colors.pageBg,
            py: { xs: 7, md: 10 },
            scrollMarginTop: "88px",
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
                  md: "minmax(0, 1fr) auto",
                },
                p: { xs: 3, sm: 5, md: 6 },
              }}
            >
              <Box>
                <Typography component="h2" sx={{ mb: 1.5 }} variant="h3">
                  Ready to build your place in The Sneaker Society?
                </Typography>

                <Typography variant="body1">
                  Create a professional business profile, organize your
                  services, and become part of a network built for sneaker
                  service professionals.
                </Typography>
              </Box>

              <Box
                component="a"
                href="/member/signup"
                sx={{
                  alignItems: "center",
                  bgcolor: "background.paper",
                  border: 2,
                  borderColor: "primary.main",
                  color: "primary.main",
                  display: "inline-flex",
                  fontSize: "0.9375rem",
                  fontWeight: 800,
                  justifyContent: "center",
                  minHeight: 48,
                  minWidth: { xs: "100%", md: 220 },
                  px: 3,
                  textDecoration: "none",
                  "&:hover": {
                    bgcolor: "action.hover",
                    borderColor: "primary.light",
                    color: "primary.light",
                  },
                }}
              >
                Create your profile
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}

export default AboutUs;
