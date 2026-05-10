import React from "react";
import { Box, Icon, Typography, Skeleton } from "@mui/material";
import ImageDownloadButton from "../pages/Dashboard/ImageDownloadButton";
import QrActionButton from "./QrActionButton";
import { useQuery, gql } from "@apollo/client";
import { FaLink } from "react-icons/fa6";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useNavigate } from "react-router-dom"
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
  const navigate = useNavigate();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          height: "100%",
          width: "100%",
          borderRadius: 2,
          border: `4px solid ${colors.border}`,
          bgcolor: colors.widgetBg,
          color: colors.textPrimary,
          padding: "20px",
        }}
      >
        <Skeleton variant="rectangular" width="50%" height={200} />
        <Box
          sx={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Skeleton variant="text" width={100} height={30} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width={150} height={40} />
        </Box>
      </Box>
    );
  }
  if (error) return <p>Error: {error.message}</p>;

  if (data.currentMember.contractsDisabled) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
          borderRadius: 2,
          border: `4px solid ${colors.border}`,
          padding: "20px",
          bgcolor: colors.widgetBg,
          color: colors.textPrimary,
        }}
      >
        <WarningAmberIcon
          sx={{
            fontSize: 60,
            color: colors.textPrimary,
            mb: 2
          }}
        />
        <Typography
          variant="h5"
          sx={{
            color: colors.textPrimary,
            fontWeight: "bold",
            textAlign: "center"
          }}
        >
          New Contracts Disabled
        </Typography>
      </Box>
    );
  }
  
  const { image, url } = data.currentMember.qrWidgetData;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: { xs: "center", sm: "space-between" },
        alignItems: "center",
        width: "100%",
        height: "100%",
        borderRadius: 2,
        border: `4px solid ${colors.border}`,
        padding: "20px",
        gap: 4,
        bgcolor: colors.widgetBg,
        color: colors.textPrimary,
      }}
    >
      <Box
        sx={{
          flex: "0 0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={image}
          alt="QR Code"
          style={{
            width: "200px",
            height: "200px",
          }}
        />
      </Box>

      <Box
        sx={{
          flex: { sm: 1 },
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: { xs: "center", sm: "flex-start" },
          paddingLeft: { xs: "0px", sm: "20px" },
          width: { xs: "100%", sm: "auto" },
        }}
      >
        <Box sx={{ mb: 3, textAlign: { xs: "center", sm: "left" } }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: colors.textPrimary,
              marginBottom: "8px",
            }}
          >
            Custom Intake Link
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: colors.textSecondary,
            }}
          >
            Share your custom link to start getting intakes!
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", sm: "flex-start" },
            width: "100%",
            maxWidth: "200px",
          }}
        >
          <QrActionButton
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<Icon sx={{ display: "flex", alignItems: "center" }}><FaLink /></Icon>}
          >
            Link
          </QrActionButton>
          <ImageDownloadButton imageSrc={image} />
          <QrActionButton onClick={() => navigate("/member/preview-contract")}>
            Preview
          </QrActionButton>
        </Box>
      </Box>
    </Box>
  );
}; 
