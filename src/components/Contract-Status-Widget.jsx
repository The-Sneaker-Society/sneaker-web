import React from "react";
import { Box, Typography } from "@mui/material";

export default function ContractStatusWidget() {
  const dummyData = {
    contractStatusCounts: {
      notStarted: 8,
      done: 30,
      inProgress: 14,
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          height: "250px",
          width: "60%",
          maxWidth: "600px",
          bgcolor: "black",
          color: "white",
          borderRadius: "16px",
          boxShadow: "0px 0px 10px #000",
          border: "4px solid white",
          padding: "50px",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            component="div"
            gutterBottom
            sx={{ fontSize: "80px", marginBottom: "0px" }}
          >
            {dummyData.contractStatusCounts.notStarted}
          </Typography>
          <Typography variant="h3">Not Started</Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography
            component="div"
            gutterBottom
            sx={{ fontSize: "80px", marginBottom: "0px" }}
          >
            {dummyData.contractStatusCounts.inProgress}
          </Typography>
          <Typography variant="h3">In Progress</Typography>
        </Box>

        <Box sx={{ textAlign: "center" }}>
          <Typography
            component="div"
            gutterBottom
            sx={{ fontSize: "80px", marginBottom: "0px" }}
          >
            {dummyData.contractStatusCounts.done}
          </Typography>
          <Typography variant="h3">Completed</Typography>
        </Box>
      </Box>
    </Box>
  );
}
