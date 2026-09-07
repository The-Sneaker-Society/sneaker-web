import React, { useState, useEffect } from "react";
import { Box, List, Drawer } from "@mui/material";
import {
  GroupsOutlined,
  ChatBubbleOutline,
  SettingsOutlined,
  DirectionsRunOutlined,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { useColors } from "../theme/colors";
import SidebarItem from "./SidebarItem";
import ThemeToggle from "./ThemeToggle";
import LogoBlack from "../assets/ss-logo-black.svg";
import LogoWhite from "../assets/ss-logo.svg";

const GET_SIDEBAR_CHATS = gql`
  query GetSidebarChats {
    currentMember {
      id
      chats {
        id
        messages {
          id
          createdAt
          senderType
        }
      }
    }
  }
`;

const Sidebar = ({
  mobileOnly = false,
  mobileDrawerOpen = false,
  onMobileDrawerClose = () => {},
}) => {
  const colors = useColors();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  // Layout is shared across sections — derive the section from the URL so
  // users never see member routes (every one 401s on role guards).
  const isUserSection = pathname.startsWith("/user");

  const [readVersion, setReadVersion] = useState(0);

  // Poll chats periodically for members to keep unread badges fresh
  const { data: chatData } = useQuery(GET_SIDEBAR_CHATS, {
    skip: isUserSection,
    fetchPolicy: "cache-and-network",
    pollInterval: 15000,
  });

  const activeChatId = pathname.startsWith("/member/chats/")
    ? pathname.replace("/member/chats/", "").split("/")[0]
    : null;

  // Mark current chat as read immediately when viewing it
  useEffect(() => {
    if (activeChatId) {
      try {
        localStorage.setItem(`last_read_chat_${activeChatId}`, String(Date.now()));
        setReadVersion((v) => v + 1);
      } catch (e) {
        // ignore
      }
    }
  }, [activeChatId]);

  // Listen for read events dispatched when chats are opened or updated
  useEffect(() => {
    const handleChatRead = () => setReadVersion((v) => v + 1);
    window.addEventListener("chat_read", handleChatRead);
    window.addEventListener("storage", handleChatRead);
    return () => {
      window.removeEventListener("chat_read", handleChatRead);
      window.removeEventListener("storage", handleChatRead);
    };
  }, []);

  const chats = chatData?.currentMember?.chats || [];
  const unreadChatCount = chats.reduce((count, chat) => {
    if (!chat || !chat.id || !chat.messages || chat.messages.length === 0) {
      return count;
    }
    if (activeChatId && String(chat.id) === String(activeChatId)) {
      return count;
    }
    const sorted = [...chat.messages].sort(
      (a, b) => Number(a.createdAt) - Number(b.createdAt)
    );
    const lastMsg = sorted[sorted.length - 1];
    if (!lastMsg || lastMsg.senderType !== "USER") {
      return count;
    }
    try {
      const lastSeen = localStorage.getItem(`last_read_chat_${chat.id}`);
      if (lastSeen) {
        const lastSeenTime = Number(lastSeen);
        const msgTime = Number(lastMsg.createdAt);
        if (!isNaN(lastSeenTime) && !isNaN(msgTime) && lastSeenTime >= msgTime) {
          return count;
        }
      }
    } catch (e) {
      // ignore
    }
    return count + 1;
  }, 0);

  const navItems = isUserSection ? (
    <>
      <SidebarItem text="Dashboard"  icon={<DirectionsRunOutlined />} onClick={() => navigate("/user/dashboard")} />
      <SidebarItem text="My Society" icon={<DirectionsRunOutlined />} onClick={() => navigate("/mysociety")} />
    </>
  ) : (
    <>
      <SidebarItem text="Dashboard" icon={<DirectionsRunOutlined />} onClick={() => navigate("/member/dashboard")} />
      <SidebarItem text="Groups"    icon={<GroupsOutlined />}         onClick={() => navigate("/member/groups")} />
      <SidebarItem text="Messages"  icon={<ChatBubbleOutline />}      notification={unreadChatCount} onClick={() => navigate("/member/messages")} />
    </>
  );

  const settingsItem = (
    <Box sx={{ padding: 2, borderTop: `1px solid ${colors.border}` }}>
      <SidebarItem
        text="Settings"
        icon={<SettingsOutlined />}
        onClick={() => navigate(isUserSection ? "/user/update-profile" : "/member/settings")}
      />
    </Box>
  );

  const logoBox = (
    <Box sx={{ padding: 2, textAlign: "center", position: "relative" }}>
      <Box
        component="img"
        src={colors.isDark ? LogoBlack : LogoWhite}
        alt="Logo"
        sx={{ width: "80%", maxWidth: "300px", height: "auto", my: 4, cursor: "pointer" }}
        onClick={() => navigate(isUserSection ? "/user/dashboard" : "/member/dashboard")}
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
