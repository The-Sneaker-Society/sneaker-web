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
import Header from "../../components/Header";
import {
  FiArrowLeft,
  FiUser,
  FiTool,
  FiPackage,
  FiMessageSquare,
  FiCheckCircle,
  FiXCircle,
  FiSliders,
  FiTruck,
  FiExternalLink,
} from "react-icons/fi";
import { format } from "date-fns";

const money = (val) => `$${Number(val || 0).toFixed(2)}`;

const AdminDisputeDetailPage = () => {
  const { orderRef } = useParams();
  const navigate = useNavigate();

  const [previewUrl, setPreviewUrl] = useState(null);
  const [modalAction, setModalAction] = useState(null); // "USER" | "MEMBER" | "INCONCLUSIVE" | null

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

  return (
    <Box m="20px">
      {/* Top Header & Breadcrumb */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Button
          startIcon={<FiArrowLeft />}
          onClick={() => navigate("/admin/disputes")}
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          Back to Dispute Queue
        </Button>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Chip
            label={contract.status}
            sx={{
              fontWeight: 800,
              bgcolor: isUnderReview ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)",
              color: isUnderReview ? "#EF4444" : "#10B981",
              border: `1px solid ${isUnderReview ? "#EF4444" : "#10B981"}`,
            }}
          />
          <Chip
            label={`Payout: ${contract.payoutStatus || "pending"}`}
            variant="outlined"
            sx={{ fontWeight: 700 }}
          />
        </Box>
      </Box>

      <Header
        title={`Adjudication Hub: ${contract.orderRef || contract.id}`}
        subtitle="Full un-redacted evidence viewer, customer/restorer communications, and per-contract P&L"
      />

      <Grid2 container spacing={3} sx={{ mt: 1 }}>
        {/* Left Column: Evidence Viewer & Communications */}
        <Grid2 xs={12} lg={7}>
          {/* Parties Overview Card */}
          <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Dispute Parties
            </Typography>
            <Grid2 container spacing={2}>
              <Grid2 xs={12} sm={6}>
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

              <Grid2 xs={12} sm={6}>
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
              <Grid2 xs={6} sm={4}>
                <Typography variant="caption" color="text.secondary">Model</Typography>
                <Typography variant="body2" fontWeight={700}>{contract.shoeDetails?.model || "Standard"}</Typography>
              </Grid2>
              <Grid2 xs={6} sm={4}>
                <Typography variant="caption" color="text.secondary">Declared Value</Typography>
                <Typography variant="body2" fontWeight={700}>{money(contract.declaredMarketValue)}</Typography>
              </Grid2>
              <Grid2 xs={6} sm={4}>
                <Typography variant="caption" color="text.secondary">Service Agreed</Typography>
                <Typography variant="body2" fontWeight={700}>{money(contract.price)}</Typography>
              </Grid2>
              <Grid2 xs={6} sm={4}>
                <Typography variant="caption" color="text.secondary">Size / Year</Typography>
                <Typography variant="body2">{contract.shoeDetails?.size || "—"} / {contract.shoeDetails?.year || "—"}</Typography>
              </Grid2>
              <Grid2 xs={6} sm={4}>
                <Typography variant="caption" color="text.secondary">Condition / Odor</Typography>
                <Typography variant="body2">{contract.shoeDetails?.soleCondition || "—"} (Odor: {contract.shoeDetails?.odorLevel || "—"})</Typography>
              </Grid2>
              <Grid2 xs={6} sm={4}>
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
        <Grid2 xs={12} lg={5}>
          {/* Option B: Itemized Unit Economics & P&L Card */}
          <ContractPnLCard pnl={pnl} />

          {/* Adjudication Decision Card */}
          <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
              Adjudication Decision
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
              Choose a binding resolution. Refunds are processed immediately through Stripe, payouts released, and the timeline updated.
            </Typography>

            {isTerminal ? (
              <Alert severity="success" sx={{ fontWeight: 600 }}>
                This contract has already been resolved ({contract.status}). No further actions required.
              </Alert>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<FiCheckCircle />}
                  onClick={() => setModalAction("USER")}
                  sx={{ py: 1.2, fontWeight: 700 }}
                >
                  Rule for Customer (100% Refund)
                </Button>

                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  startIcon={<FiCheckCircle />}
                  onClick={() => setModalAction("MEMBER")}
                  sx={{ py: 1.2, fontWeight: 700 }}
                >
                  Rule for Restorer (Release Payout)
                </Button>

                <Button
                  variant="outlined"
                  color="warning"
                  fullWidth
                  startIcon={<FiSliders />}
                  onClick={() => setModalAction("INCONCLUSIVE")}
                  sx={{ py: 1.2, fontWeight: 700 }}
                >
                  Inconclusive / Split Resolution
                </Button>
              </Box>
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

      {/* Adjudication Modal */}
      {modalAction && (
        <DisputeResolutionModal
          open={Boolean(modalAction)}
          onClose={() => setModalAction(null)}
          contract={contract}
          pnl={pnl}
          actionType={modalAction}
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
