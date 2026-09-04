import { useClerk, useUser } from "@clerk/clerk-react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { Menu } from "@mui/icons-material";
import GetStartedModal from "../../components/GetStartedModal";
import { useLayout } from "../../components/Layout";
import { useColors } from "../../theme/colors";
import { UserContractsWidget } from "./UserContractsWidget";
import { UserMessagesWidget } from "./UserMessagesWidget";

import { useState } from "react";

const UserDashboard = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const colors = useColors();
  const { openMobileNav } = useLayout();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ height: "100vh", width: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <Box
        sx={{
          px: { xs: 2.5, sm: 3.5 },
          pt: 3,
          pb: 2.5,
          borderBottom: `1px solid ${colors.borderSubtle}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            onClick={openMobileNav}
            sx={{ display: { xs: "flex", sm: "none" }, color: colors.textPrimary, p: 0.5 }}
          >
            <Menu fontSize="small" />
          </IconButton>
          <Box>
            <Typography
              sx={{
                fontSize: "0.7rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: colors.textSecondary,
                mb: 0.5,
              }}
            >
              My Sneakers
            </Typography>
            <Typography
              fontWeight="bold"
              sx={{ fontSize: { xs: "1.4rem", sm: "1.75rem", md: "2rem" }, lineHeight: 1.1 }}
            >
              Welcome, {user?.firstName || "User"}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          size="small"
          onClick={() => signOut()}
          sx={{
            color: colors.textPrimary,
            borderColor: colors.borderSecondary,
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.875rem",
            borderRadius: 1.5,
            px: 2.5,
            py: 0.75,
            "&:hover": { bgcolor: `${colors.textPrimary}08`, borderColor: colors.textPrimary },
          }}
        >
          Log out
        </Button>
      </Box>

      {/* Body */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2.5,
          p: { xs: 2, sm: 2.5 },
          alignItems: "stretch",
          overflowY: { xs: "auto", md: "hidden" },
          minHeight: 0,
        }}
      >
        {/* Left column — requests */}
        <Box sx={{ flex: 1.4, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <UserContractsWidget />
        </Box>

        {/* Right column — messages */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: 0,
          }}
        >
          <UserMessagesWidget />
        </Box>
      </Box>

      {/* Modal for getting started */}
      <GetStartedModal open={open} onClose={handleClose} />
    </Box>
  );
};

export default UserDashboard;
