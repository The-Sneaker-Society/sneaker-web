import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useLocation } from "react-router-dom";
import { useColors } from "../../theme/colors";

const sections = [
  { id: "HomePage", title: "Home Page", path: "/" },
  { id: "Contact", title: "Contact", path: "/contact" },
];

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const theme = useTheme();
  const colors = useColors();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [activeSection, setActiveSection] = useState(sections[0].id);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      const sectionPositions = sections
        .map((section) => {
          const element = document.getElementById(section.id);

          return element
            ? { id: section.id, position: element.offsetTop }
            : null;
        })
        .filter(Boolean);

      if (!sectionPositions.length) {
        return;
      }

      const active = sectionPositions.reduce(
        (currentActive, section) =>
          scrollPosition >= section.position ? section : currentActive,
        sectionPositions[0],
      );

      setActiveSection(active.id);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  const handleNavigation = (sectionId) => {
    setActiveSection(sectionId);

    if (isSmallScreen) {
      toggleSidebar?.();
    }
  };

  return (
    <Drawer
      anchor="left"
      ModalProps={{ keepMounted: true }}
      onClose={toggleSidebar}
      open={sidebarOpen}
      PaperProps={{
        sx: {
          bgcolor: "background.paper",
          color: "text.primary",
          width: { xs: "min(86vw, 320px)", sm: 280 },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          p: 2,
        }}
      >
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography fontWeight={700} variant="h6">
            The Sneaker Society
          </Typography>

          <IconButton
            aria-label="Close sidebar"
            onClick={toggleSidebar}
            sx={{
              color: colors.textPrimary,
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <List disablePadding>
          {sections.map((section) => {
            const isActive =
              activeSection === section.id ||
              location.pathname === section.path;

            return (
              <ListItemButton
                component={Link}
                key={section.id}
                onClick={() => handleNavigation(section.id)}
                selected={isActive}
                sx={{
                  alignItems: "flex-start",
                  borderBottom: 2,
                  borderColor: isActive ? "primary.main" : "transparent",
                  color: isActive ? colors.textPrimary : colors.textSecondary,
                  mb: 0.5,
                  px: 1.5,
                  py: 1.25,

                  "&.Mui-selected": {
                    bgcolor: "action.selected",
                  },

                  "&.Mui-selected:hover": {
                    bgcolor: "action.selected",
                  },

                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
                to={section.path}
              >
                <ListItemText
                  primary={section.title}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 700 : 500,
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
