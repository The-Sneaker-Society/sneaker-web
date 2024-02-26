import React, { useState, useContext } from 'react';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { tokens } from '../theme/theme';
import { mockTransactions } from '../data/mockData';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import EmailIcon from '@mui/icons-material/Email';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import PaidIcon from '@mui/icons-material/Paid';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import Header from '../components/Header';
import StatBox from '../components/StatBox';
import NewSidebar from './NewSideBar';
import { AuthContext } from '../context/authContext';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const { currentUser } = useContext(AuthContext);
  const user = currentUser();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };


  return (
    <Box m="20px">
      {/* Header */}
      {(!isSmallScreen || !sidebarOpen) && <Header toggleSidebar={toggleSidebar} />}
      <NewSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* The rest of the Dashboard content */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to the Sneaker Society" />
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.grey[900]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="12,361"
            subtitle="Messages"
            progress="0.75"
            increase="+14%"
            icon={
              <EmailIcon
                sx={{
                  color: colors.yellowAccent[500],
                  light: colors.grey[100],
                  fontSize: '26px',
                }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 3"
          backgroundColor={colors.grey[900]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="431,225"
            subtitle="Services Completed"
            progress="0.50"
            increase="+21%"
            icon={
              <PointOfSaleIcon
                sx={{
                  color: colors.yellowAccent[500],
                  light: colors.grey[100],
                  fontSize: '26px',
                }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.grey[900]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="32,441"
            subtitle="Total Sales"
            progress="0.30"
            increase="+5%"
            icon={
              <PaidIcon
                sx={{
                  color: colors.yellowAccent[500],
                  light: colors.grey[100],
                  fontSize: '26px',
                }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.grey[900]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            fontColor={colors.grey[100]}
            title="34"
            subtitle="Inquiries"
            progress="0.80"
            increase="+43%"
            icon={
              <PsychologyAltIcon
                sx={{
                  color: colors.yellowAccent[500],
                  light: colors.grey[100],
                  fontSize: '26px',
                }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.grey[900]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Revenue Generated
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.grey[100]}
              >
                $59,342.32
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: '26px', color: colors.grey[100] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            {/* <LineChart isDashboard={true} /> */}
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 4"
          backgroundColor={colors.primary[900]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.grey[100]}`}
            colors={colors.primary[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>
          {mockTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.service}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`9px solid ${colors.grey[900]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.grey[100]}
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.service}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.customer}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{transaction.date}</Box>
              <Box
                backgroundColor={colors.grey[900]}
                p="5px 10px"
                borderRadius="4px"
              >
                {transaction.cost}
              </Box>
            </Box>
          ))}
        </Box>

        {/* ROW 3 */}
        {/* <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.grey[900]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Campaign
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <Typography
              variant="h5"
              color={colors.grey[100]}
              sx={{ mt: "15px" }}
            >
              $48,352 revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.grey[900]}
          display="flex"
          justifyContent="center"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Unfinished Jobs
          </Typography>

          {
            <Box height="100px" mt="30px">
              {
                <AssignmentLateIcon
                  sx={{ light: colors.grey[100], fontSize: "26px" }}
                />
              }
            </Box>
          }
        </Box> */}
      </Box>
    </Box>
  );
};

export default Dashboard;

