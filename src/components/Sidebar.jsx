import React, { useState } from "react";
import { Box, List, IconButton, Drawer } from "@mui/material";
import {
  ExploreOutlined,
  GroupsOutlined,
  Inventory2Outlined,
  ChatBubbleOutline,
  SettingsOutlined,
  DirectionsRunOutlined,
  Menu,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useColors } from "../theme/colors";
import SidebarItem from "./SidebarItem";
import ThemeToggle from "./ThemeToggle";
import LogoBlack from "../assets/ss-logo-black.svg";
import LogoWhite from "../assets/ss-logo.svg";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const colors = useColors();
  const navigate = useNavigate();

  const toggleDrawer = (isOpen) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(isOpen);
  };

  const navItems = (
    <>
      <SidebarItem
        text="My Society"
        icon={<DirectionsRunOutlined />}
        onClick={() => navigate("/member/my-society")}
      />
      <SidebarItem
        text="Discover"
        icon={<ExploreOutlined />}
        onClick={() => navigate("/member/discover")}
      />
      <SidebarItem
        text="Groups"
        icon={<GroupsOutlined />}
        onClick={() => navigate("/member/groups")}
      />
      <SidebarItem
        text="The Vault"
        icon={<Inventory2Outlined />}
        onClick={() => navigate("/member/the-vault")}
      />
      <SidebarItem
        text="Messages"
        icon={<ChatBubbleOutline />}
        notification={5}
        onClick={() => navigate("/member/messages")}
      />
    </>
  );

  const settingsItem = (
    <Box sx={{ padding: 2, borderTop: `1px solid ${colors.border}` }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <SidebarItem
          text="Settings"
          icon={<SettingsOutlined />}
          onClick={() => navigate("/member/settings")}
        />
        <ThemeToggle />
      </Box>
    </Box>
  );

  const logoBox = (
    <Box sx={{ padding: 2, textAlign: "center" }}>
      <Box
        component="img"
        src={colors.isDark ? LogoBlack : LogoWhite}
        alt="Logo"
        sx={{
          width: "80%",
          maxWidth: "300px",
          height: "auto",
          my: 4,
          cursor: "pointer",
        }}
        onClick={() => navigate("/member/dashboard")}
      />
    </Box>
  );

  return (
    <Box>
      {/* Mobile menu button */}
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer(true)}
        sx={{ display: open ? "none" : "block", position: "absolute", left: 0 }}
      >
        <Menu />
      </IconButton>

      {/* Collapsible Drawer for mobile */}
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 250,
            height: "100vh",
            backgroundColor: colors.sidebarBg,
            display: "flex",
            flexDirection: "column",
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          {logoBox}
          <List component="nav" aria-label="sidebar nav" sx={{ flexGrow: 1 }}>
            {navItems}
          </List>
          {settingsItem}
        </Box>
      </Drawer>

      {/* Full Sidebar for larger screens */}
      <Box sx={{ display: { xs: "none", sm: "block" } }}>
        <Box
          sx={{
            width: 250,
            height: "100vh",
            backgroundColor: colors.sidebarBg,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {logoBox}
          <List component="nav" aria-label="sidebar nav" sx={{ flexGrow: 1 }}>
            {navItems}
          </List>
          {settingsItem}
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
