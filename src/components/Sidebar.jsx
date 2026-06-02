import React from "react";
import { Box, List, Drawer } from "@mui/material";
import {
  ExploreOutlined,
  GroupsOutlined,
  Inventory2Outlined,
  ChatBubbleOutline,
  SettingsOutlined,
  DirectionsRunOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useColors } from "../theme/colors";
import SidebarItem from "./SidebarItem";
import ThemeToggle from "./ThemeToggle";
import LogoBlack from "../assets/ss-logo-black.svg";
import LogoWhite from "../assets/ss-logo.svg";

const Sidebar = ({
  mobileOnly = false,
  mobileDrawerOpen = false,
  onMobileDrawerClose = () => {},
}) => {
  const colors = useColors();
  const navigate = useNavigate();

  const navItems = (
    <>
      <SidebarItem text="My Society"  icon={<DirectionsRunOutlined />} onClick={() => navigate("/member/my-society")} />
      <SidebarItem text="Discover"    icon={<ExploreOutlined />}        onClick={() => navigate("/member/discover")} />
      <SidebarItem text="Groups"      icon={<GroupsOutlined />}         onClick={() => navigate("/member/groups")} />
      <SidebarItem text="The Vault"   icon={<Inventory2Outlined />}     onClick={() => navigate("/member/the-vault")} />
      <SidebarItem text="Messages"    icon={<ChatBubbleOutline />}      notification={5} onClick={() => navigate("/member/messages")} />
    </>
  );

  const settingsItem = (
    <Box sx={{ padding: 2, borderTop: `1px solid ${colors.border}` }}>
      <SidebarItem text="Settings" icon={<SettingsOutlined />} onClick={() => navigate("/member/settings")} />
    </Box>
  );

  const logoBox = (
    <Box sx={{ padding: 2, textAlign: "center", position: "relative" }}>
      <Box
        component="img"
        src={colors.isDark ? LogoBlack : LogoWhite}
        alt="Logo"
        sx={{ width: "80%", maxWidth: "300px", height: "auto", my: 4, cursor: "pointer" }}
        onClick={() => navigate("/member/dashboard")}
      />
      <Box sx={{ position: "absolute", top: 8, right: 8 }}>
        <ThemeToggle />
      </Box>
    </Box>
  );

  const drawerContent = (
    <Box
      sx={{
        width: 250,
        height: "100vh",
        backgroundColor: colors.sidebarBg,
        display: "flex",
        flexDirection: "column",
      }}
      role="presentation"
      onClick={onMobileDrawerClose}
      onKeyDown={onMobileDrawerClose}
    >
      {logoBox}
      <List component="nav" aria-label="sidebar nav" sx={{ flexGrow: 1 }}>
        {navItems}
      </List>
      {settingsItem}
    </Box>
  );

  // ── Mobile-only mode: just the controlled drawer, no hamburger ─────────────
  if (mobileOnly) {
    return (
      <Drawer anchor="left" open={mobileDrawerOpen} onClose={onMobileDrawerClose}>
        {drawerContent}
      </Drawer>
    );
  }

  // ── Desktop mode: full sidebar column ──────────────────────────────────────
  return (
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
  );
};

export default Sidebar;
