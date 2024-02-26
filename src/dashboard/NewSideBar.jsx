import React from 'react';
import { Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Box, Divider, useMediaQuery, ListItemButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MessageIcon from '@mui/icons-material/Message';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import GroupsIcon from '@mui/icons-material/Groups';
import ExploreIcon from '@mui/icons-material/Explore';
import { TbShoe } from "react-icons/tb";
import { CiVault } from "react-icons/ci";
import { Link } from 'react-router-dom';
import { Badge } from '@mui/material';
import Logo from '../../assets/SNEAKER SOCIETY (Transparency).png';

const sections = [
    { title: 'My Society', path: '/my-society', Icon: TbShoe },
    { title: 'Discover', path: '/discover', Icon: ExploreIcon },
    { title: 'Groups', path: '/groups', Icon: GroupsIcon },
    { title: 'The Vault', path: '/vault', Icon: CiVault },
    { title: 'Messages', path: '/messages', Icon: MessageIcon, notificationCount: 5 },
];

const NewSidebar = ({ sidebarOpen, toggleSidebar }) => {
    const isMobile = useMediaQuery('(max-width:600px)');

    return (
        <>
            {isMobile && (
                <IconButton
                    onClick={toggleSidebar}
                    color="inherit"
                    sx={{
                        position: 'fixed',
                        top: 8,
                        right: 8,
                        zIndex: 1300,
                        display: 'block',
                        color: sidebarOpen ? 'black' : 'white',
                    }}
                >
                    <MenuIcon />
                </IconButton>
            )}
            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                anchor="left"
                open={sidebarOpen || !isMobile}
                onClose={toggleSidebar}
                PaperProps={{
                    sx: {
                        width: isMobile ? '100vw' : 240,
                        height: '100vh',
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'fixed',
                        zIndex: 1200,
                        backgroundColor: 'white',
                        color: 'black'
                    },
                }}
            >
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    p={2}
                    sx={{
                        background: 'black', // Adjust if you want the circle background to be different
                        borderRadius: '50%',
                        width: 200,
                        height: 200,
                        marginTop: '96px',
                        alignSelf: 'center',
                    }}
                >
                    <img
                        alt="Sneaker Society Logo"
                        src={Logo}
                        style={{ width: 200, height: 200 }}
                    />
                </Box>
                <Box
                    role="presentation"
                    onClick={toggleSidebar}
                    onKeyDown={toggleSidebar}
                    sx={{
                        flexGrow: 1,
                        paddingTop: 5,
                    }}
                >
                    <List>
                        {sections.map((section, index) => (
                            <ListItemButton
                                key={index}
                                component={Link}
                                to={section.path}
                                sx={{
                                    justifyContent: 'center',
                                    py: 1,
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 'auto', marginRight: '8px', color: 'black' }}>
                                    {section.notificationCount && section.notificationCount > 0 ? (
                                        <Badge badgeContent={section.notificationCount} color="error" sx={{ "& .MuiBadge-badge": { backgroundColor: '#ff0000' } }}>
                                            {React.createElement(section.Icon, { style: { color: 'black' } })}
                                        </Badge>
                                    ) : (
                                        React.createElement(section.Icon, { style: { color: 'black' } })
                                    )}
                                </ListItemIcon>
                                <ListItemText primary={section.title} sx={{ textAlign: 'center', flex: 'none', color: 'black' }} />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
                <Divider />
                <Box
                    sx={{
                        pb: 2,
                    }}
                >
                    <List>
                        <ListItemButton
                            component={Link}
                            to="/settings"
                            sx={{
                                justifyContent: 'center',
                                py: 1,
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 'auto', marginRight: '8px', color: 'black' }}>
                                <SettingsOutlinedIcon />
                            </ListItemIcon>
                            <ListItemText primary="Settings" sx={{ textAlign: 'center', flex: 'none', color: 'black' }} />
                        </ListItemButton>
                    </List>
                </Box>
            </Drawer>
        </>
    );
};

export default NewSidebar;
