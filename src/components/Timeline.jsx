import React from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { format, parseISO } from "date-fns";

// Utility function to map event types to display text
const getEventDisplay = (eventType) => {
    const eventMap = {
        CONTRACT_CREATED: "Contract Created",
        MEMBER_REVIEWED: "Member Reviewed",
        PRICE_PROPOSED: "Price Proposed",
        PRICE_ACCEPTED: "Price Accepted",
        SHIPPED_BY_CLIENT: "Shipped By Client"
    };

    return eventMap[eventType] || eventType;
};

// TimelineItem component
const TimelineItem = ({ event, isLast, isMobile }) => {
    return (
        <Box
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
                {!isLast && (
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
                    {getEventDisplay(event.event)}
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
                    {format(parseISO(event.timestamp), "MM/dd/yyyy h:mmaa")}
                </Typography>
            </Box>
        </Box>
    );
};

const Timeline = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const timelineData = [
        {
            event: "CONTRACT_CREATED",
            timestamp: "2024-02-12T13:00:00Z"
        },
        {
            event: "MEMBER_REVIEWED",
            timestamp: "2024-02-16T15:45:00Z"
        },
        {
            event: "PRICE_PROPOSED",
            timestamp: "2024-02-16T15:45:00Z"
        },
        {
            event: "PRICE_ACCEPTED",
            timestamp: "2024-02-21T12:45:00Z"
        },
        {
            event: "SHIPPED_BY_CLIENT",
            timestamp: "2024-02-26T04:45:00Z"
        }
    ];

    // Sort the timeline events chronologically
    const sortedTimelineEvents = [...timelineData].sort((a, b) =>
        new Date(a.timestamp) - new Date(b.timestamp)
    );

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
                {sortedTimelineEvents.map((event, index) => (
                    <TimelineItem
                        key={index}
                        event={event}
                        isLast={index === sortedTimelineEvents.length - 1}
                        isMobile={isMobile}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default Timeline; 