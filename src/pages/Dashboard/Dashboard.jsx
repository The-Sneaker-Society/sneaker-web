import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Container, Grid, Box, Typography } from '@mui/material';
import ImageDownloadButton from './ImageDownloadButton';

// Define the query to get the current member's QR widget data
const GET_MEMBER_QR_WIDGET_DATA = gql`
  query GetMemberQrWidgetData {
    currentMember {
      qrWidgetData {
        image
        url
      }
    }
  }
`;

export const Dashboard = () => {
  const { loading, error, data } = useQuery(GET_MEMBER_QR_WIDGET_DATA);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Extract QR data from the response
  const { image, url } = data.currentMember.qrWidgetData;

  const WidgetPlaceholder = ({ color, height, children }) => (
    <div
      style={{
        backgroundColor: color,
        height: height,
        marginBottom: '8px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      {children}
    </div>
  );

  return (
    <Container maxWidth="lg" style={{ height: '100vh' }}>
      <Typography variant="h1" fontWeight="bold">
        Welcome Kyle
      </Typography>

      <Grid container spacing={2} style={{ height: '100%' }}>
        <Grid item xs={12} md={6}>
          <div style={{ backgroundColor: 'lightblue', height: '100%' }}>
            {/* Left Widget content could be placed here */}
          </div>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
            }}
          >
            <WidgetPlaceholder color="lightgreen" height="33%">
              {/* Widget 1 content */}
            </WidgetPlaceholder>
            <WidgetPlaceholder color="lightpink" height="33%">
              {/* Widget 2 content */}
            </WidgetPlaceholder>
            <WidgetPlaceholder color="lightyellow" height="34%">
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 2 }}>
                <img src={image} alt="QR Code" style={{ maxWidth: '50%' }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: 'red' }} />
                    <Typography component="a" href={url} target="_blank" rel="noopener noreferrer" sx={{ textDecoration: 'none', color: 'black', fontWeight: 'bold' }}>
                      Link
                    </Typography>
                  </Box>
                  <ImageDownloadButton imageSrc={image} />
                </Box>
              </Box>
            </WidgetPlaceholder>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};