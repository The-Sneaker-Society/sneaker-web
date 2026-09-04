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

const ContractReviewSummary = () => {
  const { orderRef } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [previewUrl, setPreviewUrl] = useState(null);

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

  const leftContent = (
    <Box>
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
            disabled={!contract.outboundLabelUrl}
            startIcon={
              contract.outboundLabelUrl ? <FiPrinter size={18} /> : 
              (needsLabelPoll ? <CircularProgress size={16} color="inherit" /> : <FiPrinter size={18} />)
            }
            onClick={() => contract.outboundLabelUrl && window.open(contract.outboundLabelUrl, "_blank", "noopener")}
            sx={{
              py: 1.25,
              bgcolor: contract.outboundLabelUrl ? "#FFD100" : "action.disabledBackground",
              color: contract.outboundLabelUrl ? "#000" : "text.disabled",
              fontWeight: 700,
              textTransform: "none",
              fontSize: "1rem",
              "&:hover": { bgcolor: contract.outboundLabelUrl ? "#E6BC00" : undefined },
            }}
          >
            {contract.outboundLabelUrl 
              ? "Print Return Label" 
              : (needsLabelPoll ? "Processing Label..." : "Label Unavailable")}
          </Button>
          {!contract.outboundLabelUrl && needsLabelPoll && (
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

      <ImagePreviewDialog open={!!previewUrl} url={previewUrl} onClose={() => setPreviewUrl(null)} />
    </Box>
  );
};

export default ContractReviewSummary;
