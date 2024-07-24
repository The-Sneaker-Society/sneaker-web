import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { styled } from "@mui/system";

const RedDot = styled("span")({
  height: "10px",
  width: "10px",
  backgroundColor: "red",
  borderRadius: "50%",
  display: "inline-block",
  marginRight: "8px",
});

const WhiteDot = styled("span")({
  height: "15px",
  width: "15px",
  backgroundColor: "white",
  borderRadius: "50%",
  display: "inline-block",
  marginRight: "2px",
});

const CustomButton = styled(Button)({
  display: "flex",
  alignItems: "center",
  color: "white",
});

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
        borderRadius: "15px",
        height: "250px",
        width: "500px",
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
            width: "150px",
          }}
        >
          <Typography sx={{ mt: 1, fontSize: 30 }}>
            +{dummyData.growthPercentage}%
          </Typography>
        </Box>

        <Typography variant="h4" sx={{ paddingTop: "15px" }}>
          <WhiteDot /> Next Payout: {dummyData.nextPayout.date}
        </Typography>
        <Typography sx={{ fontSize: 60 }}>
          ${dummyData.nextPayout.amount}
        </Typography>
      </Stack>
      <Stack direction="column" marginLeft={15}>
        <Button
          variant="outlined"
          size="large"
          sx={{
            mb: 2,
            color: "white",
          }}
          onClick={() => console.log("Navigate to statements")}
        >
          Statements
        </Button>
        <CustomButton
          variant="outlined"
          size="large"
          onClick={() => console.log("Navigate to Stripe Dashboard")}
        >
          <RedDot />
          Stripe
        </CustomButton>
      </Stack>
    </Box>
  );
}

export default StripeWidget;
