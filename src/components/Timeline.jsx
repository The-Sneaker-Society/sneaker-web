import React from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { tokens } from "../theme/theme";

const Timeline = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Format the timestamp into a user-friendly format
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12; // Handle midnight (0 hours)

        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${month}/${day}/${year} ${hours}:${minutes}${ampm}`;
    };

    // Timeline data from the provided JSON
    const timelineData = [
        {
            event: "CONTRACT_CREATED",
            timestamp: "2024-02-12T13:00:00Z",
            display: "Contract Created"
        },
        {
            event: "MEMBER_REVIEWED",
            timestamp: "2024-02-16T15:45:00Z",
            display: "Member Reviewed"
        },
        {
            event: "PRICE_PROPOSED",
            timestamp: "2024-02-16T15:45:00Z",
            display: "Price Proposed"
        },
        {
            event: "PRICE_ACCEPTED",
            timestamp: "2024-02-21T12:45:00Z",
            display: "Price Accepted"
        },
        {
            event: "SHIPPED_BY_CLIENT",
            timestamp: "2024-02-26T04:45:00Z",
            display: "Shipped By Client"
        }
    ];

    // Sort the timeline events chronologically
    const sortedTimelineEvents = [...timelineData].sort((a, b) =>
        new Date(a.timestamp) - new Date(b.timestamp)
    );

    // Create the formatted timeline events
    const timelineEvents = sortedTimelineEvents.map(item => ({
        title: item.display,
        date: formatTimestamp(item.timestamp)
    }));

    return (
        <Box sx={{ maxWidth: "750px", margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px" }}>
            <Typography
                variant="h1"
                fontWeight="bold"
                color="#FFFFFF"
                textAlign="left"
                marginBottom="40px"
                sx={{
                    fontSize: isMobile ? "3.5rem" : "5rem",
                }}
            >
                Timeline
            </Typography>

            <Box>
                {timelineEvents.map((event, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: "flex",
                            position: "relative",
                            marginBottom: "60px",
                        }}
                    >
                        {/* Left column with dot and line */}
                        <Box sx={{ position: "relative", width: "20px", mr: "30px" }}>
                            {/* White dot */}
                            <Box
                                sx={{
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    bgcolor: "#FFFFFF",
                                    zIndex: 2,
                                    position: "absolute",
                                    top: "10px",
                                }}
                            />

                            {/* Vertical line */}
                            {index < timelineEvents.length - 1 && (
                                <Box
                                    sx={{
                                        width: "2px",
                                        height: "120px",
                                        bgcolor: "#FFFFFF",
                                        position: "absolute",
                                        top: "40px",
                                        left: "9px",
                                        zIndex: 1,
                                    }}
                                />
                            )}
                        </Box>

                        {/* Right column with text */}
                        <Box>
                            <Typography
                                variant="h2"
                                fontWeight="bold"
                                color="#FFFFFF"
                                sx={{
                                    fontSize: isMobile ? "2rem" : "2.5rem",
                                    lineHeight: 1.2,
                                }}
                            >
                                {event.title}
                            </Typography>
                            <Typography
                                color="#FFFFFF"
                                sx={{
                                    opacity: 0.7,
                                    fontSize: isMobile ? "1.5rem" : "2rem",
                                    marginTop: "5px",
                                    textAlign: "left",
                                }}
                            >
                                {event.date}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default Timeline; 