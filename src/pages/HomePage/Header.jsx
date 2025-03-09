import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Hidden from "@mui/material/Hidden";
import Tabs from "@mui/material/Tabs";
import { Tab, IconButton, Box, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Sneakers from "../../../assets/sneakers-header.png";
import StyledButton from "./StyledButton";

const Header = ({
  pricingRef,
  contactRef,
  featureRef,
  onButtonClick,
  onLoginButtonClick,
  onRedirectClick,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuItemClick = (ref) => {
    setSidebarOpen(false); // Close sidebar after clicking
    ref(); // Scroll to the section
  };

  const sidebarStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%", // Full width
    height: "100%",
    backgroundColor: "black",
    color: "white",
    display: sidebarOpen ? "block" : "none", // Toggle visibility
    zIndex: 10000,
    padding: "20px",
    boxSizing: "border-box",
  };

  const overlayStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: sidebarOpen ? "block" : "none", // Show overlay when sidebar is open
    zIndex: 9999,
  };

  return (
    <>
      <AppBar position="sticky" style={{ zIndex: 9999, background: "black" }}>
        <Toolbar
          style={{
            minHeight: "120px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* Logo visible on all screen sizes */}
          <img src={Sneakers} alt="Logo" style={{ height: 50 }} />

          {/* Desktop Navigation */}
          <Hidden mdDown>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Tabs textColor="inherit">
                <Tab label="Features" onClick={featureRef} />
                <Tab label="Pricing" onClick={pricingRef} />
                <Tab label="Contact" onClick={contactRef} />
              </Tabs>

              <div style={{ padding: "20px" }}>
                <StyledButton onClick={onLoginButtonClick}>Login</StyledButton>{" "}
              </div>
              <StyledButton onClick={onRedirectClick}>Sign Up</StyledButton>
            </div>
          </Hidden>

          {/* Mobile Hamburger Button */}
          <Hidden mdUp>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleSidebar}
            >
              <MenuIcon />
            </IconButton>
          </Hidden>
        </Toolbar>
      </AppBar>

      {/* Overlay for sidebar (mobile only) */}
      <Hidden mdUp>
        <div style={overlayStyles} onClick={toggleSidebar}></div>
      </Hidden>

      {/* Custom Sidebar (mobile only) */}
      <Hidden mdUp>
        <div style={sidebarStyles}>
          <IconButton
            onClick={toggleSidebar}
            style={{ color: "white", marginBottom: "20px" }}
          >
            <CloseIcon />
          </IconButton>

          {/* Centering content and adjusting font size only on mobile */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "70%", // Centering content within 70% height of the sidebar
            }}
          >
            <Typography
              sx={{
                fontSize: "30px", // Adjusting font size for mobile
                color: "white",
                marginBottom: "20px",
                cursor: "pointer",
              }}
              onClick={() => handleMenuItemClick(featureRef)}
            >
              Features
            </Typography>
            <Typography
              sx={{
                fontSize: "30px", // Adjusting font size for mobile
                color: "white",
                marginBottom: "20px",
                cursor: "pointer",
              }}
              onClick={() => handleMenuItemClick(pricingRef)}
            >
              Pricing
            </Typography>
            <Typography
              sx={{
                fontSize: "30px", // Adjusting font size for mobile
                color: "white",
                marginBottom: "20px",
                cursor: "pointer",
              }}
              onClick={() => handleMenuItemClick(contactRef)}
            >
              Contact
            </Typography>
            <StyledButton
              sx={{
                fontSize: "30px", // Adjusting button font size for mobile
              }}
              onClick={onButtonClick}
            >
              Sign Up
            </StyledButton>
          </Box>
        </div>
      </Hidden>
    </>
  );
};

export default Header;
