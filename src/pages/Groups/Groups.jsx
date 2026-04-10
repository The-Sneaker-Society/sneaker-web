import { Box, Typography } from "@mui/material";
import GroupCreationForm from "./GroupCreationForm";
import GroupDisplay from "./GroupDisplay";
import { useSneakerMember } from "../../context/MemberContext";

const GroupsPage = () => {
  const { member, loading } = useSneakerMember();

  return (
    <Box sx={{ pt: 4 }}>
      <Typography
        variant="h1"
        sx={{
          color: "#FFD100",
          fontWeight: "bold",
          mb: 4,
          textAlign: "center",
        }}
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

        <Box sx={{ maxWidth: 700, width: "100%" }}>
          <GroupDisplay
            currentUserId={member?.id}
            currentUserLoading={loading}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default GroupsPage;
