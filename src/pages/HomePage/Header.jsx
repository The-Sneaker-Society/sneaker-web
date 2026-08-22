import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import ThemeToggle from "../../components/ThemeToggle";
import { useColors } from "../../theme/colors";
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
  const colors = useColors();

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleMenuItemClick = (callback) => {
    closeSidebar();

    if (typeof callback === "function") {
      callback();
    }
  };

  const navigationItems = [
    {
      label: "Features",
      onClick: () => handleMenuItemClick(featureRef),
    },
    {
      label: "Pricing",
      onClick: () => handleMenuItemClick(pricingRef),
    },
    {
      label: "Contact",
      onClick: () => handleMenuItemClick(contactRef),
    },
  ];

  const mobileNavigation = (
    <Box
      sx={{
        width: "min(100vw, 360px)",
        height: "100%",
        bgcolor: colors.surfaceBg,
        color: colors.textPrimary,
        display: "flex",
        flexDirection: "column",
        p: 3,
      }}
    >
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        mb={4}
      >
        <Typography component="span" fontWeight={700} variant="h6">
          The Sneaker Society
        </Typography>

        <IconButton
          aria-label="Close navigation menu"
          onClick={closeSidebar}
          sx={{
            color: colors.textPrimary,
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Stack>

      <Stack spacing={1}>
        {navigationItems.map((item) => (
          <Button
            key={item.label}
            color="inherit"
            onClick={item.onClick}
            sx={{
              justifyContent: "flex-start",
              px: 2,
              py: 1.5,
              color: colors.textPrimary,
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            {item.label}
          </Button>
        ))}
      </Stack>

      <Box sx={{ mt: "auto" }}>
        <Stack spacing={2}>
          <Button
            color="inherit"
            fullWidth
            onClick={() => {
              closeSidebar();
              onLoginButtonClick?.();
            }}
            sx={{
              color: colors.textPrimary,
              border: 1,
              borderColor: "divider",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: "action.hover",
              },
            }}
            variant="outlined"
          >
            Log in
          </Button>

          <StyledButton
            fullWidth
            onClick={() => {
              closeSidebar();
              onButtonClick?.();
            }}
          >
            Sign up
          </StyledButton>
        </Stack>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        component="header"
        elevation={0}
        position="sticky"
        sx={{
          bgcolor: colors.surfaceBg,
          borderBottom: 1,
          borderColor: "divider",
          color: colors.textPrimary,
        }}
      >
        <Toolbar
          sx={{
            gap: 2,
            justifyContent: "space-between",
            minHeight: { xs: 64, md: 76 },
            px: { xs: 2, md: 4 },
          }}
        >
          <Box
            aria-label="The Sneaker Society home"
            component="button"
            onClick={onRedirectClick}
            sx={{
              alignItems: "center",
              appearance: "none",
              background: "transparent",
              border: 0,
              color: "inherit",
              cursor: "pointer",
              display: "flex",
              gap: 1.5,
              p: 0,
            }}
            type="button"
          >
            <Box
              alt="The Sneaker Society"
              component="img"
              src={Sneakers}
              sx={{
                display: { xs: "none", sm: "block" },
                height: 40,
                objectFit: "contain",
                width: "auto",
              }}
            />

            <Typography
              component="span"
              sx={{
                color: colors.textPrimary,
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
              variant="h6"
            >
              The Sneaker Society
            </Typography>
          </Box>

          <Stack
            alignItems="center"
            direction="row"
            spacing={1}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {navigationItems.map((item) => (
              <Button
                key={item.label}
                color="inherit"
                onClick={item.onClick}
                sx={{
                  color: colors.textPrimary,
                  px: 1.5,
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}

            <Button
              color="inherit"
              onClick={onLoginButtonClick}
              sx={{
                color: colors.textPrimary,
                ml: 1,
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              Log in
            </Button>

            <StyledButton onClick={onButtonClick}>Sign up</StyledButton>

            <ThemeToggle />
          </Stack>

          <Stack
            alignItems="center"
            direction="row"
            spacing={0.5}
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            <ThemeToggle />

            <IconButton
              aria-label="Open navigation menu"
              onClick={() => setSidebarOpen(true)}
              sx={{
                color: colors.textPrimary,
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        ModalProps={{ keepMounted: true }}
        onClose={closeSidebar}
        open={sidebarOpen}
        PaperProps={{
          sx: {
            bgcolor: "background.paper",
            color: "text.primary",
          },
        }}
      >
        {mobileNavigation}
      </Drawer>
    </>
  );
};

export default Header;
