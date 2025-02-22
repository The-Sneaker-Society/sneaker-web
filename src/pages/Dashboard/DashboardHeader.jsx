import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import StyledButton from "../HomePage/StackedButton";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import Logo from "/assets/SNEAKER SOCIETY (Transparency).png";
import { Link as RouterLink } from "react-router-dom";

const DashboardHeader = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
  };

  const handleProfileClick = () => {
    navigate("user/update-profile");
  };
  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: "black" }}>
      <Toolbar
        sx={{
          width: "100%",
          justifyContent: "space-between",
          padding: "0 16px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <RouterLink to="/dashboard">
            <Box
              component="img"
              src={Logo}
              alt="Logo"
              sx={{
                width: "100px",
                height: "auto",
                display: "block",
                margin: 0,
                padding: "0",
                cursor: "pointer",
                "@media (max-width:600px)": {
                  width: "100px",
                },
              }}
            />
          </RouterLink>
        </Box>
        <Box sx={{ display: "flex" }}>
          <StyledButton onClick={handleProfileClick}>Profile</StyledButton>
          <StyledButton onClick={handleLogout}>Log Out</StyledButton>
        </Box>{" "}
      </Toolbar>
    </AppBar>
  );
};

export default DashboardHeader;
