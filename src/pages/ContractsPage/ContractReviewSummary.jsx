import React, { useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Grid2,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Paper,
  Chip,
  TextField,
  Button,
  Divider,
  Alert,
} from "@mui/material";
import {
  FiZoomIn,
  FiMessageCircle,
  FiEdit3,
  FiSave,
  FiPackage,
  FiMail,
  FiPrinter,
} from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, gql } from "@apollo/client";
import { GET_CONTRACT_BY_ID, GET_CONTRACT_BY_ORDER_REF } from "../../context/graphql/getContractDetails";
import ImagePreviewDialog from "../../components/ImagePreviewDialog";
import Timeline from "../../components/Timeline";
import CancelContractModal from "../../components/CancelContractModal";
import EvidenceStrip from "../../components/EvidenceStrip";
import UnboxingCheckpoint from "../../components/UnboxingCheckpoint";
import PackagingPhotoCard from "../../components/PackagingPhotoCard";
import { MARK_WORK_COMPLETE, MARK_RETURN_SHIPPED } from "../../context/graphql/escrowMutations";
import ReportIssueEntry, { FreezeBanner, isFrozen } from "../../components/FlagIssue";
import UnderReviewModal from "../../components/UnderReviewModal";
import CompletedModal from "../../components/CompletedModal";

const INITIATE_CONTRACT_CHAT = gql`
  mutation InitiateContractChat($contractId: ID!) {
    initiateContractChat(contractId: $contractId) {
      id
    }
  }
`;

const UPDATE_CONTRACT_MEMBER_NOTES = gql`
  mutation UpdateContractMemberNotes($id: ID!, $data: UpdateContractInput!) {
    updateContract(id: $id, data: $data)
  }
`;

const STATUS_COLORS = {
  PENDING_REVIEW: "#F59E0B",
  PRICE_PROPOSED: "#3B82F6",
  AWAITING_PAYMENT: "#10B981",
  READY_TO_SHIP: "#8B5CF6",
  INBOUND_SHIPPED: "#6366F1",
  ARRIVED_AT_MEMBER: "#F97316",
  WORK_IN_PROGRESS: "#D4AC0D",
  RETURN_SHIPPED: "#06B6D4",
  DELIVERED_TO_USER: "#14B8A6",
  COMPLETED: "#22C55E",
  CANCELED: "#6B7280",
  UNDER_MANUAL_REVIEW: "#EF4444",
  // legacy fallbacks
  PRICE_ACCEPTED: "#10B981",
  WAITING_SHIPMENT: "#8B5CF6",
  SHIPPED: "#6366F1",
  PROCESSING_RETURN: "#EC4899",
  SHIPPED_BACK: "#06B6D4",
  USER_RECEIVED: "#14B8A6",
  PAYOUT_RELEASED: "#22C55E",
};

const SECTION_LABELS = {
  leftSide: "Left Side",
  rightSide: "Right Side",
  topView: "Top View",
  bottomView: "Bottom View",
  frontView: "Front View",
  backView: "Back View",
  inside: "Inside of Shoe",
  tongue: "Tongue",
  box: "Box Condition",
  other: "Other Areas",
};

const titleCase = (str) => {
  if (!str) return str;
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
};

const MemberNotesCard = ({ contract, contractId }) => {
  const savedNotes = contract.repairDetails?.memberNotes || "";
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(savedNotes);
  const [feedback, setFeedback] = useState(null);

  const [updateNotes, { loading: saving }] = useMutation(UPDATE_CONTRACT_MEMBER_NOTES, {
    refetchQueries: [{ query: GET_CONTRACT_BY_ORDER_REF, variables: { orderRef: contract?.orderRef } }],
  });

  const handleSave = async () => {
    try {
      const { data } = await updateNotes({
        variables: { id: contractId, data: { repairDetails: { memberNotes: draft } } },
      });
      if (data?.updateContract === true) {
        setFeedback("saved");
        setEditing(false);
        setTimeout(() => setFeedback(null), 2000);
      }
    } catch {
      setFeedback("error");
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleCancel = () => {
    setDraft(savedNotes);
    setEditing(false);
  };

  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
        <Typography variant="h6" fontWeight={600}>
          My Notes
        </Typography>
        {!editing && (
          <Button size="small" onClick={() => { setDraft(savedNotes); setEditing(true); setFeedback(null); }} startIcon={<FiEdit3 size={14} />}>
            {savedNotes ? "Edit" : "Add"}
          </Button>
        )}
      </Box>
      {editing ? (
        <Box>
          <TextField
            multiline
            rows={4}
            fullWidth
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add your notes about this contract..."
            variant="outlined"
            size="small"
            autoFocus
          />
          {feedback === "error" && (
            <Typography variant="caption" color="error" sx={{ display: "block", mt: 0.5 }}>
              Failed to save.
            </Typography>
          )}
          <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
            <Button variant="contained" size="small" onClick={handleSave} disabled={saving} startIcon={saving ? <CircularProgress size={14} /> : <FiSave size={14} />}>
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button variant="outlined" size="small" onClick={handleCancel}>Cancel</Button>
          </Box>
        </Box>
      ) : (
        <Box>
          {savedNotes ? (
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{savedNotes}</Typography>
          ) : (
            <Typography variant="body2" color="text.disabled">No notes yet.</Typography>
          )}
          {feedback === "saved" && (
            <Typography variant="caption" color="success.main" sx={{ display: "block", mt: 0.5 }}>Notes saved.</Typography>
          )}
        </Box>
      )}
    </Paper>
  );
};

/**
 * Member work-completion + return-shipment actions. WORK_IN_PROGRESS offers
 * "Mark work complete" (→ READY_FOR_RETURN); READY_FOR_RETURN offers the
 * return-label flow (print → packing photos → done) plus "Mark as shipped".
 * Hidden when frozen — nothing moves during review.
 */
const WorkReturnActions = ({ contract }) => {
  const [flowOpen, setFlowOpen] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const refetch = contract?.orderRef
    ? [{ query: GET_CONTRACT_BY_ORDER_REF, variables: { orderRef: contract.orderRef } }]
    : [];
  const [markComplete, { loading: completing }] = useMutation(MARK_WORK_COMPLETE, { refetchQueries: refetch });
  const [markShipped, { loading: shipping }] = useMutation(MARK_RETURN_SHIPPED, { refetchQueries: refetch });

  if (!contract || isFrozen(contract)) return null;

  const run = async (fn) => {
    setErrorMsg(null);
    try {
      await fn({ variables: { contractId: contract.id } });
    } catch (err) {
      setErrorMsg(err.message || "Action failed.");
    }
  };

  if (contract.status === "WORK_IN_PROGRESS") {
    return (
      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
          Work finished?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Mark the restoration complete to stage the return — you&apos;ll print the return label next.
        </Typography>
        {errorMsg && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{errorMsg}</Alert>}
        <Button
          variant="contained"
          fullWidth
          disabled={completing}
          onClick={() => run(markComplete)}
          sx={{ bgcolor: "#FFD100", color: "#000", fontWeight: 700, textTransform: "none", "&:hover": { bgcolor: "#E6BC00" } }}
        >
          {completing ? "Saving…" : "Mark work complete"}
        </Button>
      </Paper>
    );
  }

  if (contract.status === "READY_FOR_RETURN") {
    return (
      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
          Ready for return
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Print the return label, snap the packed box, then mark it shipped — batch as many as you like before drop-off.
        </Typography>
        {errorMsg && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{errorMsg}</Alert>}
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            disabled={!contract.outboundLabelUrl}
            onClick={() => contract.outboundLabelUrl && setFlowOpen(true)}
            sx={{ flex: 1, textTransform: "none", fontWeight: 700 }}
          >
            Print return label
          </Button>
          <Button
            variant="contained"
            disabled={shipping}
            onClick={() => run(markShipped)}
            sx={{ flex: 1, bgcolor: "#FFD100", color: "#000", fontWeight: 700, textTransform: "none", "&:hover": { bgcolor: "#E6BC00" } }}
          >
            {shipping ? "Saving…" : "Mark as shipped"}
          </Button>
        </Box>
        <PackagingPhotoCard contract={contract} mode="return" open={flowOpen} onClose={() => setFlowOpen(false)} />
      </Paper>
    );
  }

  return null;
};

/**
 * Member earnings summary: service price, 15% platform fee, net payout
 * (stored payoutAmount — authoritative, not recomputed). Shown once priced,
 * hidden when canceled. Members should never wonder what they're earning.
 */
const EarningsSummary = ({ contract }) => {
  if (!contract || contract.status === "CANCELED") return null;
  const service = Number(contract.price ?? contract.proposedPrice) || 0;
  if (service <= 0) return null;
  const fee = Math.round(service * 0.15 * 100) / 100;
  const net = Number(contract.payoutAmount) || Math.round((service - fee) * 100) / 100;

  const row = (label, value) => (
    <Box key={label} sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 1 }}>
      <Typography variant="body1" sx={{ minWidth: 0 }}>{label}</Typography>
      <Typography variant="h6" fontWeight={600} sx={{ whiteSpace: "nowrap" }}>{value}</Typography>
    </Box>
  );

  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Your earnings
      </Typography>
      {row("Service price", `$${service.toFixed(2)}`)}
      {row("Platform fee (15%)", `−$${fee.toFixed(2)}`)}
      <Divider sx={{ my: 1.5 }} />
      {row("You earn", `$${net.toFixed(2)}`)}
    </Paper>
  );
};

/**
 * Member DELIVERED_TO_USER card: awaiting the client's confirmation.
 * States plainly that payout releases after the 72h window, automatically
 * if the client does nothing — the member's money is never held hostage
 * by an unresponsive buyer.
 */
const DeliveredPayoutCard = ({ contract }) => {
  const [now, setNow] = React.useState(() => new Date());
  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  if (!contract || contract.status !== "DELIVERED_TO_USER") return null;

  const eligibleAt = contract.payoutEligibleAt ? new Date(Number(contract.payoutEligibleAt) || contract.payoutEligibleAt) : null;
  const remaining = eligibleAt ? eligibleAt.getTime() - now.getTime() : null;
  const payout = Number(contract.payoutAmount) || 0;
  const clientName = contract.client?.firstName || "your client";

  const countdown =
    remaining == null
      ? null
      : remaining <= 0
        ? "any moment now"
        : (() => {
            const mins = Math.floor(remaining / 60000);
            const d = Math.floor(mins / 1440);
            const h = Math.floor((mins % 1440) / 60);
            const m = mins % 60;
            if (d > 0) return `${d}d ${h}h`;
            if (h > 0) return `${h}h ${m}m`;
            return `${m}m`;
          })();

  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3, borderColor: "#14B8A6", bgcolor: "rgba(20,184,166,0.04)" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 1, flexWrap: "wrap" }}>
        <Typography variant="h6" fontWeight={700}>
          Delivered — awaiting {clientName}&apos;s confirmation
        </Typography>
        <Box
          sx={{
            px: 1.75,
            py: 0.5,
            borderRadius: 2,
            bgcolor: "#14B8A6",
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.8rem",
            whiteSpace: "nowrap",
          }}
        >
          {countdown ? (countdown === "any moment now" ? "Releasing soon" : `Auto-release in ${countdown}`) : "Auto-release pending"}
        </Box>
      </Box>
      {payout > 0 && (
        <Typography variant="h3" fontWeight={800} sx={{ mb: 0.5 }}>
          ${payout.toFixed(2)}
        </Typography>
      )}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Your payout releases after the 72-hour confirmation period. If {clientName} doesn&apos;t
        confirm by then, it releases on its own.
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Nothing you need to do. If an issue is reported, you&apos;ll see it here.
      </Typography>
    </Paper>
  );
};

const ContractReviewSummary = () => {
  const { orderRef } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [previewUrl, setPreviewUrl] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const { loading, error, data } = useQuery(GET_CONTRACT_BY_ORDER_REF, {
    variables: { orderRef },
    fetchPolicy: "cache-and-network",
  });

  const [initiateChat, { loading: chatLoading }] = useMutation(INITIATE_CONTRACT_CHAT);

  const contract = data?.contractById;

  const handleChatClick = async () => {
    if (contract?.chatId) {
      navigate(`/member/chats/${contract.chatId}`);
      return;
    }
    try {
      const { data: chatData } = await initiateChat({ variables: { contractId: contract.id } });
      const chatId = chatData?.initiateContractChat?.id;
      if (chatId) navigate(`/member/chats/${chatId}`);
    } catch {
    }
  };

  const frozen = isFrozen(contract);
  const labelLive = !!contract?.outboundLabelUrl && contract.status !== "CANCELED" && !frozen;
  const needsLabelPoll = contract && !contract.outboundLabelUrl && [
    "AWAITING_SHIPMENT", "IN_TRANSIT_TO_RESTORER", "IN_RESTORATION",
    "PENDING_FINAL_APPROVAL", "COMPLETED", "IN_TRANSIT_TO_USER"
  ].includes(contract.status);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">Error: {error.message}</Typography>
      </Box>
    );
  }

  if (!contract) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Contract not found</Typography>
      </Box>
    );
  }

  const statusColor = STATUS_COLORS[contract.status] || "#6B7280";
  // Members can only cancel pre-payment; once paid (READY_TO_SHIP), they must contact support
  const canCancel =
    contract &&
    ["PENDING_REVIEW", "PRICE_PROPOSED", "AWAITING_PAYMENT"].includes(
      contract.status
    );

  const leftContent = (
    <Box>
      {/* Hero first, always: status + shoes, whatever the state. */}
      <Paper variant="outlined" sx={{ p: 3, mb: 4, textAlign: "center" }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            px: 3,
            py: 1,
            borderRadius: 2,
            bgcolor: statusColor,
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.9rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            mb: 2,
          }}
        >
          {contract.status.replace(/_/g, " ")}
        </Box>
        <Typography variant="h4" fontWeight={700}>
          {titleCase(`${contract.shoeDetails?.brand || ""} ${contract.shoeDetails?.model || ""}`)}
        </Typography>
        <Typography variant="body1" color="text.secondary" mt={0.5}>
          Submitted {new Date(Number(contract.createdAt) || contract.createdAt).toLocaleDateString()}
        </Typography>
      </Paper>

      <EarningsSummary contract={contract} />
      {contract.status === "COMPLETED" && <CompletedModal contract={contract} role="member" />}

      {contract.status === "CANCELED" && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          This contract has been canceled.
        </Alert>
      )}
      {isFrozen(contract) && <FreezeBanner role="member" />}
      {isFrozen(contract) && <UnderReviewModal contract={contract} role="member" />}
      <DeliveredPayoutCard contract={contract} />
      <UnboxingCheckpoint contract={contract} />
      <WorkReturnActions contract={contract} />

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" fontWeight={600} mb={2}>
          Shoe Details
        </Typography>
        <Grid2 container spacing={2}>
          <Grid2 xs={6} sm={4}>
            <Typography variant="body1" fontWeight={700} color="text.secondary">Brand</Typography>
            <Typography variant="h6" fontWeight={600}>{titleCase(contract.shoeDetails?.brand) || "\u2014"}</Typography>
          </Grid2>
          <Grid2 xs={6} sm={4}>
            <Typography variant="body1" fontWeight={700} color="text.secondary">Model</Typography>
            <Typography variant="h6" fontWeight={600}>{titleCase(contract.shoeDetails?.model) || "\u2014"}</Typography>
          </Grid2>
          <Grid2 xs={6} sm={4}>
            <Typography variant="body1" fontWeight={700} color="text.secondary">Color</Typography>
            <Typography variant="h6" fontWeight={600}>{titleCase(contract.shoeDetails?.color) || "\u2014"}</Typography>
          </Grid2>
          <Grid2 xs={6} sm={4}>
            <Typography variant="body1" fontWeight={700} color="text.secondary">Size (US)</Typography>
            <Typography variant="h6" fontWeight={600}>{contract.shoeDetails?.size || "\u2014"}</Typography>
          </Grid2>
          <Grid2 xs={6} sm={4}>
            <Typography variant="body1" fontWeight={700} color="text.secondary">Material</Typography>
            <Typography variant="h6" fontWeight={600}>{titleCase(contract.shoeDetails?.material) || "\u2014"}</Typography>
          </Grid2>
          <Grid2 xs={6} sm={4}>
            <Typography variant="body1" fontWeight={700} color="text.secondary">Sole Condition</Typography>
            <Typography variant="h6" fontWeight={600}>{titleCase(contract.shoeDetails?.soleCondition) || "\u2014"}</Typography>
          </Grid2>
          <Grid2 xs={6} sm={4}>
            <Typography variant="body1" fontWeight={700} color="text.secondary">Declared Market Value</Typography>
            <Typography variant="h6" fontWeight={600}>
              {contract.declaredMarketValue
                ? `$${parseFloat(contract.declaredMarketValue).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                : "\u2014"}
            </Typography>
          </Grid2>
          <Grid2 xs={6} sm={4}>
            <Typography variant="body1" fontWeight={700} color="text.secondary">Box Included</Typography>
            <Typography variant="h6" fontWeight={600}>{contract.boxIncluded ? "Yes" : "No"}</Typography>
          </Grid2>
        </Grid2>
      </Paper>

      {contract.shoeDetails?.photos &&
        Object.entries(contract.shoeDetails.photos).some(([, photos]) => Array.isArray(photos) && photos.length > 0) && (
        <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" fontWeight={600} mb={2}>Photos</Typography>
          <Grid2 container spacing={2}>
            {Object.entries(contract.shoeDetails.photos).map(
              ([section, photos]) =>
                Array.isArray(photos) && photos.length > 0 && (
                  <Grid2 xs={12} sm={6} md={4} key={section}>
                    <Typography variant="body1" fontWeight={600} color="text.secondary" mb={1}>
                      {SECTION_LABELS[section] || section.replace(/([A-Z])/g, " $1").trim()}
                    </Typography>
                    {photos.map((photo, idx) => (
                      <Card key={idx} sx={{ mb: 1.5, position: "relative", "&:last-child": { mb: 0 } }}>
                        <CardMedia
                          component="img"
                          height="160"
                          image={photo.url}
                          alt={`${SECTION_LABELS[section] || section} ${idx + 1}`}
                          sx={{ objectFit: "cover" }}
                        />
                        <IconButton
                          onClick={() => setPreviewUrl(photo.url)}
                          size="small"
                          sx={{ position: "absolute", top: 4, left: 4, bgcolor: "rgba(0,0,0,0.45)", color: "common.white", "&:hover": { bgcolor: "rgba(0,0,0,0.7)" } }}
                        >
                          <FiZoomIn size={14} />
                        </IconButton>
                        {photo.note && (
                          <CardContent sx={{ py: 1, px: 1.5, "&:last-child": { pb: 1 } }}>
                            <Typography variant="body2" color="text.secondary">{photo.note}</Typography>
                          </CardContent>
                        )}
                        {photos.length > 1 && (
                          <Chip
                            label={`${idx + 1} of ${photos.length}`}
                            size="small"
                            sx={{ position: "absolute", bottom: 6, right: 6, bgcolor: "rgba(0,0,0,0.55)", color: "common.white" }}
                          />
                        )}
                      </Card>
                    ))}
                  </Grid2>
                )
            )}
          </Grid2>
        </Paper>
      )}

      {contract.repairDetails?.clientNotes && (
        <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" fontWeight={600} mb={1}>
            Client Notes
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {contract.repairDetails.clientNotes}
          </Typography>
        </Paper>
      )}

      <EvidenceStrip contract={contract} onPreview={setPreviewUrl} />
    </Box>
  );

  const rightContent = (
    <Box>
      <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, mb: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", bgcolor: "rgba(128, 128, 128, 0.04)" }}>
        <Typography variant="caption" color="text.secondary" fontWeight={800} textTransform="uppercase" letterSpacing="0.12em" mb={2}>
          Contract For
        </Typography>
        <Box sx={{ width: 64, height: 64, borderRadius: "50%", bgcolor: "#111", display: "flex", alignItems: "center", justifyContent: "center", mb: 1.5, boxShadow: "0 4px 14px rgba(0,0,0,0.15)" }}>
          <Typography variant="h5" fontWeight={800} color="#FFF">
            {contract.client?.firstName?.charAt(0) || ""}{contract.client?.lastName?.charAt(0) || ""}
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight={800} mb={1.5}>
          {`${contract.client?.firstName || ""} ${contract.client?.lastName || ""}`.trim() || "Unknown"}
        </Typography>
        <Button variant="outlined" size="small" sx={{ borderRadius: 6, textTransform: "none", fontWeight: 700, px: 3, color: "text.primary", borderColor: "divider" }}>
          View Profile
        </Button>
      </Paper>

      <MemberNotesCard contract={contract} contractId={contract.id} />

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <FiPackage size={18} />
          <Typography variant="h6" fontWeight={600}>Tracking</Typography>
        </Box>
        <Typography variant="subtitle2" color="text.secondary" mb={0.5}>Inbound (to you)</Typography>
        {contract.inboundTracking?.carrier ? (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight={600}>{contract.inboundTracking.carrier}</Typography>
            <Typography variant="body2" color="text.secondary">{contract.inboundTracking.trackingNumber}</Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.disabled" mb={2}>Not yet shipped</Typography>
        )}
        <Typography variant="subtitle2" color="text.secondary" mb={0.5}>Outbound (to client)</Typography>
        {contract.outboundTracking?.carrier ? (
          <Box>
            <Typography variant="body2" fontWeight={600}>{contract.outboundTracking.carrier}</Typography>
            <Typography variant="body2" color="text.secondary">{contract.outboundTracking.trackingNumber}</Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.disabled">Not yet shipped</Typography>
        )}
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            fullWidth
            disabled={!labelLive}
            startIcon={
              needsLabelPoll && !contract.outboundLabelUrl ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <FiPrinter size={18} />
              )
            }
            onClick={() => labelLive && window.open(contract.outboundLabelUrl, "_blank", "noopener")}
            sx={{
              py: 1.25,
              bgcolor:
                labelLive
                  ? "#FFD100"
                  : "action.disabledBackground",
              color:
                labelLive
                  ? "#000"
                  : "text.disabled",
              fontWeight: 700,
              textTransform: "none",
              fontSize: "1rem",
              "&:hover": {
                bgcolor:
                  labelLive
                    ? "#E6BC00"
                    : undefined,
              },
            }}
          >
            {contract.status === "CANCELED"
              ? "Contract Canceled"
              : frozen
              ? "Paused During Review"
              : contract.outboundLabelUrl 
              ? "Print Return Label" 
              : (needsLabelPoll ? "Processing Label..." : "Label Unavailable")}
          </Button>
          {contract.status !== "CANCELED" && !contract.outboundLabelUrl && needsLabelPoll && (
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center", mt: 1 }}>
              Usually takes under a minute. This page will automatically refresh.
            </Typography>
          )}
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
          <FiMessageCircle size={18} />
          <Typography variant="h6" fontWeight={600}>Chat</Typography>
        </Box>
        <Box
          component="button"
          onClick={handleChatClick}
          disabled={chatLoading}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
            width: "100%",
            px: 3,
            py: 1.75,
            borderRadius: 1,
            border: "none",
            bgcolor: "#FFD100",
            color: "#000",
            fontWeight: 700,
            fontSize: "1rem",
            cursor: "pointer",
            transition: "background-color .2s ease",
            "&:hover": { bgcolor: "#E6BC00" },
            "&:disabled": { opacity: 0.5, cursor: "not-allowed" },
          }}
        >
          <FiMessageCircle size={20} />
          {chatLoading ? "Starting..." : `Message ${contract.client?.firstName || "User"}`}
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <FiMail size={18} />
          <Typography variant="h6" fontWeight={600}>Support</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" mb={1.5}>
          Email us for billing, account, or technical issues.
        </Typography>
        <Button
          fullWidth
          variant="outlined"
          size="small"
          href="mailto:support@thesneakersociety.com"
          startIcon={<FiMail size={14} />}
          sx={{ textTransform: "none", color: "text.secondary", borderColor: "divider" }}
        >
          support@thesneakersociety.com
        </Button>
      </Paper>

      <ReportIssueEntry contract={contract} />

      {canCancel && (
        <Box sx={{ mt: 1, mb: 3, textAlign: "center" }}>
          <Button
            variant="text"
            color="error"
            size="small"
            onClick={() => setCancelModalOpen(true)}
            sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.85rem" }}
          >
            Cancel Contract Request
          </Button>
        </Box>
      )}

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Timeline
        </Typography>
        <Timeline events={contract.timeline ?? []} />
      </Paper>
    </Box>
  );

  return (
    <Box sx={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {isMobile ? (
        <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
          {leftContent}
          {rightContent}
        </Box>
      ) : (
        <Box sx={{ flex: 1, display: "grid", gridTemplateColumns: "2fr 1fr", overflow: "hidden" }}>
          <Box sx={{ overflow: "auto", p: 3, pr: 1.5 }}>
            {leftContent}
          </Box>
          <Box sx={{ overflow: "auto", p: 3, pl: 1.5 }}>
            <Box sx={{ position: "sticky", top: 0 }}>{rightContent}</Box>
          </Box>
        </Box>
      )}

      <CancelContractModal
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        contract={contract}
        userRole="member"
      />

      <ImagePreviewDialog open={!!previewUrl} url={previewUrl} onClose={() => setPreviewUrl(null)} />
    </Box>
  );
};

export default ContractReviewSummary;
