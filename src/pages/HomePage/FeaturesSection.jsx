import React from 'react';
import { Typography, Box, Grid, Container } from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import ScrollToNextIcon from './ScrollToNextIcon';

function FeaturesSection({ refFnc }) {
  const features = [
    {
      title: 'Seamless Communication',
      description:
        'Connect effortlessly with sellers and buyers in real-time. Our platform ensures you never miss a beat in your sneaker needs. Say goodbye to endless email threads, Instagram DMs and missed opportunities!',
      icon: (
        <ConnectWithoutContactIcon style={{ fontSize: 48, color: 'clear' }} />
      ),
    },
    {
      title: 'Business Analytics',
      description:
        'Get ahead of the game with in-depth business analytics. Monitor your performance, track trends, and make data-driven decisions to boost your sneaker game.',
      icon: <AnalyticsIcon style={{ fontSize: 48, color: 'clear' }} />,
    },
    {
      title: 'Brand Building and Trust',
      description:
      'Establish your brand and gain trust within the sneaker community. Build a reputation that sets you apart as a trusted seller or buyer.',
      icon: <VolunteerActivismIcon style={{ fontSize: 48, color: 'clear' }} />,
    },
    {
      title: 'Detailed Intake Form',
      description:
        'Revamp your sneaker restoration process with our comprehensive intake form. Document every aspect of your beloved kicks, from wear and tear to your restoration goals, ensuring a personalized and meticulous restoration journey.',
      icon: <ReceiptLongIcon style={{ fontSize: 48, color: 'clear' }} />,
    },
  ];

  const FeatureBox = ({ icon, header, subHeading }) => {
    return (
      <Box
        display="flex"
        flexDirection="column"
        textAlign="left"
        sx={{ paddingBottom: 3 }}
      >
        <Box
          sx={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            bgcolor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            background: 'gold'
          }}
        >
          {icon}
        </Box>
        <Typography variant="h2" paddingBottom={2} fontWeight="bold">
          {header}
        </Typography>
        <Typography variant="h4">{subHeading}</Typography>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        height: '100%',
        color: 'white',
      }}
    >
      <Typography
        fontWeight="bold"
        gutterBottom
        sx={{
          fontSize: { xs: '3rem', sm: '5.2rem' },
          lineHeight: 1.4,
        }}
      >
        Features
      </Typography>
      <Box sx={{ textAlign: 'left', paddingX: '20px' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {features.map((feature) => {
            return (
              <Grid item xs={12} md={6}>
                <FeatureBox
                  icon={feature.icon}
                  header={feature.title}
                  subHeading={feature.description}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>
      <Box>
        <ScrollToNextIcon scrollToNext={refFnc} />
      </Box>
    </Box>
  );
}

export default FeaturesSection;
