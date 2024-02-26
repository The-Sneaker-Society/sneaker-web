import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import ConnectSection from './ConnectSection';
import AboutSection from './AboutSection';
import FeaturesSection from './FeaturesSection';
import PricingCard from './PricingCard';

function HeroSection() {
  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: '#000',
        color: 'white',
        flexGrow: 1,
        pt: { xs: '0px', sm: '0px' },
      }}
    >
      <Box mt={{ xs: 2, sm: 4 }}>
        <FeaturesSection />
      </Box>

      <Box mt={5} textAlign="center" fontWeight="bold">
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{
            fontSize: { xs: '1.8rem', sm: '2.2rem' },
            lineHeight: 1.4
          }}
        >
          Pricing Plans
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center" alignItems="center" sx={{ mt: 5, mb: 5, px: 2 }}>
        <Grid item xs={12} sm={4}>
          <PricingCard
            title="Basic Plan"
            price="price/mo"
            description="Great for individuals."
            benefits={[
              'Seamless Communication',
              'Detailed Intake Form',
              'Restoration Analytics',
              'Business Insights',
              'Direct Stripe Payments',
              'Brand Trust Building',
              'Direct connection with the dev team'
            ]}
            buttonText="Get Started"
          />
        </Grid>
      </Grid>

      <Box sx={{ bgcolor: 'black', pb: 1, mt: 20 }}>
        <AboutSection />
        <ConnectSection />
      </Box>
    </Box>
  );
}

export default HeroSection;