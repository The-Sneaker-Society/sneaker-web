import React, { useMemo } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { format } from "date-fns";
import { useColors } from "../theme/colors";

const getEventDisplay = (eventType) => {
    const eventMap = {
        CONTRACT_CREATED: "Contract Created",
        CHAT_INITIATED: "Chat Initiated",
        PRICE_PROPOSED_BY_MEMBER: "Price Proposed",
        PRICE_REPROPOSED: "Price Reproposed",
        PAYMENT_COMPLETED: "Payment Completed",
        SHIPPING_SELECTED: "Shipping Selected",
        INSURANCE_DECLINED: "Insurance Declined",
        LABEL_GENERATION_FAILED: "Label Delayed",
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

    return eventMap[eventType] ?? String(eventType || "").replace(/_/g, " ").toLowerCase();
};

const formatTimestamp = (timestamp) => {
    const d = new Date(Number(timestamp) || timestamp);
    if (Number.isNaN(d.getTime())) return "—";
    try {
        return format(d, "MM/dd/yyyy h:mma");
    } catch {
        return "—";
    }
};

const TimelineItem = ({ event, date, isLast, colors }) => {
    return (
        <Box sx={{ display: "flex", position: "relative", mb: isLast ? 0 : 2.5 }}>
            <Box sx={{ position: "relative", width: "16px", mr: 2, flexShrink: 0 }}>
                <Box
                    sx={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        bgcolor: "#FFD100",
                        zIndex: 2,
                        position: "absolute",
                        top: "4px",
                        left: "2px",
                    }}
                />
                {!isLast && (
                    <Box
                        sx={{
                            width: "2px",
                            bgcolor: colors.borderSubtle,
                            position: "absolute",
                            top: "22px",
                            bottom: "-14px",
                            left: "7px",
                            zIndex: 1,
                        }}
                    />
                )}
            </Box>
            <Box sx={{ pb: isLast ? 0 : 0.5 }}>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: colors.textPrimary, lineHeight: 1.3 }}>
                    {event}
                </Typography>
                <Typography sx={{ color: colors.textSecondary, fontSize: "0.75rem", mt: 0.25 }}>
                    {date}
                </Typography>
            </Box>
        </Box>
    );
};

/**
 * Shared journey rail. Pass real events [{ event, date }]; renders newest
 * last. Theme-aware and embeddable — replaces ad-hoc timeline lists.
 */
const Timeline = ({ events = [] }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const colors = useColors();

    const sortedTimelineEvents = useMemo(() => {
        return [...(events || [])]
            .filter((item) => item && (item.event || item.title))
            .sort((a, b) => new Date(a.date || a.timestamp) - new Date(b.date || b.timestamp))
            .map((item) => ({
                title: item.title || getEventDisplay(item.event),
                date: formatTimestamp(item.date || item.timestamp),
            }));
    }, [events]);

    if (sortedTimelineEvents.length === 0) {
        return (
            <Typography sx={{ fontSize: "0.85rem", color: colors.textSecondary }}>
                No updates yet.
            </Typography>
        );
    }

    return (
        <Box sx={{ width: "100%", maxHeight: isMobile ? 320 : 420, overflowY: "auto", pr: 1 }}>
            {sortedTimelineEvents.map((event, index) => (
                <TimelineItem
                    key={index}
                    event={event.title}
                    date={event.date}
                    isLast={index === sortedTimelineEvents.length - 1}
                    colors={colors}
                />
            ))}
        </Box>
    );
};

export default Timeline;
