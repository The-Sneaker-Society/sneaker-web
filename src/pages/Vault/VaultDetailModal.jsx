import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Chip,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  CloseOutlined,
  CheckCircleOutlined,
  CancelOutlined,
  StarOutlined,
  StarBorderOutlined,
  PublishOutlined,
  VerifiedOutlined,
} from "@mui/icons-material";
import { useMutation } from "@apollo/client";
import { useColors } from "../../theme/colors";
import {
  APPROVE_VAULT_SUBMISSION,
  REJECT_VAULT_SUBMISSION,
  FEATURE_VAULT_SUBMISSION,
  PUBLISH_VAULT_SUBMISSION,
} from "../../context/graphql/getVault";

const STATUS_CONFIG = {
  draft: { label: "Draft", color: "#888" },
  pending: { label: "Pending", color: "#D4AC0D" },
  underReview: { label: "Under Review", color: "#3498DB" },
  under_review: { label: "Under Review", color: "#3498DB" },
  approved: { label: "Approved", color: "#2ECC71" },
  rejected: { label: "Rejected", color: "#e74c3c" },
  published: { label: "Published", color: "#9B59B6" },
};

const VaultDetailModal = ({ submission, open, onClose, onAction }) => {
  const colors = useColors();
  const [rejectMode, setRejectMode] = useState(false);
  const [approveMode, setApproveMode] = useState(false);
  const [notes, setNotes] = useState(submission?.adminNotes || "");
  const [actionError, setActionError] = useState("");

  const [approveSubmission, { loading: approving }] = useMutation(
    APPROVE_VAULT_SUBMISSION
  );
  const [rejectSubmission, { loading: rejecting }] = useMutation(
    REJECT_VAULT_SUBMISSION
  );
  const [featureSubmission, { loading: featuring }] = useMutation(
    FEATURE_VAULT_SUBMISSION
  );
  const [publishSubmission, { loading: publishing }] = useMutation(
    PUBLISH_VAULT_SUBMISSION
  );

  if (!submission) return null;

  const isLoading = approving || rejecting || featuring || publishing;
  const statusCfg = STATUS_CONFIG[submission.status] || STATUS_CONFIG.draft;

  const handleApprove = async () => {
    setActionError("");
    try {
      const { data } = await approveSubmission({
        variables: { id: submission.id, notes: notes || undefined },
      });
      onAction({ ...submission, ...data.approveVaultSubmission });
      setApproveMode(false);
    } catch (err) {
      setActionError(err.message || "Approval failed.");
    }
  };

  const handleReject = async () => {
    if (!notes.trim()) {
      setActionError("Rejection notes are required.");
      return;
    }
    setActionError("");
    try {
      const { data } = await rejectSubmission({
        variables: { id: submission.id, notes: notes.trim() },
      });
      onAction({ ...submission, ...data.rejectVaultSubmission });
      setRejectMode(false);
    } catch (err) {
      setActionError(err.message || "Rejection failed.");
    }
  };

  const handleFeature = async () => {
    setActionError("");
    try {
      const { data } = await featureSubmission({
        variables: { id: submission.id, featured: !submission.isFeatured },
      });
      onAction({ ...submission, ...data.featureVaultSubmission });
    } catch (err) {
      setActionError(err.message || "Feature toggle failed.");
    }
  };

  const handlePublish = async () => {
    setActionError("");
    try {
      const { data } = await publishSubmission({
        variables: { id: submission.id },
      });
      onAction({ ...submission, ...data.publishVaultSubmission });
    } catch (err) {
      setActionError(err.message || "Publish failed.");
    }
  };

  const modalBg = colors.isDark ? "#0d0d0d" : "#fff";
  const borderColor = colors.isDark
    ? "rgba(255,255,255,0.1)"
    : "rgba(0,0,0,0.1)";

  const memberName = submission.member
    ? `${submission.member.firstName || ""} ${submission.member.lastName || ""}`.trim() ||
      submission.member.businessName ||
      "Unknown Member"
    : "Unknown Member";

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95vw", sm: "680px" },
          maxHeight: "90vh",
          overflowY: "auto",
          backgroundColor: modalBg,
          border: `1px solid ${borderColor}`,
          borderRadius: "20px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
          p: { xs: 2.5, sm: 4 },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "1.1rem",
                color: colors.textPrimary,
                mb: 0.5,
              }}
            >
              {submission.title}
            </Typography>
            <Typography
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "12px",
                color: colors.textSecondary,
              }}
            >
              By {memberName}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{ color: colors.textSecondary, mt: -0.5 }}
          >
            <CloseOutlined />
          </IconButton>
        </Box>

        {/* Status + badges */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
          <Chip
            label={statusCfg.label}
            size="small"
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "11px",
              color: statusCfg.color,
              border: `1px solid ${statusCfg.color}`,
              backgroundColor: "transparent",
            }}
          />
          {submission.category && (
            <Chip
              label={submission.category}
              size="small"
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "11px",
                color: colors.warning,
                border: `1px solid ${colors.warning}`,
                backgroundColor: "transparent",
              }}
            />
          )}
          {submission.isFeatured && (
            <Chip
              label="Featured"
              size="small"
              icon={<StarOutlined sx={{ fontSize: 12, color: "#000 !important" }} />}
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "11px",
                backgroundColor: colors.warning,
                color: "#000",
              }}
            />
          )}
          {submission.consentAccepted && (
            <Chip
              label="Consent Given"
              size="small"
              icon={<VerifiedOutlined sx={{ fontSize: 12, color: "#2ECC71 !important" }} />}
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "11px",
                color: "#2ECC71",
                border: "1px solid #2ECC71",
                backgroundColor: "transparent",
              }}
            />
          )}
        </Box>

        {/* Media */}
        {submission.mediaUrls?.length > 0 && (
          <Box sx={{ mb: 3 }}>
            {submission.category === "Video" || submission.mediaUrls[0]?.includes("blob:") ? (
              <Box
                component="video"
                src={submission.mediaUrls[0]}
                controls
                sx={{
                  width: "100%",
                  maxHeight: "300px",
                  borderRadius: "12px",
                  display: "block",
                }}
              />
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: submission.mediaUrls.length === 1 ? "1fr" : "1fr 1fr",
                  gap: 1,
                }}
              >
                {submission.mediaUrls.map((url, i) => (
                  <Box
                    key={i}
                    component="img"
                    src={url}
                    alt={`Media ${i + 1}`}
                    sx={{
                      width: "100%",
                      height: submission.mediaUrls.length === 1 ? "280px" : "160px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* Description */}
        {submission.description && (
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                color: colors.textSecondary,
                mb: 0.5,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Description
            </Typography>
            <Typography
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "14px",
                color: colors.textPrimary,
                lineHeight: 1.6,
              }}
            >
              {submission.description}
            </Typography>
          </Box>
        )}

        {/* Platforms */}
        {submission.platforms?.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                color: colors.textSecondary,
                mb: 1,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Platforms
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {submission.platforms.map((p) => (
                <Chip
                  key={p}
                  label={p}
                  size="small"
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "11px",
                    backgroundColor: colors.isDark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.06)",
                    color: colors.textPrimary,
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        <Divider sx={{ borderColor, mb: 3 }} />

        {/* Admin notes (editable) */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              color: colors.textSecondary,
              mb: 1,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Admin Notes
          </Typography>
          <TextField
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes for this submission..."
            multiline
            rows={3}
            fullWidth
            disabled={isLoading}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontFamily: "Montserrat, sans-serif",
                fontSize: "13px",
                color: colors.textPrimary,
                "& fieldset": { borderColor },
                "&:hover fieldset": { borderColor: colors.warning },
                "&.Mui-focused fieldset": { borderColor: colors.warning },
              },
            }}
            inputProps={{ style: { fontFamily: "Montserrat, sans-serif" } }}
          />
        </Box>

        {/* Error */}
        {actionError && (
          <Alert
            severity="error"
            sx={{ mb: 2, fontFamily: "Montserrat, sans-serif", fontSize: "13px" }}
          >
            {actionError}
          </Alert>
        )}

        {/* Inline reject confirmation */}
        {rejectMode && (
          <Alert
            severity="warning"
            sx={{ mb: 2, fontFamily: "Montserrat, sans-serif", fontSize: "13px" }}
          >
            Notes above are required for rejection. Fill in the Admin Notes field
            then click Confirm Reject.
          </Alert>
        )}

        {/* Action buttons */}
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          {/* Approve */}
          {!rejectMode && (
            <Button
              variant="contained"
              startIcon={
                approving ? (
                  <CircularProgress size={14} sx={{ color: "#000" }} />
                ) : (
                  <CheckCircleOutlined />
                )
              }
              onClick={approveMode ? handleApprove : () => setApproveMode(true)}
              disabled={isLoading || submission.status === "approved"}
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "13px",
                textTransform: "none",
                backgroundColor: "#2ECC71",
                color: "#000",
                borderRadius: "10px",
                "&:hover": { backgroundColor: "#27ae60" },
                "&.Mui-disabled": { opacity: 0.5 },
              }}
            >
              {approveMode ? "Confirm Approve" : "Approve"}
            </Button>
          )}

          {/* Reject */}
          {!approveMode && (
            <Button
              variant="contained"
              startIcon={
                rejecting ? (
                  <CircularProgress size={14} sx={{ color: "#fff" }} />
                ) : (
                  <CancelOutlined />
                )
              }
              onClick={rejectMode ? handleReject : () => setRejectMode(true)}
              disabled={isLoading || submission.status === "rejected"}
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "13px",
                textTransform: "none",
                backgroundColor: "#e74c3c",
                color: "#fff",
                borderRadius: "10px",
                "&:hover": { backgroundColor: "#c0392b" },
                "&.Mui-disabled": { opacity: 0.5 },
              }}
            >
              {rejectMode ? "Confirm Reject" : "Reject"}
            </Button>
          )}

          {/* Feature toggle */}
          <Button
            variant="outlined"
            startIcon={
              featuring ? (
                <CircularProgress size={14} />
              ) : submission.isFeatured ? (
                <StarOutlined />
              ) : (
                <StarBorderOutlined />
              )
            }
            onClick={handleFeature}
            disabled={isLoading}
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              fontSize: "13px",
              textTransform: "none",
              borderColor: colors.warning,
              color: colors.warning,
              borderRadius: "10px",
              "&:hover": { backgroundColor: "rgba(255,195,28,0.08)" },
            }}
          >
            {submission.isFeatured ? "Unfeature" : "Feature"}
          </Button>

          {/* Publish */}
          <Button
            variant="outlined"
            startIcon={
              publishing ? (
                <CircularProgress size={14} />
              ) : (
                <PublishOutlined />
              )
            }
            onClick={handlePublish}
            disabled={
              isLoading ||
              submission.status === "published" ||
              !submission.isApproved
            }
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              fontSize: "13px",
              textTransform: "none",
              borderColor: "#9B59B6",
              color: "#9B59B6",
              borderRadius: "10px",
              "&:hover": { backgroundColor: "rgba(155,89,182,0.08)" },
              "&.Mui-disabled": { opacity: 0.4 },
            }}
          >
            Publish
          </Button>

          {/* Cancel inline mode */}
          {(approveMode || rejectMode) && (
            <Button
              variant="text"
              onClick={() => {
                setApproveMode(false);
                setRejectMode(false);
                setActionError("");
              }}
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "13px",
                textTransform: "none",
                color: colors.textSecondary,
              }}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default VaultDetailModal;
