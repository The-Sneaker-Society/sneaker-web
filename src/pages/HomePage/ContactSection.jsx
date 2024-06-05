import { Typography, Box, Link, IconButton, Grid } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import { FaInstagram } from 'react-icons/fa';
import Sneakers from '../../../assets/sneakers-header.png';

const ContactSection = () => {
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        px: 5,
        paddingBottom: '10%',
      }}
    >
      <Grid container spacing={8} alignItems="center" justifyContent="center">
        <Grid item xs={12} md={6}>
          <Typography
            fontWeight="bold"
            gutterBottom
            sx={{
              fontSize: { xs: '1.8rem', sm: '5.2rem' },
              lineHeight: 1.4,
            }}
          >
            Contact Us
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              textAlign: 'left',
              border: '1px solid white',
              padding: '8px',
              marginY: '28px',
            }}
          >
            <IconButton aria-label="email" sx={{ color: 'white' }}>
              <EmailIcon />
            </IconButton>
            <Typography
              variant="h3"
              sx={{
                lineHeight: 1.6,
                marginLeft: '0.5rem',
              }}
            >
              Email
              <br />
              <Link
                href="mailto:help@thesneakersociety.com"
                sx={{
                  color: 'white',
                  fontSize: { xs: '1.1rem' },
                }}
              >
                help@thesneakerssociety.com
              </Link>
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              textAlign: 'left',
              border: '1px solid white',
              padding: '8px',
              marginY: '8px',
            }}
          >
            <IconButton aria-label="instagram" sx={{ color: 'white' }}>
              <FaInstagram />
            </IconButton>
            <Typography
              variant="h3"
              sx={{
                lineHeight: 1.6,
                marginLeft: '0.5rem',
              }}
            >
              Instagram
              <br />
              <Link
                href="https://instagram.com/thesneakersociety1"
                sx={{
                  color: 'white',
                  fontSize: { xs: '1.1rem' },
                }}
              >
                @thesneakersociety1
              </Link>
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              width: '100%',
              overflow: 'hidden',
              borderRadius: '4px',
              textAlign: 'center',
            }}
          >
            <img
              src={Sneakers}
              alt="Sneaker Society Logo"
              style={{ width: '50%', marginTop: '20%', }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
export default ContactSection;
