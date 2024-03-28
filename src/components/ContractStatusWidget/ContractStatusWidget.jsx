import React from "react";
import { Box, Typography } from "@mui/material";

export default function ContractStatusWidget() {
  const dummyData = {
    contractStatusCounts: {
      notStarted: 9,
      done: 30,
      inProgress: 8,
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: "150px",
        width: "100%",
        maxWidth: "300px",
        margin: "auto",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",

        fontWeight: "bold",
        bgcolor: "black",
        color: "white",
        borderRadius: "16px",
        boxShadow: "0px 0px 10px #000",
        border: "2px solid white",
      }}
    >
      <Box sx={{ textAlign: "center", mx: 2 }}>
        <Typography variant="h1" component="div" gutterBottom>
          {dummyData.contractStatusCounts.notStarted}
        </Typography>
        <Typography fontWeight="bold">Not Started</Typography>
      </Box>

      <Box sx={{ textAlign: "center", mx: 2 }}>
        <Typography variant="h1" component="div" gutterBottom>
          {dummyData.contractStatusCounts.done}
        </Typography>
        <Typography fontWeight="bold">Done</Typography>
      </Box>

      <Box sx={{ textAlign: "center", mx: 2 }}>
        <Typography variant="h1" component="div" gutterBottom>
          {dummyData.contractStatusCounts.inProgress}
        </Typography>
        <Typography fontWeight="bold">In Progress</Typography>
      </Box>
    </Box>
  );
}
