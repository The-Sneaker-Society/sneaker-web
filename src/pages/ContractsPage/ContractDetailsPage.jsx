import React from "react";
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    useMediaQuery,
    useTheme,
    Grid2
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_CONTRACT_BY_ID } from "../../context/graphql/getContractDetails";
import StyledButton from "../../pages/HomePage/StyledButton";

export const ContractDetailsPage = () => {
    const { id } = useParams();
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Fetch contract data using GraphQL
    const { loading, error, data } = useQuery(GET_CONTRACT_BY_ID, {
        variables: { id },
        fetchPolicy: "cache-and-network"
    });

    const contract = data?.contractById;

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

    // Function to handle message button click
    const handleMessageClick = () => {
        // Navigate to the chat with this client
        navigate(`/member/chat/${id}`);
    };

    // Function to handle support button click
    const handleSupportClick = () => {
        // Open mailto link
        window.location.href = "mailto:support@thesneakersociety.com";
    };

    // Renders the status badge with appropriate color
    const renderStatusBadge = (status) => {
        let backgroundColor = "";
        switch (status) {
            case "IN_PROGRESS":
                backgroundColor = "#D4AC0D"; // Golden yellow
                break;
            case "PENDING":
                backgroundColor = "#2ECC71"; // Green
                break;
            case "COMPLETED":
                backgroundColor = "#3498DB"; // Blue
                break;
            case "NOT_STARTED":
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
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" }}>
                <CircularProgress color="primary" />
            </Box>
        );
    }

    // Show error state
    if (error) {
        return (
            <Box sx={{ p: 3, color: "white", height: "100%", width: "100%" }}>
                <Typography variant="h6" color="error">
                    Error loading contract details: {error.message}
                </Typography>
            </Box>
        );
    }

    // If no contract data is available
    if (!contract) {
        return (
            <Box sx={{ p: 3, color: "white", height: "100%", width: "100%" }}>
                <Typography variant="h6">
                    No contract details found for ID: {id}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: isMobile ? 2 : 4, color: "white", height: "100%", width: "100%" }}>
            <Box
                sx={{
                    border: "2px solid white",
                    borderRadius: "12px",
                    p: isMobile ? 3 : 4,
                    position: "relative" // Added for absolute positioning of the action buttons
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
                        {`${contract.client?.firstName || ""} ${contract.client?.lastName || ""}`}
                    </Typography>
                    {renderStatusBadge(contract.status)}
                </Box>

                {/* Price Section */}
                {contract.proposedPrice !== null && (
                    <Box sx={{ mb: isMobile ? 4 : 6 }}>
                        <Typography variant="h5" sx={{ mb: 2, fontSize: isMobile ? "1.5rem" : "1.75rem", fontWeight: "normal" }}>
                            Proposed Price
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: "normal", fontSize: isMobile ? "1.75rem" : "2rem" }}>
                            ${parseFloat(contract.proposedPrice).toFixed(2)}
                        </Typography>
                    </Box>
                )}

                {/* Address and Shipping Section */}
                <Grid2 container spacing={isMobile ? 4 : 6} sx={{ mb: isMobile ? 4 : 6 }}>
                    <Grid2 xs={12} md={6}>
                        <Typography variant="h5" sx={{ mb: 2, fontSize: isMobile ? "1.5rem" : "1.75rem", fontWeight: "normal" }}>
                            Client
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: "1.1rem", mb: 1 }}>
                            Name: {`${contract.client?.firstName || ""} ${contract.client?.lastName || ""}`}
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                            Email: {contract.client?.email || "N/A"}
                        </Typography>
                    </Grid2>

                    <Grid2 xs={12} md={6}>
                        <Typography variant="h5" sx={{ mb: 2, fontSize: isMobile ? "1.5rem" : "1.75rem", fontWeight: "normal" }}>
                            Shipping
                        </Typography>
                        {contract.trackingNumber ? (
                            <>
                                <Typography variant="body1" sx={{ fontSize: "1.1rem", mb: 1 }}>
                                    Tracking: {contract.trackingNumber.trackingNumber}
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                                    Carrier: {contract.trackingNumber.carrier || contract.shippingCarrier}
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
                    </Grid2>
                </Grid2>

                {/* Sneaker Details Section */}
                <Box sx={{ mb: isMobile ? 4 : 6 }}>
                    <Typography variant="h5" sx={{ mb: isMobile ? 2 : 3, fontSize: isMobile ? "1.5rem" : "1.75rem", fontWeight: "normal" }}>
                        Details
                    </Typography>
                    <Grid2 container spacing={2}>
                        <Grid2 xs={12} sm={6}>
                            <Box sx={{ display: "flex", mb: 2 }}>
                                <Typography variant="body1" sx={{ fontWeight: "bold", mr: 1, fontSize: "1.1rem" }}>
                                    Brand:
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                                    {contract.shoeDetails?.brand || "N/A"}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", mb: 2 }}>
                                <Typography variant="body1" sx={{ fontWeight: "bold", mr: 1, fontSize: "1.1rem" }}>
                                    Model:
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                                    {contract.shoeDetails?.model || "N/A"}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", mb: 2 }}>
                                <Typography variant="body1" sx={{ fontWeight: "bold", mr: 1, fontSize: "1.1rem" }}>
                                    Color:
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                                    {contract.shoeDetails?.color || "N/A"}
                                </Typography>
                            </Box>
                        </Grid2>
                        <Grid2 xs={12} sm={6}>
                            <Box sx={{ display: "flex", mb: 2 }}>
                                <Typography variant="body1" sx={{ fontWeight: "bold", mr: 1, fontSize: "1.1rem" }}>
                                    Size:
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                                    {contract.shoeDetails?.size || "N/A"}
                                </Typography>
                            </Box>
                        </Grid2>
                    </Grid2>
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
                        {contract.repairDetails?.clientNotes || "No client notes provided"}
                    </Typography>
                </Box>

                {/* Member Notes Section */}
                <Box sx={{ mb: isMobile ? 8 : 10 }}>
                    <Typography variant="h5" sx={{ mb: 2, fontSize: isMobile ? "1.5rem" : "1.75rem", fontWeight: "normal" }}>
                        Member Notes
                    </Typography>
                    {contract.repairDetails?.memberNotes ? (
                        <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                            {contract.repairDetails.memberNotes}
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

                {/* Action Buttons - Message and Support */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: isMobile ? 16 : 24,
                        right: isMobile ? 16 : 24,
                        display: "flex",
                        gap: 2,
                        flexDirection: isMobile ? "column" : "row"
                    }}
                >
                    <StyledButton onClick={handleMessageClick}>
                        Message
                    </StyledButton>
                    <StyledButton onClick={handleSupportClick}>
                        Support
                    </StyledButton>
                </Box>
            </Box>
        </Box>
    );
};

export default ContractDetailsPage; 