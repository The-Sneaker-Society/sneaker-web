import React, { useState } from 'react';
import { Box, Checkbox, Chip, Grid, Typography, Container, IconButton, Button, useMediaQuery, useTheme, Pagination } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function ContractWidget() {
    const [contracts, setContracts] = useState([
        { id: 1, client: 'Richard Cochechagua', status: 'In Progress', date: '01/24/2023', selected: false },
        { id: 2, client: 'Gerardo Delao', status: 'Done', date: '01/04/2023', selected: false },
        { id: 3, client: 'Kyle Desmond', status: 'Complete', date: '02/24/2023', selected: false },
        { id: 4, client: 'Alanis Yates', status: 'Not Started', date: '08/19/2023', selected: false },
        { id: 5, client: 'Alanis Yates', status: 'Not Started', date: '08/19/2023', selected: false },
        { id: 6, client: 'Kyle Desmond', status: 'Complete', date: '02/24/2023', selected: false },
        { id: 7, client: 'New Client', status: 'In Review', date: '03/01/2023', selected: false }, // Added 7th contract for pagination example
    ]);
    const [selectAll, setSelectAll] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const contractsPerPage = 6;

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const getStatusChipProps = (status) => {
        switch (status) {
            case 'In Progress':
                return { color: 'warning' };
            case 'Done':
                return { color: 'success' };
            case 'Not Started':
                return { style: { backgroundColor: 'red', color: 'white' } }; // Adjusted for better visibility
            case 'Complete':
                return { color: 'info' };
            default:
                return { color: 'default' };
        }
    };

    const handleSelectAll = (event) => {
        const newContracts = contracts.map(contract => ({ ...contract, selected: event.target.checked }));
        setContracts(newContracts);
        setSelectAll(event.target.checked);
    };

    const handleSelectSingle = (id) => {
        const newContracts = contracts.map(contract =>
            contract.id === id ? { ...contract, selected: !contract.selected } : contract
        );
        setContracts(newContracts);

        // Check if all contracts are now selected, to update the selectAll state
        setSelectAll(newContracts.every(contract => contract.selected));
    };

    const indexOfLastContract = currentPage * contractsPerPage;
    const indexOfFirstContract = indexOfLastContract - contractsPerPage;
    const currentContracts = contracts.slice(indexOfFirstContract, indexOfLastContract);

    const totalPages = Math.ceil(contracts.length / contractsPerPage);

    const handlePaginationChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <Container maxWidth="md" sx={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            height: isSmallScreen ? 'auto' : '100vh',
            padding: isSmallScreen ? 1 : 3,
            overflowY: isSmallScreen ? 'scroll' : 'hidden',
            minHeight: '500px', // Example fixed minimum height, adjust based on your content
        }}>
            <Box sx={{
                width: '100%', p: 2, borderRadius: 2, boxShadow: 3, overflowX: 'auto',
                border: 2, borderColor: 'white',
            }}>
                <Typography variant="h6" gutterBottom component="div" sx={{
                    mb: 2,
                    fontSize: isSmallScreen ? 'body1.fontSize' : 'h6.fontSize',
                }}>
                    Contracts (7 total)
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
                            <Checkbox
                                checked={selectAll}
                                onChange={handleSelectAll}
                                sx={{ padding: 0, marginRight: '8px' }}
                            />
                            Client
                        </Typography>
                    </Grid>
                    <Grid item xs={3}><Typography variant="subtitle1">Status</Typography></Grid>
                    <Grid item xs={3}><Typography variant="subtitle1">Date</Typography></Grid>
                    {!isSmallScreen && <Grid item xs={3} />}
                </Grid>
                {currentContracts.map((contract) => (
                    <Grid container alignItems="center" key={contract.id} sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        pb: 2,
                        '&:last-child': {
                            borderBottom: 0,
                        },
                    }}>
                        <Grid item xs={isSmallScreen ? 4 : 3} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Checkbox
                                checked={contract.selected}
                                onChange={() => handleSelectSingle(contract.id)}
                                sx={{ padding: 0, marginRight: '8px' }}
                            />
                            <Typography variant="body2" noWrap>{contract.client}</Typography>
                        </Grid>
                        <Grid item xs={isSmallScreen ? 4 : 3} sx={{marginTop: '10px'}}>
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
                        <Grid item xs={isSmallScreen ? 4 : 3}>
                            <Typography variant="body2" noWrap>{contract.date}</Typography>
                        </Grid>
                        {!isSmallScreen && (
                            <Grid item xs={3}>
                                <IconButton size="small"><MoreHorizIcon /></IconButton>
                            </Grid>
                        )}
                    </Grid>
                ))}
                {/* Pagination Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePaginationChange}
                        color="primary"
                        variant="outlined"
                        shape="rounded"
                        sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
                    />
                </Box>
            </Box>
        </Container>
    );
}

export default ContractWidget;
