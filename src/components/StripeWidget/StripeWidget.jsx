import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";

function StripeWidget() {
  const dummyData = {
    nextPayout: {
      date: "2 days",
      amount: 1500,
    },
    growthPercentage: 20,
  };

  return (
    <Box
      sx={{
        border: "3px solid #ccc",
        borderRadius: "10px",
        height: "250px",
        width: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Stack>
        <Box
          sx={{
            display: "flex",
            bgcolor: "green",
            borderRadius: "50px",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ mt: 1, fontSize: 30 }}>
            +{dummyData.growthPercentage}%
          </Typography>
        </Box>
        <Typography variant="h4">
          Next Payout: {dummyData.nextPayout.date}
        </Typography>
        <Typography sx={{ fontSize: 60 }}>
          ${dummyData.nextPayout.amount}
        </Typography>
      </Stack>
      <Stack direction="column" marginLeft={25}>
        <Button
          variant="outlined"
          sx={{
            mb: 2,
            color: "white",
          }}
          onClick={() => console.log("Navigate to statements")}
        >
          Statements
        </Button>
        <Button
          variant="outlined"
          sx={{
            color: "white",
          }}
          onClick={() => console.log("Navigate to Stripe Dashboard")}
        >
          Stripe
        </Button>
      </Stack>
    </Box>
  );
}

export default StripeWidget;
