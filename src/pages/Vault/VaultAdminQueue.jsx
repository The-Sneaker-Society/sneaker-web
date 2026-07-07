import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  TextField,
  Skeleton,
  Alert,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import {
  CheckCircleOutlined,
  CancelOutlined,
  StarOutlined,
  StarBorderOutlined,
  PublishOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { useQuery, useMutation } from "@apollo/client";
import { useColors } from "../../theme/colors";
import {
  GET_ADMIN_VAULT_QUEUE,
  APPROVE_VAULT_SUBMISSION,
  REJECT_VAULT_SUBMISSION,
  FEATURE_VAULT_SUBMISSION,
  PUBLISH_VAULT_SUBMISSION,
} from "../../context/graphql/getVault";
import VaultDetailModal from "./VaultDetailModal";

const STATUS_TABS = [
  { label: "All", value: null },
  { label: "Pending", value: "pending" },
  { label: "Under Review", value: "underReview" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Published", value: "published" },
];

const STATUS_CONFIG = {
  draft: { label: "Draft", color: "#888", bg: "rgba(136,136,136,0.15)" },
  pending: { label: "Pending", color: "#D4AC0D", bg: "rgba(212,172,13,0.15)" },
  underReview: { label: "Under Review", color: "#3498DB", bg: "rgba(52,152,219,0.15)" },
  under_review: { label: "Under Review", color: "#3498DB", bg: "rgba(52,152,219,0.15)" },
  approved: { label: "Approved", color: "#2ECC71", bg: "rgba(46,204,113,0.15)" },
  rejected: { label: "Rejected", color: "#e74c3c", bg: "rgba(231,76,60,0.15)" },
  published: { label: "Published", color: "#9B59B6", bg: "rgba(155,89,182,0.15)" },
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const RejectDialog = ({ open, onClose, onConfirm, loading }) => {
  const colors = useColors();
  const [rejectNotes, setRejectNotes] = useState("");
  const [noteError, setNoteError] = useState("");

  const handleConfirm = () => {
    if (!rejectNotes.trim()) {
      setNoteError("Rejection notes are required.");
      return;
    }
    onConfirm(rejectNotes.trim());
  };

  const handleClose = () => {
    setRejectNotes("");
    setNoteError("");
    onClose();
  };

  const borderColor = colors.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          backgroundColor: colors.isDark ? "#111" : "#fff",
          borderRadius: "16px",
          border: `1px solid ${borderColor}`,
          minWidth: 360,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          color: colors.textPrimary,
        }}
      >
        Reject Submission
      </DialogTitle>
      <DialogContent>
        <Typography
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "13px",
            color: colors.textSecondary,
            mb: 2,
          }}
        >
          Please provide a reason for rejection (required):
        </Typography>
        <TextField
          value={rejectNotes}
          onChange={(e) => {
            setRejectNotes(e.target.value);
            setNoteError("");
          }}
          placeholder="Rejection reason..."
          multiline
          rows={3}
          fullWidth
          error={Boolean(noteError)}
          helperText={noteError}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontFamily: "Montserrat, sans-serif",
              color: colors.textPrimary,
              "& fieldset": { borderColor },
            },
          }}
          inputProps={{ style: { fontFamily: "Montserrat, sans-serif" } }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          onClick={handleClose}
          sx={{
            fontFamily: "Montserrat, sans-serif",
            textTransform: "none",
            color: colors.textSecondary,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={loading}
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            textTransform: "none",
            backgroundColor: "#e74c3c",
            color: "#fff",
            borderRadius: "8px",
            px: 2,
            "&:hover": { backgroundColor: "#c0392b" },
          }}
        >
          {loading ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : "Confirm Reject"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ApproveDialog = ({ open, onClose, onConfirm, loading }) => {
  const colors = useColors();
  const [approveNotes, setApproveNotes] = useState("");

  const handleClose = () => {
    setApproveNotes("");
    onClose();
  };

  const borderColor = colors.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          backgroundColor: colors.isDark ? "#111" : "#fff",
          borderRadius: "16px",
          border: `1px solid ${borderColor}`,
          minWidth: 360,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          color: colors.textPrimary,
        }}
      >
        Approve Submission
      </DialogTitle>
      <DialogContent>
        <Typography
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "13px",
            color: colors.textSecondary,
            mb: 2,
          }}
        >
          Optional: add a note for the member:
        </Typography>
        <TextField
          value={approveNotes}
          onChange={(e) => setApproveNotes(e.target.value)}
          placeholder="Great work! We'll be featuring this soon..."
          multiline
          rows={2}
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              fontFamily: "Montserrat, sans-serif",
              color: colors.textPrimary,
              "& fieldset": { borderColor },
            },
          }}
          inputProps={{ style: { fontFamily: "Montserrat, sans-serif" } }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          onClick={handleClose}
          sx={{
            fontFamily: "Montserrat, sans-serif",
            textTransform: "none",
            color: colors.textSecondary,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => onConfirm(approveNotes || undefined)}
          disabled={loading}
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            textTransform: "none",
            backgroundColor: "#2ECC71",
            color: "#000",
            borderRadius: "8px",
            px: 2,
            "&:hover": { backgroundColor: "#27ae60" },
          }}
        >
          {loading ? <CircularProgress size={16} sx={{ color: "#000" }} /> : "Confirm Approve"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const VaultAdminQueue = () => {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState(0);
  const [detailSubmission, setDetailSubmission] = useState(null);
  const [approveTarget, setApproveTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);

  const statusFilter = STATUS_TABS[activeTab].value;

  const { data, loading, error, refetch } = useQuery(GET_ADMIN_VAULT_QUEUE, {
    variables: {
      status: statusFilter,
      limit: 50,
      offset: 0,
    },
    fetchPolicy: "cache-and-network",
  });

  const [approveSubmission, { loading: approving }] = useMutation(
    APPROVE_VAULT_SUBMISSION,
    { onCompleted: () => refetch() }
  );
  const [rejectSubmission, { loading: rejecting }] = useMutation(
    REJECT_VAULT_SUBMISSION,
    { onCompleted: () => refetch() }
  );
  const [featureSubmission, { loading: featuring }] = useMutation(
    FEATURE_VAULT_SUBMISSION,
    { onCompleted: () => refetch() }
  );
  const [publishSubmission, { loading: publishing }] = useMutation(
    PUBLISH_VAULT_SUBMISSION,
    { onCompleted: () => refetch() }
  );

  const handleApprove = async (id, notes) => {
    await approveSubmission({ variables: { id, notes } });
    setApproveTarget(null);
  };

  const handleReject = async (id, notes) => {
    await rejectSubmission({ variables: { id, notes } });
    setRejectTarget(null);
  };

  const handleFeature = async (submission) => {
    await featureSubmission({
      variables: { id: submission.id, featured: !submission.isFeatured },
    });
  };

  const handlePublish = async (id) => {
    await publishSubmission({ variables: { id } });
  };

  const handleDetailAction = (updated) => {
    setDetailSubmission(updated);
    refetch();
  };

  const borderColor = colors.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const tableBg = colors.isDark ? "#0a0a0a" : "#fafafa";
  const headerBg = colors.isDark ? "#111" : "#f3f3f3";
  const rowHover = colors.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)";

  const items = data?.adminVaultQueue?.items || [];

  return (
    <Box>
      <Typography
        sx={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          fontSize: "1.1rem",
          color: colors.textPrimary,
          mb: 2,
        }}
      >
        Admin Moderation Queue
      </Typography>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, val) => setActiveTab(val)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 3,
          borderBottom: `1px solid ${borderColor}`,
          "& .MuiTab-root": {
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            fontSize: "12px",
            textTransform: "none",
            color: colors.textSecondary,
            minWidth: "auto",
            px: 2,
          },
          "& .Mui-selected": { color: `${colors.warning} !important` },
          "& .MuiTabs-indicator": { backgroundColor: colors.warning },
        }}
      >
        {STATUS_TABS.map((tab, i) => (
          <Tab key={tab.label} label={tab.label} value={i} />
        ))}
      </Tabs>

      {/* Error */}
      {error && (
        <Alert
          severity="error"
          action={
            <Button
              onClick={() => refetch()}
              size="small"
              sx={{ fontFamily: "Montserrat, sans-serif", color: "#e74c3c" }}
            >
              Retry
            </Button>
          }
          sx={{ mb: 2, fontFamily: "Montserrat, sans-serif", fontSize: "13px" }}
        >
          Failed to load queue: {error.message}
        </Alert>
      )}

      {/* Table */}
      <TableContainer
        sx={{
          border: `1px solid ${borderColor}`,
          borderRadius: "12px",
          backgroundColor: tableBg,
          overflow: "hidden",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: headerBg }}>
              {["Member", "Title", "Category", "Status", "Submitted", "Actions"].map(
                (header) => (
                  <TableCell
                    key={header}
                    sx={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 700,
                      fontSize: "11px",
                      color: colors.textSecondary,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      borderBottom: `1px solid ${borderColor}`,
                      py: 1.5,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {header}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((__, j) => (
                    <TableCell key={j} sx={{ borderBottom: `1px solid ${borderColor}` }}>
                      <Skeleton
                        variant="text"
                        sx={{ backgroundColor: colors.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!loading && items.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{
                    py: 6,
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "14px",
                    color: colors.textSecondary,
                    borderBottom: "none",
                  }}
                >
                  No submissions found
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              items.map((item) => {
                const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.draft;
                const memberName = item.member
                  ? `${item.member.firstName || ""} ${item.member.lastName || ""}`.trim() ||
                    item.member.businessName ||
                    "—"
                  : "—";

                return (
                  <TableRow
                    key={item.id}
                    hover
                    onClick={() => setDetailSubmission(item)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { backgroundColor: rowHover },
                      "&:last-child td": { borderBottom: "none" },
                    }}
                  >
                    <TableCell
                      sx={{
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: "13px",
                        color: colors.textPrimary,
                        borderBottom: `1px solid ${borderColor}`,
                        py: 1.5,
                        maxWidth: "140px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {memberName}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: "13px",
                        color: colors.textPrimary,
                        borderBottom: `1px solid ${borderColor}`,
                        py: 1.5,
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontWeight: 600,
                      }}
                    >
                      {item.title}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: `1px solid ${borderColor}`,
                        py: 1.5,
                      }}
                    >
                      {item.category && (
                        <Chip
                          label={item.category}
                          size="small"
                          sx={{
                            fontFamily: "Montserrat, sans-serif",
                            fontSize: "10px",
                            height: "20px",
                            color: colors.warning,
                            border: `1px solid ${colors.warning}`,
                            backgroundColor: "transparent",
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: `1px solid ${borderColor}`,
                        py: 1.5,
                      }}
                    >
                      <Chip
                        label={statusCfg.label}
                        size="small"
                        sx={{
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 700,
                          fontSize: "10px",
                          height: "20px",
                          backgroundColor: statusCfg.bg,
                          color: statusCfg.color,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: "12px",
                        color: colors.textSecondary,
                        borderBottom: `1px solid ${borderColor}`,
                        py: 1.5,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(item.createdAt)}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: `1px solid ${borderColor}`,
                        py: 1.5,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDetailSubmission(item);
                            }}
                            sx={{ color: colors.textSecondary, "&:hover": { color: colors.warning } }}
                          >
                            <VisibilityOutlined sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Approve">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setApproveTarget(item);
                            }}
                            disabled={item.status === "approved" || approving}
                            sx={{
                              color: "#2ECC71",
                              "&:hover": { backgroundColor: "rgba(46,204,113,0.1)" },
                              "&.Mui-disabled": { opacity: 0.3 },
                            }}
                          >
                            <CheckCircleOutlined sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setRejectTarget(item);
                            }}
                            disabled={item.status === "rejected" || rejecting}
                            sx={{
                              color: "#e74c3c",
                              "&:hover": { backgroundColor: "rgba(231,76,60,0.1)" },
                              "&.Mui-disabled": { opacity: 0.3 },
                            }}
                          >
                            <CancelOutlined sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={item.isFeatured ? "Unfeature" : "Feature"}>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFeature(item);
                            }}
                            disabled={featuring}
                            sx={{
                              color: colors.warning,
                              "&:hover": { backgroundColor: "rgba(255,195,28,0.1)" },
                            }}
                          >
                            {item.isFeatured ? (
                              <StarOutlined sx={{ fontSize: 16 }} />
                            ) : (
                              <StarBorderOutlined sx={{ fontSize: 16 }} />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Publish">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePublish(item.id);
                            }}
                            disabled={
                              item.status === "published" ||
                              !item.isApproved ||
                              publishing
                            }
                            sx={{
                              color: "#9B59B6",
                              "&:hover": { backgroundColor: "rgba(155,89,182,0.1)" },
                              "&.Mui-disabled": { opacity: 0.3 },
                            }}
                          >
                            <PublishOutlined sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Detail modal */}
      {detailSubmission && (
        <VaultDetailModal
          submission={detailSubmission}
          open={Boolean(detailSubmission)}
          onClose={() => setDetailSubmission(null)}
          onAction={handleDetailAction}
        />
      )}

      {/* Approve dialog */}
      <ApproveDialog
        open={Boolean(approveTarget)}
        onClose={() => setApproveTarget(null)}
        onConfirm={(notes) => handleApprove(approveTarget?.id, notes)}
        loading={approving}
      />

      {/* Reject dialog */}
      <RejectDialog
        open={Boolean(rejectTarget)}
        onClose={() => setRejectTarget(null)}
        onConfirm={(notes) => handleReject(rejectTarget?.id, notes)}
        loading={rejecting}
      />
    </Box>
  );
};

export default VaultAdminQueue;
