import React, { useState } from "react";
import { Box, Icon, Typography, Skeleton, Snackbar, Alert } from "@mui/material";
import ImageDownloadButton from "../pages/Dashboard/ImageDownloadButton";
import QrActionButton from "./QrActionButton";
import { useQuery, gql } from "@apollo/client";
import { FaLink } from "react-icons/fa6";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useColors } from "../theme/colors";

const GET_MEMBER_QR_WIDGET_DATA = gql`
  query GetMemberQrWidgetData {
    currentMember {
      qrWidgetData {
        image
        url
      }
      contractsDisabled
    }
  }
`;

export const QrWidget = () => {
  const { loading, error, data } = useQuery(GET_MEMBER_QR_WIDGET_DATA);
  const colors = useColors();
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const handleCopyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setSnackbar({ open: true, message: "Copied to clipboard" });
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setSnackbar({ open: true, message: "Copied to clipboard" });
    }
  };

  const containerSx = {
    width: "100%",
    borderRadius: 3,
    border: `1px solid ${colors.borderSubtle}`,
    bgcolor: colors.widgetBg,
    color: colors.textPrimary,
    p: 3,
  };

  if (loading) {
    return (
      <Box sx={{ ...containerSx, display: "flex", flexDirection: "row", justifyContent: "space-between", gap: 3 }}>
        <Skeleton variant="rectangular" width={160} height={160} sx={{ borderRadius: 2, flexShrink: 0 }} />
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 1 }}>
          <Skeleton variant="text" sx={{ fontSize: "1.5rem", width: "60%" }} />
          <Skeleton variant="text" sx={{ fontSize: "0.875rem", width: "80%", mb: 1 }} />
          <Box sx={{ display: "flex", gap: 1 }}>
            <Skeleton variant="rectangular" height={32} sx={{ flex: 1, borderRadius: 1 }} />
            <Skeleton variant="rectangular" height={32} sx={{ flex: 1, borderRadius: 1 }} />
            <Skeleton variant="rectangular" height={32} sx={{ flex: 1, borderRadius: 1 }} />
          </Box>
        </Box>
      </Box>
    );
  }

  if (error) return <p>Error: {error.message}</p>;

  if (data.currentMember.contractsDisabled) {
    return (
      <Box sx={{ ...containerSx, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <WarningAmberIcon sx={{ fontSize: 48, color: colors.textPrimary, mb: 1.5 }} />
        <Typography variant="h5" sx={{ color: colors.textPrimary, fontWeight: 600, textAlign: "center" }}>
          New Contracts Disabled
        </Typography>
      </Box>
    );
  }

  const { image, url } = data.currentMember.qrWidgetData;

  return (
    <Box sx={{ ...containerSx, display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center", gap: 3 }}>
      <Box sx={{ flexShrink: 0 }}>
        <img src={image} alt="QR Code" style={{ width: "160px", height: "160px", display: "block", borderRadius: 8 }} />
      </Box>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 0.5 }}>
          Custom Intake Link
        </Typography>
        <Typography sx={{ fontSize: "0.875rem", color: colors.textSecondary, mb: 2 }}>
          Share your custom link to start getting intakes!
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
          <QrActionButton
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              handleCopyLink(url);
            }}
            startIcon={<Icon sx={{ display: "flex", alignItems: "center", fontSize: "1rem !important" }}><FaLink /></Icon>}
          >
            Link
          </QrActionButton>
          <ImageDownloadButton imageSrc={image} />
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ open: false, message: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar({ open: false, message: "" })} severity="success" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
