import React from "react";
import { Box, Typography, Button, Grid, CircularProgress, useMediaQuery, useTheme } from "@mui/material";
import { useParams } from "react-router-dom";
// Import the GraphQL query (commented out for now, will be used in the future)
// import { GET_CONTRACT_DETAILS } from "../../context/graphql/getContractDetails";
// import { useQuery } from "@apollo/client";

// Hardcoded contract data for initial development
const CONTRACT_DATA = {
    id: "1",
    client: {
        firstName: "John",
        lastName: "Doe",
        address: {
            street: "123 N Main Street",
            city: "Jacksonville",
            state: "FL",
            zipCode: "32246"
        }
    },
    status: "In Progress",
    proposedPrice: 45.56,
    shipping: {
        trackingNumber: null,
        carrier: null
    },
    sneakerDetails: {
        brand: "Nike",
        model: "Air Max 90",
        color: "White/Blue",
        size: "US 11.4",
        material: "Suede",
        soleCondition: "Worn"
    },
    repairDetails: {
        clientNotes: "Sole separation on left shoe. Would like to have it cleaned and possibly a color change if you can do tha let me know!"
    },
    memberNotes: null
};

export const ContractDetailsPage = () => {
    const { id } = useParams();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // For now, use hardcoded data. In the future, we'll use GraphQL to fetch data
    // const { loading, error, data } = useQuery(GET_CONTRACT_DETAILS, {
    //   variables: { contractId: id },
    // });

    // Simulate loading for now
    const loading = false;
    const error = null;

    // Use hardcoded data for now
    const contract = CONTRACT_DATA;

    // In the future, we'll use the data from the GraphQL query
    // const contract = data?.contractDetails;

    // Function to handle adding tracking information
    const handleAddTracking = () => {
        console.log("Add tracking clicked");
        // Future implementation will open a modal or form to add tracking info
    };

    // Function to handle adding member notes
    const handleAddMemberNotes = () => {
        console.log("Add member note");
        // Future implementation will open a modal or form to add member notes
    };

    // Renders the status badge with appropriate color
    const renderStatusBadge = (status) => {
        let backgroundColor = "";
        switch (status) {
            case "In Progress":
                backgroundColor = "#D4AC0D"; // Golden yellow
                break;
            case "Pending":
                backgroundColor = "#2ECC71"; // Green
                break;
            case "Completed":
                backgroundColor = "#3498DB"; // Blue
                break;
            case "Not Started":
                backgroundColor = "#E67E22"; // Orange
                break;
            default:
                backgroundColor = "#E0E0E0"; // Light gray for unknown statuses
        }

        return (
            <Box
                sx={{
                    backgroundColor,
                    borderRadius: 1,
                    px: 2,
                    py: 0.5,
                    display: "inline-block",
                    color: "black",
                    fontWeight: "bold"
                }}
            >
                {status}
            </Box>
        );
    };

    // Show loading state
    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: "black" }}>
                <CircularProgress color="primary" />
            </Box>
        );
    }

    // Show error state
    if (error) {
        return (
            <Box sx={{ p: 3, backgroundColor: "black", color: "white", minHeight: "100vh" }}>
                <Typography variant="h6" color="error">
                    Error loading contract details: {error.message}
                </Typography>
            </Box>
        );
    }

    // If no contract data is available
    if (!contract) {
        return (
            <Box sx={{ p: 3, backgroundColor: "black", color: "white", minHeight: "100vh" }}>
                <Typography variant="h6">
                    No contract details found for ID: {id}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: isMobile ? 2 : 4, backgroundColor: "black", color: "white", minHeight: "100vh" }}>
            <Box
                sx={{
                    border: "2px solid white",
                    borderRadius: "12px",
                    p: isMobile ? 3 : 4,
                    backgroundColor: "black",
                    maxWidth: "900px",
                    mx: "auto"
                }}
            >
                {/* Header Section */}
                <Box sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "space-between",
                    alignItems: isMobile ? "flex-start" : "center",
                    mb: isMobile ? 4 : 6,
                    gap: isMobile ? 2 : 0
                }}>
                    <Typography variant="h4" sx={{ fontWeight: "normal", fontSize: isMobile ? "2rem" : "2.5rem" }}>
                        {`${contract.client.firstName} ${contract.client.lastName}`}
                    </Typography>
                    {renderStatusBadge(contract.status)}
                </Box>

                {/* Price Section */}
                <Box sx={{ mb: isMobile ? 4 : 6 }}>
                    <Typography variant="h5" sx={{ mb: 2, fontSize: isMobile ? "1.5rem" : "1.75rem", fontWeight: "normal" }}>
                        Proposed Price
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: "normal", fontSize: isMobile ? "1.75rem" : "2rem" }}>
                        ${contract.proposedPrice.toFixed(2)}
                    </Typography>
                </Box>

                {/* Address and Shipping Section */}
                <Grid container spacing={isMobile ? 4 : 6} sx={{ mb: isMobile ? 4 : 6 }}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" sx={{ mb: 2, fontSize: isMobile ? "1.5rem" : "1.75rem", fontWeight: "normal" }}>
                            Address
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: "1.1rem", mb: 1 }}>
                            {contract.client.address.street}
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                            {`${contract.client.address.city}, ${contract.client.address.state}, ${contract.client.address.zipCode}`}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" sx={{ mb: 2, fontSize: isMobile ? "1.5rem" : "1.75rem", fontWeight: "normal" }}>
                            Shipping
                        </Typography>
                        {contract.shipping.trackingNumber ? (
                            <>
                                <Typography variant="body1" sx={{ fontSize: "1.1rem", mb: 1 }}>
                                    Tracking: {contract.shipping.trackingNumber}
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                                    Carrier: {contract.shipping.carrier}
                                </Typography>
                            </>
                        ) : (
                            <Button
                                variant="outlined"
                                onClick={handleAddTracking}
                                sx={{
                                    color: "white",
                                    borderColor: "white",
                                    borderRadius: "4px",
                                    textTransform: "none",
                                    fontSize: "1rem",
                                    px: 3,
                                    py: 1,
                                    "&:hover": {
                                        borderColor: "grey.400",
                                    }
                                }}
                            >
                                Add Tracking
                            </Button>
                        )}
                    </Grid>
                </Grid>

                {/* Sneaker Details Section */}
                <Box sx={{ mb: isMobile ? 4 : 6 }}>
                    <Typography variant="h5" sx={{ mb: isMobile ? 2 : 3, fontSize: isMobile ? "1.5rem" : "1.75rem", fontWeight: "normal" }}>
                        Details
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ display: "flex", mb: 2 }}>
                                <Typography variant="body1" sx={{ fontWeight: "bold", mr: 1, fontSize: "1.1rem" }}>
                                    Brand:
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                                    {contract.sneakerDetails.brand}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", mb: 2 }}>
                                <Typography variant="body1" sx={{ fontWeight: "bold", mr: 1, fontSize: "1.1rem" }}>
                                    Model:
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                                    {contract.sneakerDetails.model}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", mb: 2 }}>
                                <Typography variant="body1" sx={{ fontWeight: "bold", mr: 1, fontSize: "1.1rem" }}>
                                    Color:
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                                    {contract.sneakerDetails.color}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ display: "flex", mb: 2 }}>
                                <Typography variant="body1" sx={{ fontWeight: "bold", mr: 1, fontSize: "1.1rem" }}>
                                    Size:
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                                    {contract.sneakerDetails.size}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", mb: 2 }}>
                                <Typography variant="body1" sx={{ fontWeight: "bold", mr: 1, fontSize: "1.1rem" }}>
                                    Material:
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                                    {contract.sneakerDetails.material}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", mb: 2 }}>
                                <Typography variant="body1" sx={{ fontWeight: "bold", mr: 1, fontSize: "1.1rem" }}>
                                    Sole Condition:
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                                    {contract.sneakerDetails.soleCondition}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                {/* Repair Details Section */}
                <Box sx={{ mb: isMobile ? 4 : 6 }}>
                    <Typography variant="h5" sx={{ mb: 2, fontSize: isMobile ? "1.5rem" : "1.75rem", fontWeight: "normal" }}>
                        Repair Details
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, fontSize: "1.2rem" }}>
                        Client Notes
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                        {contract.repairDetails.clientNotes}
                    </Typography>
                </Box>

                {/* Member Notes Section */}
                <Box>
                    <Typography variant="h5" sx={{ mb: 2, fontSize: isMobile ? "1.5rem" : "1.75rem", fontWeight: "normal" }}>
                        Member Notes
                    </Typography>
                    {contract.memberNotes ? (
                        <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                            {contract.memberNotes}
                        </Typography>
                    ) : (
                        <Button
                            variant="outlined"
                            onClick={handleAddMemberNotes}
                            sx={{
                                color: "white",
                                borderColor: "white",
                                borderRadius: "4px",
                                textTransform: "none",
                                fontSize: "1rem",
                                px: 3,
                                py: 1,
                                "&:hover": {
                                    borderColor: "grey.400",
                                }
                            }}
                        >
                            Add Notes
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default ContractDetailsPage; 