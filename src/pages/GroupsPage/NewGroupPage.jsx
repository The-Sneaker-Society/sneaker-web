import React from "react";
import { Box, Typography, Button, Avatar, Divider } from "@mui/material";

const NewGroupPage = ({ group }) => {
  return (
    <Box sx={{ bgcolor: "#e4e4e4", minHeight: "100vh", p: 3 }}>
      <Box
        sx={{
          bgcolor: "#000",
          color: "#fff",
          borderRadius: 2,
          p: 3,
          mb: 3,
        }}
      >
        <Typography variant="h3" fontWeight={600}>
          {group.name}
        </Typography>
        <Typography variant="h6" fontWeight={600} mt={1}>
          {group.members.length} members
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }} disabled>
          Joined
        </Button>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar sx={{ mr: 2 }} src={group.avatar} />
        <Typography variant="body1">{group.description}</Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />

      {/* Post input and post feed area */}
      <Box sx={{ bgcolor: "#fff", p: 2, borderRadius: 2 }}>
        <Typography variant="body1" color="textSecondary" align="center">
          No posts yet
        </Typography>
      </Box>
    </Box>
  );
};

export default GroupPage;
