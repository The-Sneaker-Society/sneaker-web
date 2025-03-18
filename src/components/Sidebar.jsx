import React, { useState } from "react";
import {
  Box,
  List,
  IconButton,
  Drawer,
} from "@mui/material";
import {
  ExploreOutlined,
  GroupsOutlined,
  Inventory2Outlined,
  ChatBubbleOutline,
  SettingsOutlined,
  DirectionsRunOutlined,
  Menu,
} from "@mui/icons-material";
import SidebarItem from "./SidebarItem";
import Logo from "../assets/ss-logo-black.svg";
import StyledButton from "../pages/HomePage/StyledButton";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (isOpen) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setOpen(isOpen);
  };

  return (
    <Box>
      {/* Mobile menu button */}
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer(true)}
        sx={{ display: { xs: "block", sm: "none" } }}
      >
        <Menu />
      </IconButton>

      {/* Collapsible Drawer for mobile view */}
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 250,
            height: "100vh",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          {/* Sidebar Content */}
          <Box sx={{ padding: 2, textAlign: "center" }}>
          <Box
              component="img"
              src={Logo}
              alt="Logo"
              sx={{
                width: "80%",
                maxWidth: "300px",
                height: "auto",
                my: 4,
              }}
            />
          </Box>

          <List
            component="nav"
            aria-label="main mailbox folders"
            sx={{ flexGrow: 1 }}
          >
            <SidebarItem text="My Society" icon={<DirectionsRunOutlined />} />
            <SidebarItem text="Discover" icon={<ExploreOutlined />} />
            <SidebarItem text="Groups" icon={<GroupsOutlined />} />
            <SidebarItem text="The Vault" icon={<Inventory2Outlined />} />
            <SidebarItem
              text="Messages"
              icon={<ChatBubbleOutline />}
              notification={5} // Adding a notification badge with count 5
            />
          </List>

          <Box sx={{ padding: 2, borderTop: "1px solid #eee" }}>
            <SidebarItem text="Settings" icon={<SettingsOutlined />} />
          </Box>
        </Box>
      </Drawer>

      {/* Full Sidebar for larger screens */}
      <Box sx={{ display: { xs: "none", sm: "block" } }}>
        <Box
          sx={{
            width: 250,
            height: "100vh",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Sidebar Content */}
          <Box sx={{ padding: 2, textAlign: "center" }}>
            <Box
              component="img"
              src={Logo}
              alt="Logo"
              sx={{
                width: "80%",
                maxWidth: "300px",
                height: "auto",
                my: 4,
              }}
            />
          </Box>

          <List
            component="nav"
            aria-label="main mailbox folders"
            sx={{ flexGrow: 1 }}
          >
            <SidebarItem text="My Society" icon={<DirectionsRunOutlined />} />
            <SidebarItem text="Discover" icon={<ExploreOutlined />} />
            <SidebarItem text="Groups" icon={<GroupsOutlined />} />
            <SidebarItem text="The Vault" icon={<Inventory2Outlined />} />
            <SidebarItem
              text="Messages"
              icon={<ChatBubbleOutline />}
              notification={5} // test
            />
          </List>

          <Box sx={{ padding: 2, borderTop: "1px solid #eee" }}>
            <SidebarItem text="Settings" icon={<SettingsOutlined />} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
