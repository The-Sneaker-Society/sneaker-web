import React from "react";
import { Typography, Box, Button, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const SuccessfulPage = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Stack
        direction="column"
        sx={{
          paddingLeft: "40px",
          paddingTop: "40px",
          paddingBottom: "30px",
          alignContent: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <ArrowBackIcon
          fontSize="large"
          sx={{ color: "white", marginBottom: " 30px" }}
          onClick={() => navigate(-1)}
        />
        <Typography
          variant="h3"
          sx={{
            alignContent: "center",
            display: "flex",
            fontWeight: "bold",
            color: "white",
          }}
        >
          Successful
        </Typography>
        <Typography
          variant="h5"
          sx={{
            alignContent: "center",
            display: "flex",
            color: "white",
            paddingTop: "10px",
            marginBottom: "20px",
          }}
        >
          Congratulations! Your password has been changed. Click below to login
        </Typography>
        <>
          <Stack
            direction="column"
            sx={{
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              sx={{ borderRadius: "10px", width: "200px" }}
              onClick={() => navigate("/login")}
            >
              Return to login
            </Button>
          </Stack>
        </>
      </Stack>
    </Box>
  );
};

export default SuccessfulPage;
