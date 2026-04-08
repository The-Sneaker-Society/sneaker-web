import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { useClerk } from "@clerk/clerk-react";

const SettingsModal = ({ open, onClose }) => {
  const { signOut } = useClerk();

  const handleLogout = () => {
    signOut();
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "#1a1a1a",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          border: "1px solid #333",
        }}
      >
        <Typography 
          variant="h6" 
          component="h2"
          sx={{ color: "#ffffff", mb: 3 }}
        >
          Settings
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            sx={{ 
              mt: 2, 
              backgroundColor: "#2a2a2a", 
              color: "#ffffff",
              border: "1px solid #444",
              "&:hover": { backgroundColor: "#333" }
            }}
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            variant="contained"
            sx={{ 
              mt: 2, 
              backgroundColor: "#d4af37", 
              color: "#000000",
              "&:hover": { backgroundColor: "#c5a032" }
            }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SettingsModal;
