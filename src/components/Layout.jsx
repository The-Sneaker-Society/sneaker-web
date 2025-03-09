import React, { useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  },);

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 250,
          height: "100vh",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Sidebar />
      </Box>

      {/* Main Content */}
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
        {isLoading ? (
          <CircularProgress />
        ) : (
          children
        )}
      </Box>
    </Box>
  );
};

export default Layout;