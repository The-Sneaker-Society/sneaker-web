import React from "react";
import { Modal, Box, Typography } from "@mui/material";

const GetStartedModal = ({ open, onClose }) => (
  <Modal
    open={open}
    onClose={onClose}
    aria-labelledby="get-started-modal-title"
    aria-describedby="get-started-modal-description"
    BackdropProps={{
      sx: {
        backgroundColor: 'rgba(0,0,0,0.85)'
      }
    }}
  >
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        minWidth: 320,
        textAlign: 'center',
      }}
    >
      <Typography id="get-started-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
        Let's get Started with your first contract
      </Typography>
    </Box>
  </Modal>
);

export default GetStartedModal;
