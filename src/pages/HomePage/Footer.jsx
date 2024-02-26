import React from 'react';
import { Typography, Box, Grid, Link, IconButton, useTheme } from '@mui/material';
import { Facebook, Instagram } from '@mui/icons-material';

function Footer() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: '#333',
        color: 'white',
        py: 2,
        px: 2,
        [theme.breakpoints.down('xs')]: {
          py: 3,
          px: 3,
        }
      }}
    >
      <Grid container justifyContent="space-between" alignItems="center" spacing={3}>
        <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'center', sm: 'left' }, mt: { xs: 1, sm: 0 } }}>
          <Typography variant="h6">Contact</Typography>
          <Typography sx={{ display: 'block', mt: 1 }}>Phone: (123) 456-7890</Typography>
          <Typography sx={{ display: 'block', mt: 1 }}>Email: info@shoecompany.com</Typography>
        </Grid>
        <Grid item xs={12} sm={4} sx={{ textAlign: 'center', mt: { xs: 2, sm: 0 } }}>
          <Typography variant="body2">
            Copyright © 2023 Shoe Company
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'center', sm: 'right' }, mt: { xs: 2, sm: 0 } }}>
          <Box display="flex" justifyContent="center" sm={{ justifyContent: 'flex-end' }}>
            <IconButton color="inherit">
              <Link href="https://www.facebook.com/TheSneakerSociety1" target="_blank" rel="noopener noreferrer" sx={{ color: 'white', fontSize: { xs: '1.5rem', sm: 'inherit' } }}>
                <Facebook />
              </Link>
            </IconButton>
            <IconButton color="inherit" sx={{ ml: 1 }}>
              <Link href="https://www.instagram.com/thesneakersociety1/" target="_blank" rel="noopener noreferrer" sx={{ color: 'white', fontSize: { xs: '1.5rem', sm: 'inherit' } }}>
                <Instagram />
              </Link>
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Footer;
