import React, { useState, useRef, useCallback } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useColors } from "../../theme/colors";
import MySocietyFeed from "./MySocietyFeed";
import DiscoverFeed from "./DiscoverFeed";

const TABS = [
  { key: "my-society", label: "My Society" },
  { key: "discover", label: "Discover" },
];

const SocietyPage = ({ defaultTab = "my-society" }) => {
  const colors = useColors();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Preserve scroll position per tab
  const scrollPositions = useRef({ "my-society": 0, discover: 0 });
  const scrollContainerRef = useRef(null);

  const handleTabSwitch = useCallback(
    (tabKey) => {
      if (tabKey === activeTab) return;

      // Save current scroll position
      if (scrollContainerRef.current) {
        scrollPositions.current[activeTab] = scrollContainerRef.current.scrollTop;
      }

      setActiveTab(tabKey);
      navigate(`/member/${tabKey}`, { replace: true });

      // Restore scroll position for the new tab on next render
      requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop =
            scrollPositions.current[tabKey] || 0;
        }
      });
    },
    [activeTab, navigate]
  );

  return (
    <Box
      ref={scrollContainerRef}
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: colors.isDark ? "#000" : "#fff",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: "600px", md: "750px" },
          px: { xs: 2, sm: 3 },
          pt: { xs: 4, sm: 5 },
          pb: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: { xs: "2rem", sm: "2.8rem", md: "3.2rem" },
            color: "#FFD100",
            mb: 3,
          }}
        >
          Society
        </Typography>

        {/* Tab Switcher */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            borderBottom: `2px solid ${colors.isDark ? "#222" : "#e0e0e0"}`,
            mb: 3,
          }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <Button
                key={tab.key}
                onClick={() => handleTabSwitch(tab.key)}
                disableRipple={isActive}
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  textTransform: "none",
                  color: isActive ? "#FFD100" : colors.textSecondary,
                  borderBottom: isActive ? "3px solid #FFD100" : "3px solid transparent",
                  borderRadius: 0,
                  mb: "-2px",
                  px: 2,
                  pb: 1,
                  "&:hover": {
                    backgroundColor: "transparent",
                    color: isActive ? "#FFD100" : colors.textPrimary,
                  },
                }}
              >
                {tab.label}
              </Button>
            );
          })}
        </Box>
      </Box>

      {/* Tab Content */}
      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: "600px", md: "750px" },
          px: { xs: 2, sm: 3 },
          pb: 10,
        }}
      >
        {activeTab === "my-society" && <MySocietyFeed />}
        {activeTab === "discover" && <DiscoverFeed />}
      </Box>
    </Box>
  );
};

export default SocietyPage;
