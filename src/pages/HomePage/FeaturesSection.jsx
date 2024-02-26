import React, { useEffect, useRef, useState } from 'react';
import { Typography, Box, Grid, Container } from '@mui/material';

// Import the required icons
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import PaidIcon from '@mui/icons-material/Paid';
import HandymanIcon from '@mui/icons-material/Handyman';

function FeaturesSection() {
  const features = [
    {
      title: 'Seamless Communication',
      description: 'Connect effortlessly with sellers and buyers in real-time. Our platform ensures you never miss a beat in your sneaker needs. Say goodbye to endless email threads, Instagram DMs and missed opportunities!',
      icon: <ConnectWithoutContactIcon style={{ fontSize: 48, color: 'grey' }} />,
    },
    {
      title: 'Detailed Shoe Intake Form',
      description: 'Revamp your sneaker restoration process with our comprehensive intake form. Document every aspect of your beloved kicks, from wear and tear to your restoration goals, ensuring a personalized and meticulous restoration journey.',
      icon: <ReceiptLongIcon style={{ fontSize: 48, color: 'grey' }} />,
    },
    {
      title: 'Restoration Analytics Tailored to You',
      description: "Dive deep into your restoration projects with Sneaker Connect's member-centric analytics. Gain insights into your restoration journey, track your progress, and fine-tune your skills as a restoration artist. Your passion deserves precision!",
      icon: <HandymanIcon style={{ fontSize: 48, color: 'grey' }} />,
    },
    {
      title: 'Business Analytics',
      description: 'Get ahead of the game with in-depth business analytics. Monitor your performance, track trends, and make data-driven decisions to boost your sneaker game.',
      icon: <AnalyticsIcon style={{ fontSize: 48, color: 'grey' }} />,
    },
    {
      title: 'Direct Payments with Stripe',
      description: 'Secure and seamless transactions at your fingertips. Our integration with Stripe ensures that payments are quick, safe, and hassle-free. Buy and sell with confidence!',
      icon: <PaidIcon style={{ fontSize: 48, color: 'grey' }} />,
    },
    {
      title: 'Brand Building and Trust',
      description: 'Establish your brand and gain trust within the sneaker community. Build a reputation that sets you apart as a trusted seller or buyer.',
      icon: <VolunteerActivismIcon style={{ fontSize: 48, color: 'grey' }} />,
    }
  ];

  const [animationStarted, setAnimationStarted] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animationStarted) {
          setAnimationStarted(true);
        }
      },
      { threshold: 0.2 } // Adjust the threshold as needed
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [animationStarted]);

  return (
    <Box sx={{ backgroundColor: '#000', color: 'white', pt: 2, pb: 8 }} ref={sectionRef}>
      <Container>
        <Box my={8} sx={{ textAlign: 'center', paddingBottom: '2rem' }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            sx={{
              fontSize: { xs: '1.8rem', sm: '2.2rem' },
              lineHeight: 1.4
            }}
          >
            Our Features
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              fontSize: { xs: '1rem', sm: '1.2rem' },
              lineHeight: 1.6
            }}
          >
            Discover the amazing features we offer.
          </Typography>
          <Grid container justifyContent="space-evenly" spacing={3} mt={4}>
            {features.map((feature, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column', // Ensures the children of the box align in a column
                    alignItems: 'center',
                    justifyContent: 'space-between', // This will ensure equal spacing between items
                    height: '100%', // Takes full height
                    backgroundColor: 'grey',
                    borderRadius: '4px',
                    p: 2,
                    position: 'relative',
                    boxShadow: 1,
                    transform: animationStarted ? 'scale(1)' : 'scale(0)',
                    transition: 'transform 0.5s ease',
                    transitionDelay: `${index * 0.2}s`,
                  }}
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
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" mb={1}>
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      flex: 1, // Makes the description occupy the available space
                      display: { xs: 'none', sm: 'block' },
                      textAlign: 'center',
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default FeaturesSection;