import React, { useState, createContext, useContext } from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";

export const LayoutContext = createContext({ openMobileNav: () => {} });
export const useLayout = () => useContext(LayoutContext);

const Layout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <LayoutContext.Provider value={{ openMobileNav: () => setDrawerOpen(true) }}>
      <Box sx={{ display: "flex" }}>
        {/* Desktop sticky sidebar — hidden on mobile */}
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

        {/* Main content */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </Box>

        {/* Mobile drawer — controlled by context; no rogue hamburger */}
        <Sidebar
          mobileOnly
          mobileDrawerOpen={drawerOpen}
          onMobileDrawerClose={() => setDrawerOpen(false)}
        />
      </Box>
    </LayoutContext.Provider>
  );
};

export default Layout;
