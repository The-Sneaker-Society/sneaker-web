import { useClerk, useUser } from "@clerk/clerk-react";
import { Box, Typography } from "@mui/material";
import StyledButton from "../HomePage/StyledButton";
import GetStartedModal from "../../components/GetStartedModal";
import ContractsDataTable from "../../components/ContractsDataTable";

import { useState } from "react";

const UserDashboard = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Welcome and Blurb */}
      <Box sx={{ width: '100%'}}>
        <Typography variant="h1" sx={{ fontWeight: 'bold', color: 'white', fontSize: 40, pt: 4 }}>
          Welcome {user?.firstName || 'User'}
        </Typography>
      </Box>

      {/* Split Widgets */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, height: '100%' }}>
        {/* Top Widget */}
        <Box
          sx={{
            flex: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            border: '2px solid white',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.05)',
            boxShadow: 2,
            cursor: 'pointer',
          }}
          onClick={handleOpen}
        >
          <Typography variant="h2" sx={{ color: 'white', fontWeight: 'bold', fontSize: 64 }}>
            +
          </Typography>
        </Box>
        </Box>

        {/* Bottom Widget */}
        <Box
          sx={{
            flex: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              border: '1px dashed #ccc',
              borderRadius: 2,
              background: 'rgba(255,255,255,0.02)',
              p: 2,
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <ContractsDataTable />
          </Box>
        </Box>
      </Box>
      {/* Modal for getting started */}
      <GetStartedModal open={open} onClose={handleClose} />
    </Box>
  );
};

export default UserDashboard;
