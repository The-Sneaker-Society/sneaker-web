import React, { useRef } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

import AboutSection from "./AboutSection";
import ConnectSection from "./ConnectSection";
import CallToAction from "./CallToAction";
import Header from "./Header";
import Footer from "./Footer";
import FeaturesSection from "./FeaturesSection";
import PricingTable from "./PricingTable";
import ContactSection from "./ContactSection";
import { useColors } from "../../theme/colors";

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

      <Box
        component="section"
        ref={featuresSectionRef}
        sx={{ scrollMarginTop: "88px" }}
      >
        <FeaturesSection />
      </Box>

      <AboutSection />

      <Box
        component="section"
        ref={pricingSectionRef}
        sx={{ scrollMarginTop: "88px" }}
      >
        <PricingTable
          onMemberSignupClick={handleMemberSignupClick}
          onUserSignupClick={handleUserSignupClick}
        />
      </Box>

      <ConnectSection />

      <CallToAction
        buttonText="Start your business profile"
        onButtonClick={handleMemberSignupClick}
      />

      <Box
        component="section"
        ref={contactSectionRef}
        sx={{ scrollMarginTop: "88px" }}
      >
        <ContactSection />
      </Box>

      <Footer />
    </Box>
  );
}

export default HomePage;
