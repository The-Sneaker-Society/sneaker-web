import { Box, Typography } from "@mui/material";
import GroupCreationForm from "./GroupCreationForm";
import GroupDisplay from "./GroupDisplay";
import { useSneakerMember } from "../../context/MemberContext";

const GroupsPage = () => {
  const { member, loading } = useSneakerMember();

  return (
    <Box
      sx={{
        px: { xs: 2, md: 4 },
        py: 4,
        bgcolor: "#000",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h3"
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
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1.2fr 1fr" },
          gap: 4,
          alignItems: "flex-start",
          maxWidth: 1400,
          mx: "auto",
        }}
      >
        <GroupCreationForm />

        <GroupDisplay currentUserId={member?.id} currentUserLoading={loading} />
      </Box>
    </Box>
  );
};

export default GroupsPage;
