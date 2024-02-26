import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

const sections = [
  { id: 'HomePage', title: 'Home Page', path: '/HomePage' },
  { id: 'Contact', title: 'Contact', path: '/contact' },
];

function Header({ toggleSidebar }) {
  const isMobile = useMediaQuery('(max-width: 959px)');

  return (
    <AppBar position="sticky" color="primary" elevation={1} sx={{ zIndex: 2000 }}>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Shoe Company
        </Typography>

        {isMobile ? (
          <IconButton
            edge="end"
            color="inherit"
            aria-label="open sidebar"
            onClick={toggleSidebar}
            sx={{ marginLeft: 'auto' }}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <>
            <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
              {sections.map((section) => (
                <Button
                  key={section.id}
                  component={Link}
                  to={section.path}
                  sx={{ color: 'inherit', textDecoration: 'none', mx: 2 }}
                >
                  {section.title}
                </Button>
              ))}
            </Box>

            <Button variant="contained" color="secondary">
              Sign Up
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
