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
  Grid2,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_ADMIN_CONTRACT_DETAIL } from "./graphql";
import ContractPnLCard from "./ContractPnLCard";
import EvidenceStrip from "../../components/EvidenceStrip";
import ImagePreviewDialog from "../../components/ImagePreviewDialog";
import Timeline from "../../components/Timeline";
import Header from "../../components/Header";
import {
  FiArrowLeft,
  FiUser,
  FiTool,
  FiTruck,
  FiExternalLink,
  FiAlertTriangle,
} from "react-icons/fi";

const money = (val) => `$${Number(val || 0).toFixed(2)}`;

const AdminContractDetailPage = () => {
  const { orderRef } = useParams();
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState(null);

  const { data, loading, error } = useQuery(GET_ADMIN_CONTRACT_DETAIL, {
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

  if (error || !data?.contractByOrderRef) {
    return (
      <Box m="20px">
        <Button startIcon={<FiArrowLeft />} onClick={() => navigate("/admin/contracts")} sx={{ mb: 2 }}>
          Back to Contracts
        </Button>
        <Alert severity="error">
          Failed to load contract: {error?.message || "Contract not found"}
        </Alert>
      </Box>
    );
  }

  const contract = data.contractByOrderRef;
  const pnl = contract.pnl;
  const isDisputed = contract.status === "UNDER_MANUAL_REVIEW";

  return (
    <Box m="20px">
      {/* Top Header & Breadcrumb */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Button
          startIcon={<FiArrowLeft />}
          onClick={() => navigate("/admin/contracts")}
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          Back to All Contracts
        </Button>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Chip
            label={contract.status}
            sx={{
              fontWeight: 800,
              bgcolor: contract.status === "COMPLETED"
                ? "rgba(16, 185, 129, 0.15)"
                : isDisputed
                ? "rgba(239, 68, 68, 0.15)"
                : "rgba(59, 130, 246, 0.15)",
              color: contract.status === "COMPLETED"
                ? "#10B981"
                : isDisputed
                ? "#EF4444"
                : "#3B82F6",
            }}
          />
          <Chip
            label={`Payout: ${contract.payoutStatus || "pending"}`}
            variant="outlined"
            sx={{ fontWeight: 700 }}
          />
        </Box>
      </Box>

      {isDisputed && (
        <Alert
          severity="error"
          icon={<FiAlertTriangle size={20} />}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => navigate(`/admin/disputes/${contract.orderRef || contract.id}`)}
              sx={{ fontWeight: 700 }}
            >
              Open Dispute Hub →
            </Button>
          }
          sx={{ mb: 3 }}
        >
          This contract is currently under dispute and frozen for manual review.
        </Alert>
      )}

      <Header
        title={`Contract & P&L Audit: ${contract.orderRef || contract.id}`}
        subtitle="Itemized revenue, restorer payouts, shipping/insurance margins, and fulfillment evidence"
      />

      <Grid2 container spacing={3} sx={{ mt: 1 }}>
        {/* Left Column: Specs, Parties & Photo Evidence */}
        <Grid2 xs={12} lg={7}>
          {/* Parties Card */}
          <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Contract Parties
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

          {/* Shoe Specifications */}
          <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Shoe Specifications
            </Typography>
            <Grid2 container spacing={2}>
              <Grid2 xs={6} sm={4}>
                <Typography variant="caption" color="text.secondary">Brand & Model</Typography>
                <Typography variant="body2" fontWeight={700}>
                  {[contract.shoeDetails?.brand, contract.shoeDetails?.model].filter(Boolean).join(" ") || "Custom Repair"}
                </Typography>
              </Grid2>
              <Grid2 xs={6} sm={4}>
                <Typography variant="caption" color="text.secondary">Declared Market Value</Typography>
                <Typography variant="body2" fontWeight={700}>{money(contract.declaredMarketValue)}</Typography>
              </Grid2>
              <Grid2 xs={6} sm={4}>
                <Typography variant="caption" color="text.secondary">Service Agreed Price</Typography>
                <Typography variant="body2" fontWeight={700}>{money(contract.price)}</Typography>
              </Grid2>
              <Grid2 xs={6} sm={4}>
                <Typography variant="caption" color="text.secondary">Size / Year</Typography>
                <Typography variant="body2">{contract.shoeDetails?.size || "—"} / {contract.shoeDetails?.year || "—"}</Typography>
              </Grid2>
              <Grid2 xs={6} sm={4}>
                <Typography variant="caption" color="text.secondary">Condition</Typography>
                <Typography variant="body2">{contract.shoeDetails?.soleCondition || "—"}</Typography>
              </Grid2>
              <Grid2 xs={6} sm={4}>
                <Typography variant="caption" color="text.secondary">Return Target</Typography>
                <Typography variant="body2">{contract.shoeDetails?.returnTimeframe || "Standard"}</Typography>
              </Grid2>
            </Grid2>

            {contract.repairDetails?.clientNotes && (
              <Box sx={{ mt: 2, p: 1.5, bgcolor: "action.hover", borderRadius: 1.5 }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary">
                  Customer Notes:
                </Typography>
                <Typography variant="body2">{contract.repairDetails.clientNotes}</Typography>
              </Box>
            )}
          </Paper>

          {/* Shared Photo Evidence Strip */}
          <EvidenceStrip contract={contract} onPreview={setPreviewUrl} />
        </Grid2>

        {/* Right Column: Option B Unit Economics & Logistics */}
        <Grid2 xs={12} lg={5}>
          {/* Option B: Itemized Contract P&L Card */}
          <ContractPnLCard pnl={pnl} />

          {/* Carrier Custody & Tracking Card */}
          <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <FiTruck size={20} />
              <Typography variant="h6" fontWeight={700}>
                Carrier Custody & Tracking
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

          {/* Timeline Audit Trail */}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Timeline Audit Trail
            </Typography>
            <Timeline events={contract.timeline || []} />
          </Paper>
        </Grid2>
      </Grid2>

      {/* Image Zoom Preview */}
      <ImagePreviewDialog
        open={Boolean(previewUrl)}
        url={previewUrl}
        onClose={() => setPreviewUrl(null)}
      />
    </Box>
  );
};

export default AdminContractDetailPage;
