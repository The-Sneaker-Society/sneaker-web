import React, { useMemo } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { format } from "date-fns";

const getEventDisplay = (eventType) => {
    const eventMap = {
        CONTRACT_CREATED: "Contract Created",
        CHAT_INITIATED: "Chat Initiated",
        PRICE_PROPOSED_BY_MEMBER: "Price Proposed",
        PRICE_REPROPOSED: "Price Reproposed",
        PAYMENT_COMPLETED: "Payment Completed",
        INBOUND_LABEL_GENERATED: "Inbound Label Generated",
        OUTBOUND_LABEL_GENERATED: "Outbound Label Generated",
        INBOUND_SHIPPED: "Inbound Shipped",
        INBOUND_DELIVERED: "Inbound Delivered",
        UNBOXING_PHOTOS_UPLOADED: "Unboxing Photos Uploaded",
        WORK_STARTED: "Work Started",
        RETURN_SHIPPED: "Return Shipped",
        RETURN_DELIVERED: "Return Delivered",
        REVIEW_WINDOW_OPENED: "Review Window Opened",
        PAYOUT_RELEASED: "Payout Released",
        CONTRACT_COMPLETED: "Contract Completed",
        CONTRACT_CANCELED: "Contract Canceled",
        DISPUTE_OPENED: "Dispute Opened",
        DISPUTE_RESOLVED: "Dispute Resolved",
        // legacy fallbacks
        MEMBER_REVIEWED: "Member Reviewed",
        PRICE_PROPOSED: "Price Proposed",
        PRICE_ACCEPTED: "Price Accepted",
        SHIPPED_BY_CLIENT: "Shipped By Client",
        PAYMENT_RECEIVED: "Payment Completed",
    };

    return eventMap[eventType] ?? eventType;
};

const TimelineItem = ({ event, date, isLast }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Box
            sx={{
                display: "flex",
                position: "relative",
                marginBottom: "60px",
            }}
        >
            <Box sx={{ position: "relative", width: "20px", mr: "30px" }}>
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
                    {event}
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
                    {date}
                </Typography>
            </Box>
        </Box>
    );
};

const Timeline = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const formatTimestamp = (timestamp) => {
        return format(new Date(timestamp), "MM/dd/yyyy h:mma");
    };

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

    const sortedTimelineEvents = useMemo(() => {
        return [...timelineData]
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
            .map(item => ({
                title: getEventDisplay(item.event),
                date: formatTimestamp(item.timestamp)
            }));
    }, [timelineData]);

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

            <Box sx={{ width: "100%", height: "400px", overflowY: "scroll" }}>
                {sortedTimelineEvents.map((event, index) => (
                    <TimelineItem
                        key={index}
                        event={event.title}
                        date={event.date}
                        isLast={index === sortedTimelineEvents.length - 1}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default Timeline; 