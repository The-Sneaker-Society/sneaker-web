import React, { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  EditOutlined,
  DeleteOutlined,
  ImageOutlined,
} from "@mui/icons-material";
import { useMutation } from "@apollo/client";
import { useColors } from "../../theme/colors";
import {
  DELETE_VAULT_SUBMISSION,
  GET_VAULT_SUBMISSIONS,
} from "../../context/graphql/getVault";

const STATUS_CONFIG = {
  draft: { label: "Draft", color: "#888", bg: "rgba(136,136,136,0.15)" },
  pending: { label: "Pending", color: "#D4AC0D", bg: "rgba(212,172,13,0.15)" },
  underReview: { label: "Under Review", color: "#3498DB", bg: "rgba(52,152,219,0.15)" },
  under_review: { label: "Under Review", color: "#3498DB", bg: "rgba(52,152,219,0.15)" },
  approved: { label: "Approved", color: "#2ECC71", bg: "rgba(46,204,113,0.15)" },
  rejected: { label: "Rejected", color: "#e74c3c", bg: "rgba(231,76,60,0.15)" },
  published: { label: "Published", color: "#9B59B6", bg: "rgba(155,89,182,0.15)" },
};

const formatRelative = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 30) return `${diffD}d ago`;
  return date.toLocaleDateString();
};

const VaultSubmissionCard = ({ submission, onEdit, onDelete }) => {
  const colors = useColors();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [deleteSubmission, { loading: deleting }] = useMutation(
    DELETE_VAULT_SUBMISSION,
    {
      update(cache) {
        cache.modify({
          fields: {
            vaultSubmissions(existing = [], { readField }) {
              return existing.filter(
                (ref) => readField("id", ref) !== submission.id
              );
            },
          },
        });
      },
      refetchQueries: [{ query: GET_VAULT_SUBMISSIONS }],
    }
  );

  const statusCfg =
    STATUS_CONFIG[submission.status] || STATUS_CONFIG.draft;

  const canEditOrDelete =
    submission.status === "draft" || submission.status === "pending";

  const thumbnailUrl =
    submission.thumbnailUrl ||
    (submission.mediaUrls?.length ? submission.mediaUrls[0] : null);

  const handleDelete = async () => {
    try {
      await deleteSubmission({ variables: { id: submission.id } });
      setConfirmOpen(false);
      if (onDelete) onDelete(submission.id);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const cardBg = colors.isDark ? "#0d0d0d" : "#f8f8f8";
  const borderColor = colors.isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(0,0,0,0.08)";

  return (
    <>
      <Box
        sx={{
          backgroundColor: cardBg,
          border: `1px solid ${borderColor}`,
          borderRadius: "16px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Thumbnail */}
        <Box
          sx={{
            width: "100%",
            height: "160px",
            backgroundColor: colors.isDark
              ? "rgba(255,255,255,0.04)"
              : "rgba(0,0,0,0.04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {thumbnailUrl ? (
            <Box
              component="img"
              src={thumbnailUrl}
              alt={submission.title}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <ImageOutlined
              sx={{
                fontSize: 48,
                color: colors.isDark
                  ? "rgba(255,255,255,0.15)"
                  : "rgba(0,0,0,0.12)",
              }}
            />
          )}

          {/* Status chip overlay */}
          <Box sx={{ position: "absolute", top: 8, right: 8 }}>
            <Chip
              label={statusCfg.label}
              size="small"
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "11px",
                backgroundColor: statusCfg.bg,
                color: statusCfg.color,
                border: `1px solid ${statusCfg.color}`,
                backdropFilter: "blur(4px)",
              }}
            />
          </Box>

          {/* Featured badge */}
          {submission.isFeatured && (
            <Box sx={{ position: "absolute", top: 8, left: 8 }}>
              <Chip
                label="Featured"
                size="small"
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: "11px",
                  backgroundColor: colors.warning,
                  color: "#000",
                }}
              />
            </Box>
          )}
        </Box>

        {/* Content */}
        <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "14px",
              color: colors.textPrimary,
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {submission.title}
          </Typography>

          {submission.category && (
            <Chip
              label={submission.category}
              size="small"
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                backgroundColor: colors.isDark
                  ? "rgba(255,195,28,0.12)"
                  : "rgba(255,195,28,0.15)",
                color: colors.warning,
                alignSelf: "flex-start",
                height: "22px",
              }}
            />
          )}

          <Typography
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "11px",
              color: colors.textSecondary,
            }}
          >
            {formatRelative(submission.createdAt)}
          </Typography>

          {/* Admin rejection notes */}
          {submission.status === "rejected" && submission.adminNotes && (
            <Alert
              severity="error"
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "12px",
                borderRadius: "8px",
                py: 0.5,
                mt: 0.5,
              }}
            >
              {submission.adminNotes}
            </Alert>
          )}

          {/* Actions */}
          {canEditOrDelete && (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                mt: "auto",
                pt: 1,
                borderTop: `1px solid ${borderColor}`,
              }}
            >
              <IconButton
                size="small"
                onClick={() => onEdit && onEdit(submission)}
                sx={{
                  color: colors.textSecondary,
                  "&:hover": { color: colors.warning },
                }}
              >
                <EditOutlined sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setConfirmOpen(true)}
                disabled={deleting}
                sx={{
                  color: colors.textSecondary,
                  "&:hover": { color: "#e74c3c" },
                }}
              >
                <DeleteOutlined sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          )}
        </Box>
      </Box>

      {/* Delete confirmation dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: colors.isDark ? "#111" : "#fff",
            borderRadius: "16px",
            border: `1px solid ${borderColor}`,
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
          Delete Submission
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "14px",
              color: colors.textSecondary,
            }}
          >
            Are you sure you want to delete "{submission.title}"? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            sx={{
              fontFamily: "Montserrat, sans-serif",
              textTransform: "none",
              color: colors.textSecondary,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deleting}
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
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VaultSubmissionCard;
