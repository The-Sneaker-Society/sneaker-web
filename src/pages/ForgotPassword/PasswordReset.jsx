import React from "react";
import { Typography, Box, Button, Link, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const PasswordReset = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Stack
        direction="column"
        sx={{
          paddingLeft: "40px",
          paddingTop: "40px",
          paddingBottom: "20px",
          alignContent: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <ArrowBackIcon
          fontSize="large"
          sx={{ color: "white", marginBottom: "30px" }}
          onClick={() => navigate(-1)}
          aria-label="Go back"
        />
        <Typography
          variant="h3"
          sx={{
            alignContent: "center",
            display: "flex",
            fontWeight: "bold",
            color: "white",
            marginBottom: "20px",
          }}
        >
          Password Reset
        </Typography>
        <Typography
          variant="h6"
          sx={{
            alignContent: "center",
            display: "flex",
            fontWeight: "bold",
            color: "white",
            paddingBottom: "15px",
          }}
        >
          Your password has been successfully reset. Click confirm to set a new
          password
        </Typography>
      </Stack>
      <Stack
        direction="column"
        sx={{
          paddingLeft: "40px",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          sx={{ borderRadius: "10px", width: "200px" }}
          onClick={() => {
            navigate("/setanewpassword");
          }}
        >
          Confirm
        </Button>
      </Stack>
    </Box>
  );
};

export default PasswordReset;
