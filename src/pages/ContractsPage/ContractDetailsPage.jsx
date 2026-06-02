import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
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
} from "@mui/material";
import { FiZoomIn } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_CONTRACT_BY_ID } from "../../context/graphql/getContractDetails";
import StyledButton from "../../pages/HomePage/StyledButton";
import ShippingInfoModal from "../../components/ShippingInfoModal";
import ImagePreviewDialog from "../../components/ImagePreviewDialog";

const SECTION_LABELS = {
  leftSide: "Left Side",
  rightSide: "Right Side",
  topView: "Top View",
  bottomView: "Bottom View",
  frontView: "Front View",
  backView: "Back View",
  other: "Other Areas",
};

const SHOE_FIELDS = [
  { label: "Brand", key: "brand" },
  { label: "Model", key: "model" },
  { label: "Color", key: "color" },
  { label: "Size (US)", key: "size" },
];

export const ContractDetailsPage = () => {
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [isModalOpen, setModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { loading, error, data } = useQuery(GET_CONTRACT_BY_ID, {
    variables: { id },
    fetchPolicy: "cache-and-network",
  });

  const contract = data?.contractById;

  const handleAddTracking = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const handleMessageClick = () => navigate(`/member/chat/${id}`);
  const handleSupportClick = () => {
    window.location.href = "mailto:support@thesneakersociety.com";
  };

  const renderStatusBadge = (status) => {
    let backgroundColor = "";
    switch (status) {
      case "IN_PROGRESS":
        backgroundColor = "#D4AC0D";
        break;
      case "PENDING":
        backgroundColor = "#2ECC71";
        break;
      case "COMPLETED":
        backgroundColor = "#3498DB";
        break;
      case "NOT_STARTED":
        backgroundColor = "#E67E22";
        break;
      default:
        backgroundColor = "#E0E0E0";
    }

    return (
      <Box
        sx={{
          backgroundColor,
          borderRadius: 1,
          px: 2,
          py: 0.5,
          display: "inline-block",
          color: "black",
          fontWeight: "bold",
        }}
      >
        {status}
      </Box>
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, color: "white", height: "100%", width: "100%" }}>
        <Typography variant="h6" color="error">
          Error loading contract details: {error.message}
        </Typography>
      </Box>
    );
  }

  if (!contract) {
    return (
      <Box sx={{ p: 3, color: "white", height: "100%", width: "100%" }}>
        <Typography variant="h6">
          No contract details found for ID: {id}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: isMobile ? 2 : 4, height: "100%", width: "100%" }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" fontWeight={700}>
          {`${contract.client?.firstName || ""} ${contract.client?.lastName || ""}`}
        </Typography>
        <Box mt={1}>{renderStatusBadge(contract.status)}</Box>
      </Box>

      {contract.proposedPrice !== null && (
        <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" fontWeight={600} mb={2}>
            Proposed Price
          </Typography>
          <Typography variant="h4" fontWeight={600}>
            ${parseFloat(contract.proposedPrice).toFixed(2)}
          </Typography>
        </Paper>
      )}

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Grid2 container spacing={isMobile ? 3 : 6}>
          <Grid2 xs={12} md={6}>
            <Typography variant="h4" fontWeight={600} mb={2}>
              Client
            </Typography>
            <Typography variant="body1" fontWeight={700} color="text.secondary">
              Name
            </Typography>
            <Typography variant="h6" fontWeight={600} mb={1.5}>
              {`${contract.client?.firstName || ""} ${contract.client?.lastName || ""}`}
            </Typography>
            <Typography variant="body1" fontWeight={700} color="text.secondary">
              Email
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {contract.client?.email || "N/A"}
            </Typography>
          </Grid2>
          <Grid2 xs={12} md={6}>
            <Typography variant="h4" fontWeight={600} mb={2}>
              Shipping
            </Typography>
            {contract.trackingNumber ? (
              <>
                <Typography variant="body1" fontWeight={700} color="text.secondary">
                  Tracking
                </Typography>
                <Typography variant="h6" fontWeight={600} mb={1.5}>
                  {contract.trackingNumber.trackingNumber}
                </Typography>
                <Typography variant="body1" fontWeight={700} color="text.secondary">
                  Carrier
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {contract.trackingNumber.carrier || contract.shippingCarrier}
                </Typography>
              </>
            ) : (
              <Button
                variant="outlined"
                onClick={handleAddTracking}
                sx={{
                  color: "white",
                  borderColor: "white",
                  borderRadius: "4px",
                  textTransform: "none",
                  fontSize: "1rem",
                  px: 3,
                  py: 1,
                  "&:hover": {
                    borderColor: "grey.400",
                  },
                }}
              >
                Add Tracking
              </Button>
            )}
          </Grid2>
        </Grid2>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" fontWeight={600} mb={2}>
          Shoe Details
        </Typography>
        <Grid2 container spacing={2}>
          {SHOE_FIELDS.map(({ label, key }) => (
            <Grid2 xs={6} sm={4} key={key}>
              <Typography variant="body1" fontWeight={700} color="text.secondary">
                {label}
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {contract.shoeDetails?.[key] || "\u2014"}
              </Typography>
            </Grid2>
          ))}
        </Grid2>
      </Paper>

      {contract.shoeDetails?.photos &&
        Object.entries(contract.shoeDetails.photos).some(([, photos]) => photos?.length > 0) && (
          <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" fontWeight={600} mb={2}>
              Photos
            </Typography>
            <Grid2 container spacing={2}>
              {Object.entries(contract.shoeDetails.photos).map(
                ([section, photos]) =>
                  photos?.length > 0 && (
                    <Grid2 xs={12} sm={6} md={4} key={section}>
                      <Typography
                        variant="body1"
                        fontWeight={600}
                        color="text.secondary"
                        mb={1}
                      >
                        {SECTION_LABELS[section] || section.replace(/([A-Z])/g, " $1").trim()}
                      </Typography>
                      {photos.map((photo, idx) => (
                        <Card
                          key={idx}
                          sx={{
                            mb: 1.5,
                            position: "relative",
                            "&:last-child": { mb: 0 },
                          }}
                        >
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
                            sx={{
                              position: "absolute",
                              top: 4,
                              left: 4,
                              bgcolor: "rgba(0,0,0,0.45)",
                              color: "common.white",
                              "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                            }}
                          >
                            <FiZoomIn size={14} />
                          </IconButton>
                          {photo.note && (
                            <CardContent sx={{ py: 1, px: 1.5, "&:last-child": { pb: 1 } }}>
                              <Typography variant="body2" color="text.secondary">
                                {photo.note}
                              </Typography>
                            </CardContent>
                          )}
                          {photos.length > 1 && (
                            <Chip
                              label={`${idx + 1} of ${photos.length}`}
                              size="small"
                              sx={{
                                position: "absolute",
                                bottom: 6,
                                right: 6,
                                bgcolor: "rgba(0,0,0,0.55)",
                                color: "common.white",
                              }}
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

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" fontWeight={600} mb={1}>
          Client Notes
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {contract.repairDetails?.clientNotes || "No client notes provided"}
        </Typography>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" fontWeight={600} mb={1}>
          Member Notes
        </Typography>
        {contract.repairDetails?.memberNotes ? (
          <Typography variant="body1" color="text.secondary">
            {contract.repairDetails.memberNotes}
          </Typography>
        ) : (
          <Button
            variant="outlined"
            onClick={() => console.log("Add member note")}
            sx={{
              color: "white",
              borderColor: "white",
              borderRadius: "4px",
              textTransform: "none",
              fontSize: "1rem",
              px: 3,
              py: 1,
              "&:hover": {
                borderColor: "grey.400",
              },
            }}
          >
            Add Notes
          </Button>
        )}
      </Paper>

      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <StyledButton onClick={handleMessageClick}>Message</StyledButton>
        <StyledButton onClick={handleSupportClick}>Support</StyledButton>
      </Box>

      <ShippingInfoModal
        open={isModalOpen}
        onClose={handleModalClose}
        contractId={id}
      />

      <ImagePreviewDialog
        open={!!previewUrl}
        url={previewUrl}
        onClose={() => setPreviewUrl(null)}
      />
    </Box>
  );
};

export default ContractDetailsPage;
