import React, { useRef } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import PricingTable from "./PricingTable";
import ContactSection from "./ContactSection";
import { useColors } from "../../theme/colors";
import AboutSection from "./AboutSection";
import CallToAction from "./CallToAction";
import ConnectSection from "./ConnectSection";

function HomePage() {
  const navigate = useNavigate();
  const colors = useColors();

  const featuresSectionRef = useRef(null);
  const pricingSectionRef = useRef(null);
  const contactSectionRef = useRef(null);

  const scrollToRef = (ref) => {
    if (!ref?.current) {
      return;
    }

    const headerOffset = 88;
    const top = ref.current.offsetTop - headerOffset;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  };

  const handleMemberSignupClick = () => {
    navigate("/member/signup");
  };

  const handleUserSignupClick = () => {
    navigate("/user/signup");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleHomeClick = () => {
    navigate("/");
    window.scrollTo({
      top: 0,
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
        contactRef={() => scrollToRef(contactSectionRef)}
        featureRef={() => scrollToRef(featuresSectionRef)}
        onButtonClick={handleMemberSignupClick}
        onLoginButtonClick={handleLoginClick}
        onRedirectClick={handleHomeClick}
        pricingRef={() => scrollToRef(pricingSectionRef)}
      />

      <Box component="main" sx={{ flex: 1 }}>
        <HeroSection
          onMemberSignupClick={handleMemberSignupClick}
          onUserSignupClick={handleUserSignupClick}
        />

        <Box
          component="section"
          ref={featuresSectionRef}
          sx={{
            bgcolor: "background.paper",
            borderTop: 1,
            borderColor: "divider",
            scrollMarginTop: "88px",
          }}
        >
          <FeaturesSection />

          <AboutSection />
        </Box>

        <Box
          component="section"
          ref={pricingSectionRef}
          sx={{
            bgcolor: colors.pageBg,
            borderTop: 1,
            borderColor: "divider",
            scrollMarginTop: "88px",
          }}
        >
          <PricingTable
            onMemberSignupClick={handleMemberSignupClick}
            onUserSignupClick={handleUserSignupClick}
          />

          <ConnectSection />

          <CallToAction
            buttonText="Start your business profile"
            onButtonClick={handleMemberSignupClick}
          />
        </Box>

        <Box
          component="section"
          ref={contactSectionRef}
          sx={{
            bgcolor: "background.paper",
            borderTop: 1,
            borderColor: "divider",
            scrollMarginTop: "88px",
          }}
        >
          <ContactSection />
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}

export default HomePage;
