import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Avatar,
  Card,
  CardContent,
  IconButton,
  Grid2,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_ADMIN_DISPUTE_DETAIL } from "./graphql";
import ContractPnLCard from "./ContractPnLCard";
import DisputeResolutionModal from "./DisputeResolutionModal";
import EvidenceStrip from "../../components/EvidenceStrip";
import ImagePreviewDialog from "../../components/ImagePreviewDialog";
import Timeline from "../../components/Timeline";
import {
  FiArrowLeft,
  FiUser,
  FiTool,
  FiPackage,
  FiMessageSquare,
  FiXCircle,
  FiSliders,
  FiTruck,
  FiExternalLink,
} from "react-icons/fi";
import { format, formatDistanceToNow } from "date-fns";

const money = (val) => `$${Number(val || 0).toFixed(2)}`;

const formatDateTime = (value) => {
  if (!value) return "—";
  try {
    const d = new Date(Number(value) || value);
    if (Number.isNaN(d.getTime())) return "—";
    return format(d, "MMM d, yyyy · h:mm a");
  } catch {
    return "—";
  }
};

const AdminDisputeDetailPage = () => {
  const { orderRef } = useParams();
  const navigate = useNavigate();

  const [previewUrl, setPreviewUrl] = useState(null);
  const [decisionOpen, setDecisionOpen] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_ADMIN_DISPUTE_DETAIL, {
    variables: { orderRef },
    fetchPolicy: "network-only",
  });

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !data?.adminDisputeDetail) {
    return (
      <Box m="20px">
        <Button startIcon={<FiArrowLeft />} onClick={() => navigate("/admin/disputes")} sx={{ mb: 2 }}>
          Back to Queue
        </Button>
        <Alert severity="error">
          Failed to load dispute details: {error?.message || "Contract not found"}
        </Alert>
      </Box>
    );
  }

  const { contract, chatMessages, pnl } = data.adminDisputeDetail;
  const isTerminal = contract.status === "COMPLETED" || contract.status === "CANCELED";
  const isUnderReview = contract.status === "UNDER_MANUAL_REVIEW";

  const disputeOpenedEvent = (contract.timeline || []).find((t) => t?.event === "DISPUTE_OPENED");
  const disputeOpenedAt = disputeOpenedEvent?.date;
  let flaggedAge = "";
  if (disputeOpenedAt) {
    try {
      flaggedAge = formatDistanceToNow(new Date(Number(disputeOpenedAt) || disputeOpenedAt), {
        addSuffix: false,
      });
    } catch {
      flaggedAge = "";
    }
  }

  return (
    <Box sx={{ p: "20px", width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
      <Button
        startIcon={<FiArrowLeft />}
        onClick={() => navigate("/admin/disputes")}
        sx={{ fontWeight: 600, color: "text.primary", mb: 2 }}
      >
        Back to Dispute Queue
      </Button>

      {/* Top header bar: identity + dates + values */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box>
          <Typography
            variant="caption"
            fontWeight={800}
            color="text.secondary"
            sx={{ letterSpacing: "0.12em" }}
          >
            ADJUDICATION HUB
          </Typography>
          <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
            Order {contract.orderRef || contract.id}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Created {formatDateTime(contract.createdAt)}
          {"   ·   "}
          Flagged {formatDateTime(disputeOpenedAt)}
          {flaggedAge ? ` (${flaggedAge} ago)` : ""}
        </Typography>

        <Grid2 container spacing={2} sx={{ mt: 2 }}>
          <Grid2 size={{ xs: 6, sm: 3 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "action.hover" }}>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                SERVICE
              </Typography>
              <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5 }}>
                {money(contract.price)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                agreed price
              </Typography>
            </Box>
          </Grid2>
          <Grid2 size={{ xs: 6, sm: 3 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "action.hover" }}>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                DECLARED
              </Typography>
              <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5 }}>
                {money(contract.declaredMarketValue)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                at-risk value
              </Typography>
            </Box>
          </Grid2>
          <Grid2 size={{ xs: 6, sm: 3 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "action.hover" }}>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                PAYOUT
              </Typography>
              <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5, textTransform: "capitalize" }}>
                {contract.payoutStatus || "pending"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {money(pnl?.payoutAmount)} to release
              </Typography>
            </Box>
          </Grid2>
          <Grid2 size={{ xs: 6, sm: 3 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: isUnderReview ? "rgba(239, 68, 68, 0.08)" : "action.hover",
                border: `1px solid ${isUnderReview ? "#EF4444" : "transparent"}`,
              }}
            >
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                STATUS
              </Typography>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  mt: 0.5,
                  fontSize: "1.4rem",
                  lineHeight: 1.2,
                  color: isUnderReview ? "#EF4444" : "#10B981",
                }}
              >
                {contract.status}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                contract state
              </Typography>
            </Box>
          </Grid2>
        </Grid2>
      </Paper>

      <Grid2 container spacing={3} sx={{ mt: 1 }}>
        {/* Left Column: Evidence Viewer & Communications */}
        <Grid2 size={{ xs: 12, lg: 7 }}>
          {/* Parties Overview Card */}
          <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Dispute Parties
            </Typography>
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: "action.hover" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                    <Avatar sx={{ bgcolor: "#3B82F6", width: 36, height: 36 }}>
                      <FiUser size={18} />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={800}>
                        {`${contract.client?.firstName || ""} ${contract.client?.lastName || ""}`.trim() || "Customer"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Client / Buyer
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                    Email: <strong>{contract.client?.email || "—"}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                    Phone: {contract.client?.phoneNumber || "—"}
                  </Typography>
                </Box>
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: "action.hover" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                    <Avatar sx={{ bgcolor: "#FFD100", color: "#000", width: 36, height: 36 }}>
                      <FiTool size={18} />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={800}>
                        {`${contract.member?.firstName || ""} ${contract.member?.lastName || ""}`.trim() || contract.member?.businessName || "Restorer"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Member / Restorer
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                    Email: <strong>{contract.member?.email || "—"}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                    Phone: {contract.member?.phoneNumber || "—"}
                  </Typography>
                </Box>
              </Grid2>
            </Grid2>
          </Paper>

          {/* Shoe & Repair Specs */}
          <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Shoe & Service Specifications
            </Typography>
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 6, sm: 4 }}>
                <Typography variant="caption" color="text.secondary">Model</Typography>
                <Typography variant="body2" fontWeight={700}>{contract.shoeDetails?.model || "Standard"}</Typography>
              </Grid2>
              <Grid2 size={{ xs: 6, sm: 4 }}>
                <Typography variant="caption" color="text.secondary">Declared Value</Typography>
                <Typography variant="body2" fontWeight={700}>{money(contract.declaredMarketValue)}</Typography>
              </Grid2>
              <Grid2 size={{ xs: 6, sm: 4 }}>
                <Typography variant="caption" color="text.secondary">Service Agreed</Typography>
                <Typography variant="body2" fontWeight={700}>{money(contract.price)}</Typography>
              </Grid2>
              <Grid2 size={{ xs: 6, sm: 4 }}>
                <Typography variant="caption" color="text.secondary">Size / Year</Typography>
                <Typography variant="body2">{contract.shoeDetails?.size || "—"} / {contract.shoeDetails?.year || "—"}</Typography>
              </Grid2>
              <Grid2 size={{ xs: 6, sm: 4 }}>
                <Typography variant="caption" color="text.secondary">Condition / Odor</Typography>
                <Typography variant="body2">{contract.shoeDetails?.soleCondition || "—"} (Odor: {contract.shoeDetails?.odorLevel || "—"})</Typography>
              </Grid2>
              <Grid2 size={{ xs: 6, sm: 4 }}>
                <Typography variant="caption" color="text.secondary">Return Target</Typography>
                <Typography variant="body2">{contract.shoeDetails?.returnTimeframe || "Standard"}</Typography>
              </Grid2>
            </Grid2>

            {contract.repairDetails?.clientNotes && (
              <Box sx={{ mt: 2, p: 1.5, bgcolor: "action.hover", borderRadius: 1.5 }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary">
                  Customer Problem Description:
                </Typography>
                <Typography variant="body2">{contract.repairDetails.clientNotes}</Typography>
              </Box>
            )}
          </Paper>

          {/* Shared Photo Evidence Strip */}
          <EvidenceStrip contract={contract} onPreview={setPreviewUrl} />

          {/* Read-Only Chat Transcript */}
          <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <FiMessageSquare size={20} />
              <Typography variant="h6" fontWeight={700}>
                Chat Transcript ({chatMessages.length} messages)
              </Typography>
            </Box>

            {chatMessages.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No chat messages recorded for this contract.
              </Typography>
            ) : (
              <Box
                sx={{
                  maxHeight: 400,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  p: 1.5,
                  bgcolor: "action.hover",
                  borderRadius: 2,
                }}
              >
                {chatMessages.map((msg) => {
                  const isUserSender = msg.senderType === "USER";
                  return (
                    <Box
                      key={msg.id}
                      sx={{
                        alignSelf: isUserSender ? "flex-start" : "flex-end",
                        maxWidth: "80%",
                        bgcolor: isUserSender ? "background.paper" : "primary.main",
                        color: isUserSender ? "text.primary" : "primary.contrastText",
                        p: 1.5,
                        borderRadius: 2,
                        boxShadow: 1,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <Typography variant="caption" fontWeight={800}>
                          {isUserSender ? "Customer" : "Restorer"}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          {msg.createdAt ? format(new Date(msg.createdAt), "MMM d, h:mm a") : ""}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                        {msg.content}
                      </Typography>
                      {msg.metadata?.price != null && (
                        <Chip
                          size="small"
                          label={`Price Proposal: ${money(msg.metadata.price)} (${msg.metadata.status || "sent"})`}
                          sx={{ mt: 1, fontWeight: 700 }}
                        />
                      )}
                    </Box>
                  );
                })}
              </Box>
            )}
          </Paper>
        </Grid2>

        {/* Right Column: Economics, Tracking & Adjudication Actions */}
        <Grid2 size={{ xs: 12, lg: 5 }}>
          {/* Option B: Itemized Unit Economics & P&L Card */}
          <ContractPnLCard pnl={pnl} />

          {/* Make Decision Card */}
          <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
              Make Decision
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
              Review the evidence, then issue a binding resolution. Refunds move immediately through Stripe, payouts release, and the timeline updates.
            </Typography>

            {isTerminal ? (
              <Alert severity="success" sx={{ fontWeight: 600 }}>
                This contract has already been resolved ({contract.status}). No further actions required.
              </Alert>
            ) : (
              <Button
                variant="contained"
                fullWidth
                startIcon={<FiSliders />}
                onClick={() => setDecisionOpen(true)}
                sx={{
                  py: 1.4,
                  fontWeight: 800,
                  bgcolor: "#FFD100",
                  color: "#000",
                  "&:hover": { bgcolor: "#e6bd00" },
                }}
              >
                Make Decision
              </Button>
            )}
          </Paper>

          {/* Logistics & Tracking Card */}
          <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <FiTruck size={20} />
              <Typography variant="h6" fontWeight={700}>
                Logistics & Carrier Custody
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                INBOUND LEG (Customer → Restorer)
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                Carrier: {contract.inboundTracking?.carrier || "Shippo / USPS"}
              </Typography>
              <Typography variant="body2">
                Tracking: {contract.inboundTracking?.trackingNumber || "—"}
              </Typography>
              {contract.inboundLabelUrl && (
                <Button
                  size="small"
                  startIcon={<FiExternalLink />}
                  href={contract.inboundLabelUrl}
                  target="_blank"
                  sx={{ mt: 0.5, textTransform: "none" }}
                >
                  View Inbound PDF Label
                </Button>
              )}
            </Box>

            <Divider sx={{ my: 1.5 }} />

            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                OUTBOUND LEG (Restorer → Customer)
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                Carrier: {contract.outboundTracking?.carrier || "Shippo / USPS"}
              </Typography>
              <Typography variant="body2">
                Tracking: {contract.outboundTracking?.trackingNumber || "—"}
              </Typography>
              {contract.outboundLabelUrl && (
                <Button
                  size="small"
                  startIcon={<FiExternalLink />}
                  href={contract.outboundLabelUrl}
                  target="_blank"
                  sx={{ mt: 0.5, textTransform: "none" }}
                >
                  View Outbound PDF Label
                </Button>
              )}
            </Box>
          </Paper>

          {/* Timeline Audit History */}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Timeline Audit Trail
            </Typography>
            <Timeline events={contract.timeline || []} />
          </Paper>
        </Grid2>
      </Grid2>

      {/* Decision Modal */}
      {decisionOpen && (
        <DisputeResolutionModal
          open={decisionOpen}
          onClose={() => setDecisionOpen(false)}
          contract={contract}
          pnl={pnl}
          onSuccess={() => {
            refetch();
          }}
        />
      )}

      {/* Image Zoom Preview */}
      <ImagePreviewDialog
        open={Boolean(previewUrl)}
        url={previewUrl}
        onClose={() => setPreviewUrl(null)}
      />
    </Box>
  );
};

export default AdminDisputeDetailPage;
