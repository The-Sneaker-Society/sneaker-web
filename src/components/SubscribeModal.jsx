import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SubscribeModal = ({ isSubscribed }) => {
  const navigate = useNavigate();

  const handleSubscribe = () => {
    navigate("/member/subscriptions");
  };

  return (
    <Modal
      open={!isSubscribed}
      aria-labelledby="subscribe-modal-title"
      aria-describedby="subscribe-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="subscribe-modal-title" variant="h6" component="h2">
          Subscription Required
        </Typography>
        <Typography id="subscribe-modal-description" sx={{ mt: 2 }}>
          You need to subscribe to access this feature.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubscribe}
          sx={{ mt: 2 }}
        >
          Go to Subscriptions
        </Button>
      </Box>
    </Modal>
  );
};

export default SubscribeModal;