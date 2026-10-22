import React, { useMemo } from "react";
import { Box, Typography, Chip, useTheme, useMediaQuery } from "@mui/material";
import { format } from "date-fns";
import { useColors } from "../theme/colors";

const isAdminEvent = (eventType, actor) => {
    if (typeof actor === "string" && actor.toLowerCase().includes("admin")) return true;
    if (typeof eventType === "string" && eventType.toUpperCase().startsWith("ADMIN_")) return true;
    return false;
};

const getActorChip = (actor) => {
    if (typeof actor !== "string" || !actor) return null;
    const a = actor.toLowerCase();
    if (a.includes("admin")) {
        return {
            label: "ADMIN",
            bgcolor: "rgba(139, 92, 246, 0.15)",
            color: "#7C3AED",
            border: "1px solid #8B5CF6",
        };
    }
    if (a.includes("client") || a.includes("user")) {
        return {
            label: "CUSTOMER",
            bgcolor: "rgba(59, 130, 246, 0.15)",
            color: "#3B82F6",
            border: "1px solid #3B82F6",
        };
    }
    if (a.includes("member")) {
        return {
            label: "RESTORER",
            bgcolor: "rgba(180, 83, 9, 0.15)",
            color: "#B45309",
            border: "1px solid #B45309",
        };
    }
    return null;
};

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
        DISPUTE_DISMISSED: "Dispute Dismissed — No Action Needed",
        ADMIN_RULED_FOR_USER: "Admin Ruled for Customer",
        ADMIN_RULED_FOR_MEMBER: "Admin Ruled for Restorer",
        ADMIN_RULED_INCONCLUSIVE: "Admin Split Resolution",
        RETURN_SHIPMENT_CHARGED_TO_MEMBER: "Shipping Charged to Restorer",
        PAYOUT_WITHHELD_FOR_DEBT: "Payout Withheld for Debt",
        PACKAGING_PHOTOS_UPLOADED: "Packaging Photos Uploaded",
        RETURN_PACKAGING_PHOTOS_UPLOADED: "Return Packaging Photos Uploaded",
        READY_FOR_RETURN: "Ready for Return",
        ARRIVED_AT_MEMBER: "Arrived at Restorer",
        PENDING_REVIEW: "Pending Review",
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

const TimelineItem = ({ event, date, isLast, colors, actor, reason, refundCents }) => {
    const admin = isAdminEvent(event?.rawEvent, actor);
    const actorChip = getActorChip(actor);
    return (
        <Box sx={{ display: "flex", position: "relative", mb: isLast ? 0 : 2.5 }}>
            <Box sx={{ position: "relative", width: "16px", mr: 2, flexShrink: 0 }}>
                <Box
                    sx={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        bgcolor: admin ? "#8B5CF6" : actorChip ? actorChip.color : "#FFD100",
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
            <Box sx={{ pb: isLast ? 0 : 0.5, flex: 1, minWidth: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: colors.textPrimary, lineHeight: 1.3 }}>
                        {event?.title || event}
                    </Typography>
                    {actorChip && (
                        <Chip
                            size="small"
                            label={actorChip.label}
                            sx={{
                                fontWeight: 800,
                                fontSize: "0.65rem",
                                height: 20,
                                bgcolor: actorChip.bgcolor,
                                color: actorChip.color,
                                border: actorChip.border,
                            }}
                        />
                    )}
                </Box>
                <Typography sx={{ color: colors.textSecondary, fontSize: "0.75rem", mt: 0.25 }}>
                    {date}
                </Typography>
                {reason ? (
                    <Typography sx={{ color: colors.textSecondary, fontSize: "0.78rem", mt: 0.5, fontStyle: "italic", wordBreak: "break-word" }}>
                        {reason}
                    </Typography>
                ) : null}
                {refundCents != null ? (
                    <Typography sx={{ color: colors.textSecondary, fontSize: "0.75rem", mt: 0.25, fontWeight: 600 }}>
                        Refund: ${(Number(refundCents) / 100).toFixed(2)}
                    </Typography>
                ) : null}
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
                rawEvent: item.event,
                date: formatTimestamp(item.date || item.timestamp),
                actor: item.actor,
                reason: item.reason,
                refundCents: item.refundCents,
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
                    event={event}
                    date={event.date}
                    actor={event.actor}
                    reason={event.reason}
                    refundCents={event.refundCents}
                    isLast={index === sortedTimelineEvents.length - 1}
                    colors={colors}
                />
            ))}
        </Box>
    );
};

export default Timeline;
