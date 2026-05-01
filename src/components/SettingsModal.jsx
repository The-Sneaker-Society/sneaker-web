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
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2">
          Settings
        </Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, mr: 2 }}
          onClick={onClose}
        >
          Close
        </Button>
        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 2 }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Modal>
  );
};

export default SettingsModal;
