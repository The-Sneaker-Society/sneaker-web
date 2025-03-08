import { Box, Typography } from "@mui/material";
import { ContractListWidget } from "./ContractListWidget";

export const ContractPage = () => {
  return (
    <Box sx={{ width: "100%", height: '100vh' }}>
      <Typography variant="h1">Contracts</Typography>
      <ContractListWidget />
    </Box>
  );
};
