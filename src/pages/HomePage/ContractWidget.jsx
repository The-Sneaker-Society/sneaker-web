import React, { useState } from 'react';
import { Box, Checkbox, Chip, Grid, Typography, Container, IconButton, useMediaQuery, useTheme } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function ContractWidget() {
    const [contracts, setContracts] = useState([
        { id: 1, client: 'Richard Cochechagua', status: 'In Progress', date: '01/24/2023' },
        { id: 2, client: 'Gerardo Delao', status: 'Done', date: '01/04/2023' },
        { id: 3, client: 'Kyle Desmond', status: 'Complete', date: '02/24/2023' },
        { id: 4, client: 'Alanis Yates', status: 'Not Started', date: '08/19/2023' },
        { id: 5, client: 'Alanis Yates', status: 'Not Started', date: '08/19/2023' },
        { id: 6, client: 'Kyle Desmond', status: 'Complete', date: '02/24/2023' },
    ]);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const getStatusChipProps = (status) => {
        switch (status) {
            case 'In Progress':
                return { color: 'warning' };
            case 'Done':
                return { color: 'success' };
            case 'Not Started':
                return { style: { backgroundColor: 'red', color: 'black' } }; // Adjusted for better visibility
            case 'Complete':
                return { color: 'info' };
            default:
                return { color: 'default' };
        }
    };

    return (
        <Container maxWidth="md" sx={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            height: isSmallScreen ? 'auto' : '100vh',
            padding: isSmallScreen ? 1 : 3,
        }}>
            <Box sx={{
                width: '100%', p: 2, borderRadius: 2, boxShadow: 3, overflowX: 'auto',
                border: 2, borderColor: 'white',
            }}>
                <Typography variant="h6" gutterBottom component="div" sx={{
                    mb: 2,
                    fontSize: isSmallScreen ? 'body1.fontSize' : 'h6.fontSize',
                }}>
                    Projects (6 total)
                </Typography>
                <Grid container alignItems="center" sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    pb: 2,
                    '&:last-child': {
                        borderBottom: 0,
                    },
                }}>
                    <Grid item xs={3}>
                        <Typography variant="subtitle1" component="div" sx={{
                            display: 'flex', alignItems: 'center',
                            fontSize: isSmallScreen ? 'body2.fontSize' : 'subtitle1.fontSize',
                        }}>
                            <Checkbox disabled sx={{ padding: 0, marginRight: '8px' }} />
                            Client
                        </Typography>
                    </Grid>
                    <Grid item xs={3}><Typography variant="subtitle1" sx={{ fontSize: isSmallScreen ? 'body2.fontSize' : 'subtitle1.fontSize', }}>Status</Typography></Grid>
                    <Grid item xs={3}><Typography variant="subtitle1" sx={{ fontSize: isSmallScreen ? 'body2.fontSize' : 'subtitle1.fontSize', }}>Date</Typography></Grid>
                    {!isSmallScreen && <Grid item xs={3} />} {/* This ensures the MoreHorizIcon column is only rendered on larger screens */}
                </Grid>
                {contracts.map((contract) => (
                    <Grid container alignItems="center" key={contract.id} sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        pb: 2,
                        '&:last-child': {
                            borderBottom: 0,
                        },
                    }}>
                        <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Checkbox sx={{ padding: 0, marginRight: '8px' }} />
                            <Typography variant="body2" noWrap>{contract.client}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Chip
                                label={contract.status}
                                {...getStatusChipProps(contract.status)}
                                sx={{
                                    borderRadius: 1,
                                    width: 'fit-content',
                                    px: '10px',
                                    py: '4px',
                                }}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant="body2" noWrap>{contract.date}</Typography>
                        </Grid>
                        {!isSmallScreen && (
                            <Grid item xs={3}>
                                <IconButton size="small"><MoreHorizIcon /></IconButton>
                            </Grid>
                        )}
                    </Grid>
                ))}
            </Box>
        </Container>
    );
}

export default ContractWidget;
