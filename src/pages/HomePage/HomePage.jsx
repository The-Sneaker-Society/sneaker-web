import React, { useState, useRef } from 'react';
import { Box, Stack, Typography, Divider, useMediaQuery } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import { TypeAnimation } from 'react-type-animation';
import StyledButton from './StackedButton';
import FeaturesSection from './FeaturesSection';
import ScrollToNextIcon from './ScrollToNextIcon';
import PricingCard from './PricingCard';
import PricingTable from './PricingTable';
import ContactSection from './ContactSection';

function HomePage() {
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const featuresSectionRef = useRef(null); // Create a ref for the FeaturesSection
  const pricingSectionRef = useRef(null);
  const contactSectionRef = useRef(null);

  const scrollToRef = (ref) => {
    window.scrollTo({
      top: ref.current.offsetTop - (isSmallScreen ? 120 : 100),
      behavior: 'smooth',
    });
  };

  return (
    <Box>
      <Header
        pricingRef={() => scrollToRef(pricingSectionRef)}
        featureRef={() => scrollToRef(featuresSectionRef)}
        contactRef={() => scrollToRef(contactSectionRef)}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            flexDirection: 'column',
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: '700',
              fontSize: { lg: '96px', md: '4rem', sm: '3rem', xs: '3rem' },
              marginTop: { xs: '20px', md: '0' },
              marginBottom: '32px',
              wordWrap: 'break-word',
              lineHeight: { xs: 1.2, sm: 1.3 },
            }}
          >
            <Box sx={{ height: '100px' }}>
              <TypeAnimation
                sequence={[
                  'Elevate your Collection',
                  1000,
                  'Streamline your Process',
                  1000,
                  'Build your Brand',
                  1000,
                ]}
                speed={50}
                wrapper="div"
                repeat={Infinity}
              />
            </Box>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: '400',
              fontSize: { xs: '16px', md: '1.25rem' },
              maxWidth: '800px',
              marginBottom: '48px',
            }}
          >
            Your all-in-one solution: Where restoration experts elevate their
            brand while customers easily find top-tier restoration services.
          </Typography>

          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={2}
          >
            <StyledButton>Buisness</StyledButton>
            <StyledButton>Customer</StyledButton>
          </Stack>

          <ScrollToNextIcon
            scrollToNext={() => scrollToRef(featuresSectionRef)}
          />
        </Box>

        <Box
          sx={{
            height: isSmallScreen ? '100%' : '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          ref={featuresSectionRef}
        >
          <FeaturesSection refFnc={() => scrollToRef(pricingSectionRef)} />
        </Box>
        <Box
          sx={{
            height: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <Box sx={{ width: '100%', height: '100%' }}>
            <Typography
              fontWeight="bold"
              gutterBottom
              ref={pricingSectionRef}
              sx={{
                fontSize: { xs: '3rem', sm: '5.2rem' },
                lineHeight: 1.4,
              }}
            >
              Pricing
            </Typography>

            <PricingTable
              features={[
                'Unlimited Intakes',
                'Direct Messaging',
                'Direct Stripe Payments',
                'Business Insights',
              ]}
            />
          </Box>
          <ScrollToNextIcon
            scrollToNext={() => scrollToRef(contactSectionRef)}
          />
        </Box>
        <Box
          sx={{
            height: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          ref={contactSectionRef}
        >
          <ContactSection />
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}

export default HomePage;
