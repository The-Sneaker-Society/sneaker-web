import React, { useState, useEffect } from "react";
import { Box, CircularProgress, useMediaQuery, useTheme } from "@mui/material";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        sx={{
          width: 250,
          height: "100vh",
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: { xs: "none", sm: "block" },
        }}
      >
        <Sidebar />
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          overflowY: "auto",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isLoading ? <CircularProgress /> : children}
      </Box>
      {isMobile && <Sidebar />}
    </Box>
  );
};

export default Layout;
