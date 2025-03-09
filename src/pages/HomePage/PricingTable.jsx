import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { Check } from '@mui/icons-material';
import StyledButton from './StyledButton';

const PricingTable = ({ features, onButtonClick }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '@media (max-width: 1024px)': {
          marginBottom: '40px', // Add space between sections for 1024px width
        },
      }}
    >
      <Box
        sx={{
          width: '20rem',
          p: 8,
          textAlign: 'center',
          borderRadius: '1.5rem',
          border: '1px solid white',
          color: 'white',
        }}
      >
        <Box
          sx={{
            pt: 2,
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h1">$</Typography>
          <Typography variant="h2" sx={{ fontSize: '3rem', fontWeight: '600' }}>
            7.99
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            / month
          </Typography>
        </Box>
        <hr sx={{ mt: 4, border: '5px solid' }} />
        <Box sx={{ pt: 4 }}>
          {features.map((feat, index) => (
            <Typography
              key={index}
              sx={{
                fontWeight: 'semibold',
                display: 'flex',
                alignItems: 'center',
                textLeft: 'left',
                pt: 5,
              }}
            >
              <Check sx={{ pr: 1 }} />
              {feat}
            </Typography>
          ))}

          <Box pt={4}>
            <StyledButton onClick={onButtonClick}>Choose Plan</StyledButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PricingTable;
