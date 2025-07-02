import React from "react";
import { Box } from "@mui/material";
import StyledButton from "../pages/HomePage/StyledButton";
import { useNavigate } from "react-router-dom";

const ContractReviewButtons = () => {
  const navigate = useNavigate();

  const handleMessage = () => {
    navigate("/member/chat/chatId");
  };

  const handleSupport = () => {
    window.location.href = "mailto:support@thesneakerssociety.com";
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        gap: 4,
      }}
    >
      <StyledButton variant="contained" onClick={handleMessage} sx={{}}>
        Message
      </StyledButton>
      <StyledButton variant="contained" onClick={handleSupport} sx={{}}>
        Support
      </StyledButton>
    </Box>
  );
};

export default ContractReviewButtons;
