import { Box, Typography } from "@mui/material";
import GroupCreationForm from "./GroupCreationForm";

const GroupsPage = () => {
  return (
    <Box sx={{  pt: 4 }}>
      <Typography
        variant="h1"
        sx={{ color: "#FFD100", fontWeight: "bold", mb: 4, textAlign: "center" }}
      >
        Groups
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        <Box sx={{ maxWidth: 700, width: "100%" }}>
          <GroupCreationForm />
        </Box>
      </Box>
    </Box>
  );
};

export default GroupsPage;
