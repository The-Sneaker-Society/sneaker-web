import React, { useState, useEffect } from "react";
import { Box, Typography, Button, CircularProgress, Alert, Paper, Chip, Divider, Grid2, Card, CardMedia, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { FiMessageCircle, FiShield, FiZoomIn, FiPrinter, FiChevronDown, FiPackage, FiMail } from "react-icons/fi";
import Timeline from "../../components/Timeline";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_CONTRACT_BY_ORDER_REF } from "../../context/graphql/getContractDetails";
import { useColors } from "../../theme/colors";
import { STATUS_UI_CONFIG } from "../../utils/statusConfig";
import ImagePreviewDialog from "../../components/ImagePreviewDialog";

const money = (n) =>
  `$${(Number(n) || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/**
 * User-facing contract review: status + journey, what you paid, where your
 * shoes are. Member actions (propose price, start work, release payout)
 * never render here — see ContractReviewSummary for the member view.
 */
const UserContractPage = () => {
  const { orderRef } = useParams();
  const navigate = useNavigate();
  const colors = useColors();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [previewUrl, setPreviewUrl] = useState(null);
  // Labels are bought asynchronously after the Stripe webhook lands, so a
  // fresh payment briefly has no labelUrl. Poll until it appears, then
  // stop. Unpaid contracts never poll.
  const { data, loading, error, startPolling, stopPolling } = useQuery(GET_CONTRACT_BY_ORDER_REF, {
    variables: { orderRef },
    skip: !orderRef,
    fetchPolicy: "network-only",
  });

  const contractPreview = data?.contractById;
  const needsLabelPoll =
    !!contractPreview &&
    (contractPreview.paymentStatus === "paid" ||
      !["PENDING_REVIEW", "PRICE_PROPOSED", "AWAITING_PAYMENT", "CANCELED"].includes(
        contractPreview.status
      )) &&
    !contractPreview.inboundLabelUrl;

  useEffect(() => {
    if (needsLabelPoll) {
      startPolling(5000);
    } else {
      stopPolling();
    }
  }, [needsLabelPoll, startPolling, stopPolling]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress sx={{ color: "#FFD100" }} />
      </Box>
    );
  }

  const titleCase = (str) => {
    if (!str) return str;
    return str.replace(/\b\w/g, (c) => c.toUpperCase());
  };

  if (error || !data?.contractById) {
    return (
      <Box sx={{ p: 4, maxWidth: 720, mx: "auto" }}>
        <Alert severity="error">
          Contract not found.{" "}
          <Button size="small" onClick={() => navigate("/user/dashboard")}>
            Back to dashboard
          </Button>
        </Alert>
      </Box>
    );
  }

  const contract = data.contractById;
  const shoeLabel = [contract.shoeDetails?.brand, contract.shoeDetails?.model]
    .filter(Boolean)
    .join(" ");
  const memberName = [contract.member?.firstName, contract.member?.lastName]
    .filter(Boolean)
    .join(" ");
  const statusCfg = STATUS_UI_CONFIG[contract.status] ?? { label: contract.status, color: colors.textSecondary };
  const servicePrice = contract.price ?? contract.proposedPrice ?? 0;
  const total = servicePrice + (contract.shippingFee || 0) + (contract.insuranceFee || 0);
  const canReview =
    contract.status === "PRICE_PROPOSED" || contract.status === "AWAITING_PAYMENT";

  const tracking = [
    { leg: "Inbound label", ...contract.inboundTracking },
    { leg: "Outbound label", ...contract.outboundTracking },
  ];

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
            bgcolor: statusCfg.color,
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.9rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            mb: 2,
          }}
        >
          {statusCfg.label}
        </Box>
        <Typography variant="h4" fontWeight={700}>
          {titleCase(`${contract.shoeDetails?.brand || ""} ${contract.shoeDetails?.model || ""}`)}
        </Typography>
        <Typography variant="body1" color="text.secondary" mt={0.5}>
          Submitted {new Date(Number(contract.createdAt) || contract.createdAt).toLocaleDateString()}
          {contract.orderRef && ` · Order ${contract.orderRef}`}
        </Typography>
      </Paper>

      {canReview && (
        <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, mb: 3, display: "flex", flexDirection: "column", alignItems: "center", bgcolor: "#FFD10011", borderColor: "#FFD100", borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1, textAlign: "center" }}>
            Your request has been reviewed!
          </Typography>
          <Typography variant="h3" fontWeight={800} sx={{ mb: 3 }}>
            {money(servicePrice)}
          </Typography>
          <Button
            variant="contained"
            startIcon={<FiShield size={18} />}
            onClick={() => navigate(`/user/review-protect/${contract.orderRef}`)}
            size="large"
            sx={{ bgcolor: "#FFD100", color: "#000", fontWeight: 800, textTransform: "none", fontSize: "1.1rem", px: 4, py: 1.5, "&:hover": { bgcolor: "#E6BC00" }, borderRadius: 2, width: { xs: "100%", sm: "auto" } }}
          >
            Review & Pay
          </Button>
        </Paper>
      )}

      {!canReview && !["PROPOSED", "REVIEW_PENDING", "CANCELED"].includes(contract.status) && (
        <Accordion variant="outlined" defaultExpanded sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<FiChevronDown />}>
            <Typography variant="h6" fontWeight={600}>
              Payment Summary
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ p: 2, bgcolor: "rgba(128, 128, 128, 0.04)", borderRadius: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2" color="text.secondary">{contract.selectedServiceMenuItem?.name || "Restoration Services"}</Typography>
                <Typography variant="body2" fontWeight={600}>{money(servicePrice)}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Shipping (Round Trip)</Typography>
                <Typography variant="body2" fontWeight={600}>{money(contract.shippingFee || 0)}</Typography>
              </Box>
              {contract.insuranceFee > 0 ? (
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Shipping Insurance</Typography>
                  <Typography variant="body2" fontWeight={600}>{money(contract.insuranceFee)}</Typography>
                </Box>
              ) : !contract.insuranceDeclined && (
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Package Protection</Typography>
                  <Typography variant="body2" fontWeight={600} color="success.main">Included (On Us)</Typography>
                </Box>
              )}
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="subtitle1" fontWeight={700}>Total Paid</Typography>
                <Typography variant="subtitle1" fontWeight={800}>{money(total)}</Typography>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      <Accordion variant="outlined" defaultExpanded sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<FiChevronDown />}>
          <Typography variant="h6" fontWeight={600}>
            What you requested
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
        {contract.selectedServiceMenuItem && (
          <Box sx={{ mb: 2 }}>
            <Chip
              size="small"
              label={`${contract.selectedServiceMenuItem.name} — ${money(contract.selectedServiceMenuItem.price)}`}
              sx={{ bgcolor: "#FFD10022", color: colors.textPrimary, fontWeight: 700 }}
            />
          </Box>
        )}
        <Grid2 container spacing={2}>
          {[
            { label: "Brand", value: contract.shoeDetails?.brand },
            { label: "Model", value: contract.shoeDetails?.model },
            { label: "Color", value: contract.shoeDetails?.color },
            { label: "Size", value: contract.shoeDetails?.size },
            { label: "Material", value: contract.shoeDetails?.material },
            { label: "Sole condition", value: contract.shoeDetails?.soleCondition },
            { label: "Year", value: contract.shoeDetails?.year },
            { label: "Return timeframe", value: contract.shoeDetails?.returnTimeframe },
            { label: "Odor level", value: contract.shoeDetails?.odorLevel },
            { label: "Box included", value: contract.boxIncluded == null ? null : contract.boxIncluded ? "Yes" : "No" },
            {
              label: "Declared value",
              value: contract.declaredMarketValue != null ? money(contract.declaredMarketValue) : null,
            },
            {
              label: "Previous repairs",
              value: contract.shoeDetails?.previousRepairs ? "Yes" : null,
            },
          ].map(
            ({ label, value }) =>
              value != null &&
              value !== "" && (
                <Grid2 xs={6} sm={4} key={label}>
                  <Typography variant="body1" color="text.secondary" fontWeight={700}>
                    {label}
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {String(value)}
                  </Typography>
                </Grid2>
              )
          )}
        </Grid2>
        {contract.shoeDetails?.previousRepairsNotes && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
            Previous repairs: {contract.shoeDetails.previousRepairsNotes}
          </Typography>
        )}
        {contract.repairDetails?.clientNotes && (
          <Box sx={{ mt: 1.5 }}>
            <Typography variant="body1" color="text.secondary" fontWeight={700}>
              Your notes to the restorer
            </Typography>
            <Typography variant="body2">{contract.repairDetails.clientNotes}</Typography>
          </Box>
        )}
        </AccordionDetails>
      </Accordion>

      {contract.shoeDetails?.photos &&
        Object.entries(contract.shoeDetails.photos).some(
          ([, photos]) => Array.isArray(photos) && photos.length > 0
        ) && (
          <Accordion variant="outlined" sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<FiChevronDown />}>
              <Typography variant="h6" fontWeight={600}>
                Your intake photos
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
            <Grid2 container spacing={2}>
              {Object.entries(contract.shoeDetails.photos).map(
                ([section, photos]) =>
                  Array.isArray(photos) &&
                  photos.length > 0 && (
                    <Grid2 xs={12} sm={6} md={4} key={section}>
                      <Typography variant="body1" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: "block" }}>
                        {section.replace(/([A-Z])/g, " $1").trim()}
                      </Typography>
                      {photos.map((photo, idx) => (
                        <Card key={idx} sx={{ mb: 1.5, position: "relative" }}>
                          <CardMedia
                            component="img"
                            height="160"
                            image={photo.url}
                            alt={`${section} ${idx + 1}`}
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
                            }}
                          >
                            <FiZoomIn size={14} />
                          </IconButton>
                          {photo.note && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", px: 1.5, py: 1 }}>
                              {photo.note}
                            </Typography>
                          )}
                        </Card>
                      ))}
                    </Grid2>
                  )
              )}
            </Grid2>
            </AccordionDetails>
          </Accordion>
        )}

      {(contract.unboxingPhotos?.length > 0 || contract.completionPhotos?.length > 0) && (
        <Accordion variant="outlined" sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<FiChevronDown />}>
            <Typography variant="h6" fontWeight={600}>
              Restorer photos
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
          {[
            { label: "Unboxing", photos: contract.unboxingPhotos },
            { label: "Finished work", photos: contract.completionPhotos },
          ].map(
            ({ label, photos }) =>
              photos?.length > 0 && (
                <Box key={label} sx={{ mb: 1.5 }}>
                  <Typography variant="body1" color="text.secondary" fontWeight={600} sx={{ mb: 1 }}>
                    {label}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 0.5 }}>
                    {photos.map((url, idx) => (
                      <Card key={idx} sx={{ width: 160, position: "relative" }}>
                        <CardMedia component="img" height="120" image={url} alt={`${label} ${idx + 1}`} sx={{ objectFit: "cover" }} />
                        <IconButton
                          onClick={() => setPreviewUrl(url)}
                          size="small"
                          sx={{ position: "absolute", top: 4, left: 4, bgcolor: "rgba(0,0,0,0.45)", color: "common.white" }}
                        >
                          <FiZoomIn size={14} />
                        </IconButton>
                      </Card>
                    ))}
                  </Box>
                </Box>
              )
          )}
            </AccordionDetails>
          </Accordion>
      )}
    </Box>
  );

  const rightContent = (
    <Box>
      <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, mb: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", bgcolor: "rgba(128, 128, 128, 0.04)" }}>
        <Typography variant="caption" color="text.secondary" fontWeight={800} textTransform="uppercase" letterSpacing="0.12em" mb={2}>
          In the hands of
        </Typography>
        <Box sx={{ width: 64, height: 64, borderRadius: "50%", bgcolor: "#FFD100", display: "flex", alignItems: "center", justifyContent: "center", mb: 1.5, boxShadow: "0 4px 14px rgba(255,209,0,0.3)" }}>
          <Typography variant="h5" fontWeight={800} color="#000">
            {contract.member?.firstName?.charAt(0) || ""}{contract.member?.lastName?.charAt(0) || ""}
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight={800} mb={1.5}>
          {`${contract.member?.firstName || ""} ${contract.member?.lastName || ""}`.trim() || "Unknown"}
        </Typography>
        <Button variant="outlined" size="small" sx={{ borderRadius: 6, textTransform: "none", fontWeight: 700, px: 3, color: "text.primary", borderColor: "divider" }}>
          View Profile
        </Button>
      </Paper>
      {contract.chatId && (
        <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
            <FiMessageCircle size={18} />
            <Typography variant="h6" fontWeight={600}>Chat</Typography>
          </Box>
          <Box
            component="button"
            onClick={() => navigate(`/user/chats/${contract.chatId}`)}
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
            }}
          >
            <FiMessageCircle size={20} />
            Message {contract.member?.firstName || "Restorer"}
          </Box>
        </Paper>
      )}

      <Paper variant="outlined" sx={{ p: 3, mb: 3, opacity: canReview ? 0.6 : 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <FiPackage size={18} color={canReview ? "gray" : "black"} />
          <Typography variant="h6" fontWeight={600} color={canReview ? "text.secondary" : "text.primary"}>Tracking</Typography>
        </Box>

        <Typography variant="subtitle2" color="text.secondary" mb={0.5}>Inbound label</Typography>
        {canReview ? (
          <Typography variant="body2" color="text.disabled" mb={2}>Pending payment</Typography>
        ) : contract.inboundTracking?.carrier ? (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight={600}>{contract.inboundTracking.carrier}</Typography>
            <Typography variant="body2" color="text.secondary">{contract.inboundTracking.trackingNumber}</Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.disabled" mb={2}>Label pending</Typography>
        )}

        <Typography variant="subtitle2" color="text.secondary" mb={0.5}>Outbound label</Typography>
        {canReview ? (
          <Typography variant="body2" color="text.disabled">Pending payment</Typography>
        ) : contract.outboundTracking?.carrier ? (
          <Box>
            <Typography variant="body2" fontWeight={600}>{contract.outboundTracking.carrier}</Typography>
            <Typography variant="body2" color="text.secondary">{contract.outboundTracking.trackingNumber}</Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.disabled">Label pending</Typography>
        )}

        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            fullWidth
            disabled={!contract.inboundLabelUrl}
            startIcon={
              contract.inboundLabelUrl ? <FiPrinter size={18} /> : 
              (needsLabelPoll ? <CircularProgress size={16} color="inherit" /> : <FiPrinter size={18} />)
            }
            onClick={() => contract.inboundLabelUrl && window.open(contract.inboundLabelUrl, "_blank", "noopener")}
            sx={{
              py: 1.25,
              bgcolor: contract.inboundLabelUrl ? "#FFD100" : "action.disabledBackground",
              color: contract.inboundLabelUrl ? "#000" : "text.disabled",
              fontWeight: 700,
              textTransform: "none",
              fontSize: "1rem",
              "&:hover": { bgcolor: contract.inboundLabelUrl ? "#E6BC00" : undefined },
            }}
          >
            {contract.inboundLabelUrl 
              ? "Print Shipping Label" 
              : (needsLabelPoll ? "Processing Label..." : "Label Unavailable")}
          </Button>
          {!contract.inboundLabelUrl && needsLabelPoll && (
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center", mt: 1 }}>
              Usually takes under a minute. This page will automatically refresh.
            </Typography>
          )}
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Journey
        </Typography>
        <Timeline events={contract.timeline ?? []} />
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
        <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <Box sx={{ flex: 2, overflow: "auto", p: 3, pr: 1.5 }}>
            {leftContent}
          </Box>
          <Box sx={{ flex: 1, overflow: "auto", p: 3, pl: 1.5 }}>
            <Box sx={{ position: "sticky", top: 0 }}>{rightContent}</Box>
          </Box>
        </Box>
      )}

      <ImagePreviewDialog
        open={!!previewUrl}
        url={previewUrl}
        onClose={() => setPreviewUrl(null)}
      />
    </Box>
  );
};

export default UserContractPage;
