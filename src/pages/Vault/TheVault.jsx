import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  Skeleton,
  Alert,
  Divider,
} from "@mui/material";
import { Inventory2Outlined, AddOutlined } from "@mui/icons-material";
import { useQuery } from "@apollo/client";
import { useColors } from "../../theme/colors";
import { useSneakerMember } from "../../context/MemberContext";
import { GET_VAULT_SUBMISSIONS } from "../../context/graphql/getVault";
import VaultSubmissionForm from "./VaultSubmissionForm";
import VaultSubmissionCard from "./VaultSubmissionCard";
import VaultAdminQueue from "./VaultAdminQueue";

// Inline empty state — no submissions yet
const VaultEmptyState = ({ onSubmit }) => {
  const colors = useColors();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 8, sm: 10 },
        px: 2,
        textAlign: "center",
      }}
    >
      <Inventory2Outlined
        sx={{
          fontSize: { xs: 64, sm: 80 },
          color: colors.warning,
          opacity: 0.5,
          mb: 3,
        }}
      />
      <Typography
        sx={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          fontSize: { xs: "1.4rem", sm: "1.75rem" },
          color: colors.textPrimary,
          mb: 1.5,
        }}
      >
        Your Vault is empty
      </Typography>
      <Typography
        sx={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: { xs: "14px", sm: "15px" },
          color: colors.textSecondary,
          maxWidth: 480,
          lineHeight: 1.7,
          mb: 4,
        }}
      >
        Submit your best work — custom builds, merchandise drops, or content —
        and we'll feature it across our platforms to grow your brand.
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddOutlined />}
        onClick={onSubmit}
        sx={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          fontSize: "15px",
          textTransform: "none",
          backgroundColor: colors.warning,
          color: "#000",
          borderRadius: "12px",
          px: 4,
          py: 1.5,
          boxShadow: "0 4px 20px rgba(255,195,28,0.3)",
          "&:hover": {
            backgroundColor: "#e6b000",
            boxShadow: "0 6px 24px rgba(255,195,28,0.4)",
          },
        }}
      >
        Make Your First Submission
      </Button>
    </Box>
  );
};

const TheVault = () => {
  const colors = useColors();
  const { member } = useSneakerMember();
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const { data, loading, error, refetch } = useQuery(GET_VAULT_SUBMISSIONS, {
    fetchPolicy: "cache-and-network",
  });

  const submissions = data?.vaultSubmissions || [];
  const hasSubmissions = submissions.length > 0;

  const handleOpenForm = () => {
    setEditTarget(null);
    setFormOpen(true);
  };

  const handleEdit = (submission) => {
    setEditTarget(submission);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditTarget(null);
  };

  const handleSubmitted = () => {
    handleFormClose();
    refetch();
  };

  const modalBg = colors.isDark ? "#0d0d0d" : "#fff";
  const borderColor = colors.isDark
    ? "rgba(255,255,255,0.1)"
    : "rgba(0,0,0,0.1)";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: colors.isDark ? "#000" : "#fff",
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 4, sm: 6 },
        boxSizing: "border-box",
      }}
    >
      {/* Page header */}
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: { xs: "2rem", sm: "2.5rem" },
              color: colors.warning,
              lineHeight: 1.1,
            }}
          >
            The Vault
          </Typography>
          <Typography
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: { xs: "13px", sm: "14px" },
              color: colors.textSecondary,
              mt: 0.5,
              maxWidth: 520,
            }}
          >
            Upload your custom builds, merchandise, and content for potential
            marketing exposure across The Sneaker Society platforms.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={handleOpenForm}
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: "14px",
            textTransform: "none",
            backgroundColor: colors.warning,
            color: "#000",
            borderRadius: "12px",
            px: 3,
            py: 1.25,
            flexShrink: 0,
            boxShadow: "0 4px 16px rgba(255,195,28,0.25)",
            "&:hover": {
              backgroundColor: "#e6b000",
              boxShadow: "0 6px 20px rgba(255,195,28,0.35)",
            },
          }}
        >
          Submit Your Work
        </Button>
      </Box>

      <Divider sx={{ borderColor, mb: 4 }} />

      {/* Error state */}
      {error && (
        <Alert
          severity="error"
          action={
            <Button
              onClick={() => refetch()}
              size="small"
              sx={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Retry
            </Button>
          }
          sx={{
            mb: 3,
            fontFamily: "Montserrat, sans-serif",
            fontSize: "14px",
            borderRadius: "10px",
          }}
        >
          Failed to load your submissions. {error.message}
        </Alert>
      )}

      {/* Loading state */}
      {loading && !data && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
            },
            gap: 2.5,
            mb: 6,
          }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <Box
              key={i}
              sx={{
                border: `1px solid ${borderColor}`,
                borderRadius: "16px",
                overflow: "hidden",
              }}
            >
              <Skeleton
                variant="rectangular"
                height={160}
                sx={{
                  backgroundColor: colors.isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.06)",
                }}
              />
              <Box sx={{ p: 2 }}>
                <Skeleton
                  variant="text"
                  width="70%"
                  sx={{
                    backgroundColor: colors.isDark
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.06)",
                  }}
                />
                <Skeleton
                  variant="text"
                  width="40%"
                  sx={{
                    backgroundColor: colors.isDark
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(0,0,0,0.04)",
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Member submissions section */}
      {!loading && !error && (
        <>
          {hasSubmissions ? (
            <>
              <Typography
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: colors.textSecondary,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  mb: 2.5,
                }}
              >
                Your Submissions ({submissions.length})
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "1fr 1fr 1fr",
                  },
                  gap: 2.5,
                  mb: 6,
                }}
              >
                {submissions.map((submission) => (
                  <VaultSubmissionCard
                    key={submission.id}
                    submission={submission}
                    onEdit={handleEdit}
                    onDelete={() => refetch()}
                  />
                ))}
              </Box>
            </>
          ) : (
            <VaultEmptyState onSubmit={handleOpenForm} />
          )}
        </>
      )}

      {/* Admin queue */}
      <Divider sx={{ borderColor, mb: 4 }} />
      <VaultAdminQueue />

      {/* Submission form modal */}
      <Modal open={formOpen} onClose={handleFormClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95vw", sm: "600px" },
            maxHeight: "92vh",
            overflowY: "auto",
            backgroundColor: modalBg,
            border: `1px solid ${borderColor}`,
            borderRadius: "20px",
            boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
            p: { xs: 2.5, sm: 4 },
          }}
        >
          <VaultSubmissionForm
            onSubmitted={handleSubmitted}
            onCancel={handleFormClose}
            initialData={editTarget}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default TheVault;
