import { useClerk, useUser } from "@clerk/clerk-react";
import { Box, Typography } from "@mui/material";
import StyledButton from "../HomePage/StackedButton";

const UserDashboard = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleLogout = () => {
    signOut();
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Typography variant="h1" fontWeight="bold">
          Welcome to the User dashboard {user?.firstName || "User"}!
        </Typography>
        <StyledButton onClick={handleLogout} style={{ marginTop: "10px" }}>
          Log Out
        </StyledButton>
      </Box>
    </>
  );
};

export default UserDashboard;
