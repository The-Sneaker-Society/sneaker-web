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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink } from "react-router-dom";
import ThemeToggle from "../../components/ThemeToggle";
import { useColors } from "../../theme/colors";
import Sneakers from "../../../assets/sneakers-header.png";
import StyledButton from "./StyledButton";

const sections = [
  { id: "Features", title: "Features", path: "/features" },
  { id: "Pricing", title: "Pricing", path: "/pricing" },
  { id: "Contact", title: "Contact", path: "/contact" },
  { id: "Support", title: "Support", path: "/support" },
];

function Header2() {
  const [menuOpen, setMenuOpen] = useState(false);
  const theme = useTheme();
  const colors = useColors();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const navigationLinks = (
    <Stack spacing={1}>
      {sections.map((section) => (
        <Button
          component={RouterLink}
          key={section.id}
          onClick={closeMenu}
          sx={{
            color: colors.textPrimary,
            justifyContent: "flex-start",
            px: 2,
            py: 1.5,
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
          to={section.path}
        >
          {section.title}
        </Button>
      ))}
    </Stack>
  );

  return (
    <>
      <AppBar
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
            justifyContent: "space-between",
            minHeight: { xs: 64, md: 76 },
            px: { xs: 2, md: 4 },
          }}
        >
          <Box
            component={RouterLink}
            sx={{
              alignItems: "center",
              color: "inherit",
              display: "flex",
              gap: 1.5,
              textDecoration: "none",
            }}
            to="/"
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

            <Typography fontWeight={800} variant="h6">
              The Sneaker Society
            </Typography>
          </Box>

          {!isMobile && (
            <Stack alignItems="center" direction="row" spacing={1}>
              {sections.map((section) => (
                <Button
                  component={RouterLink}
                  key={section.id}
                  sx={{
                    color: colors.textPrimary,
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                  to={section.path}
                >
                  {section.title}
                </Button>
              ))}

              <Button
                component={RouterLink}
                sx={{
                  color: colors.textPrimary,
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
                to="/login"
              >
                Log in
              </Button>

              <StyledButton component={RouterLink} to="/member/signup">
                Sign up
              </StyledButton>

              <ThemeToggle />
            </Stack>
          )}

          {isMobile && (
            <Stack alignItems="center" direction="row" spacing={0.5}>
              <ThemeToggle />

              <IconButton
                aria-label="Open navigation menu"
                onClick={() => setMenuOpen(true)}
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
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        ModalProps={{ keepMounted: true }}
        onClose={closeMenu}
        open={menuOpen}
        PaperProps={{
          sx: {
            bgcolor: "background.paper",
            color: "text.primary",
            width: "min(100vw, 360px)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            p: 3,
          }}
        >
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="space-between"
            mb={4}
          >
            <Typography fontWeight={700} variant="h6">
              The Sneaker Society
            </Typography>

            <IconButton
              aria-label="Close navigation menu"
              onClick={closeMenu}
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

          {navigationLinks}

          <Stack spacing={2} sx={{ mt: "auto" }}>
            <Button
              component={RouterLink}
              fullWidth
              onClick={closeMenu}
              sx={{
                border: 1,
                borderColor: "divider",
                color: colors.textPrimary,
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "action.hover",
                },
              }}
              to="/login"
              variant="outlined"
            >
              Log in
            </Button>

            <StyledButton
              component={RouterLink}
              fullWidth
              onClick={closeMenu}
              to="/member/signup"
            >
              Sign up
            </StyledButton>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
}

export default Header2;
