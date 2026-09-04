import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Divider,
  Chip,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { FiShield, FiTruck, FiHome, FiArrowRight, FiChevronDown } from "react-icons/fi";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { useQuery, useMutation, gql } from "@apollo/client";
import { GET_CHECKOUT_BY_ORDER_REF } from "../../context/graphql/getContractDetails";

// Mirrors backend plan-shipping.md §2.1. Totals always come from live
// Shippo quotes (server re-resolves on submit), so this preview can never
// spoof the Stripe total. Thresholds gate the toggles only.
const INSURANCE_THRESHOLD = 300;
const SIGNATURE_THRESHOLD = 500;

const CREATE_CONTRACT_CHECKOUT = gql`
  mutation CreateContractCheckout($data: CreateContractCheckoutInput!) {
    createContractCheckout(data: $data)
  }
`;

const GET_RATE_OPTIONS = gql`
  query GetRateOptions($orderRef: String!, $preset: String, $withInsurance: Boolean, $withSignature: Boolean) {
    shippingRateOptions(orderRef: $orderRef, preset: $preset, withInsurance: $withInsurance, withSignature: $withSignature) {
      withInsurance
      options {
        carrier
        service
        serviceToken
        etaDays
        inboundRateId
        inboundAmount
        outboundRateId
        outboundAmount
        roundTripTotal
        insuranceTotal
      }
    }
  }
`;

const money = (n) =>
  `$${(Number(n) || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const ReviewProtectPage = () => {
  const { orderRef } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_CHECKOUT_BY_ORDER_REF, {
    variables: { orderRef },
    skip: !orderRef,
    fetchPolicy: "network-only",
  });
  const [createCheckout, { loading: checkingOut, error: checkoutError }] =
    useMutation(CREATE_CONTRACT_CHECKOUT);

  const contract = data?.contractById;
  const servicePrice = useMemo(
    () =>
      contract?.price ??
      contract?.proposedPrice ??
      contract?.selectedServiceMenuItem?.price ??
      null,
    [contract]
  );

  const [preset, setPreset] = useState("single");
  const [declined, setDeclined] = useState(false);
  const [waiverOpen, setWaiverOpen] = useState(false);
  const [signatureDeclined, setSignatureDeclined] = useState(false);
  const [signatureWaiverOpen, setSignatureWaiverOpen] = useState(false);
  const [packagingModalOpen, setPackagingModalOpen] = useState(false);
  const [signatureOptIn, setSignatureOptIn] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    if (contract?.shippingPreset) setPreset(contract.shippingPreset);
    if (contract?.insuranceDeclined) setDeclined(true);
    if (contract?.signatureRequired === false && contract?.shippingCarrier) {
      setSignatureDeclined(true);
    } else if (contract?.signatureRequired === true) {
      setSignatureOptIn(true);
    }
  }, [contract?.shippingPreset, contract?.shippingSpeed, contract?.insuranceDeclined, contract?.signatureRequired, contract?.shippingCarrier]);

  const declared = Number(contract?.declaredMarketValue) || 0;
  const insuranceToggleable = declared >= INSURANCE_THRESHOLD;
  // Signature is automatic at/over threshold ($300), opt-in below
  const signatureAuto = declared >= SIGNATURE_THRESHOLD;
  const signatureEffective = signatureAuto ? !signatureDeclined : signatureOptIn;

  const handleSignatureToggle = (e) => {
    if (e.target.checked) {
      setSignatureDeclined(false);
    } else {
      setSignatureWaiverOpen(true);
    }
    setSelectedIdx(0);
  };

  const {
    data: ratesData,
    loading: ratesLoading,
    error: ratesError,
    refetch: refetchRates,
  } = useQuery(GET_RATE_OPTIONS, {
    variables: {
      orderRef,
      preset,
      withInsurance: !declined,
      withSignature: signatureEffective,
    },
    skip: !orderRef || !contract,
    fetchPolicy: "network-only",
  });

  const options = ratesData?.shippingRateOptions?.options ?? [];
  const selected = options[Math.min(selectedIdx, Math.max(options.length - 1, 0))] || null;
  const rawRoundTrip = selected?.roundTripTotal || 0;
  const embeddedInsurance = selected?.insuranceTotal || 0;
  // Pure postage excluding insurance
  const purePostage = Math.round((rawRoundTrip - embeddedInsurance) * 100) / 100;
  // When under threshold, Sneaker Society covers insurance — user pays pure postage.
  // When at/above threshold, user pays insurance unless declined.
  const customerShippingFee = purePostage;
  const customerInsuranceFee = insuranceToggleable && !declined ? embeddedInsurance : 0;
  const total = (Number(servicePrice) || 0) + customerShippingFee + customerInsuranceFee;

  const client = contract?.client;
  const addressIncomplete =
    !client?.addressLineOne || !client?.city || !client?.zipcode;
  const checkoutAllowed =
    contract?.status === "PRICE_PROPOSED" ||
    contract?.status === "AWAITING_PAYMENT";

  const handleInsuranceToggle = (e) => {
    if (e.target.checked) {
      // Re-enabling protection needs no waiver.
      setDeclined(false);
    } else {
      // Opting out requires acknowledging the liability waiver first.
      setWaiverOpen(true);
    }
    setSelectedIdx(0);
  };

  const handlePresetChange = (e) => {
    setPreset(e.target.value);
    setSelectedIdx(0);
  };

  const handleContinue = async () => {
    try {
      const { data: result } = await createCheckout({
        variables: {
          data: {
            contractId: contract.id,
            shippingPreset: preset,
            insuranceDeclined: declined,
            signatureRequired: signatureEffective,
            inboundRateId: selected?.inboundRateId,
            outboundRateId: selected?.outboundRateId,
          },
        },
      });
      const url = result?.createContractCheckout;
      if (url) {
        window.location.assign(url);
      }
    } catch {
      // surfaced via checkoutError below
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error || !contract) {
    return (
      <Box sx={{ p: 3, height: "100%", width: "100%" }}>
        <Typography variant="h6" color="error">
          Contract not found.{" "}
          <Button size="small" onClick={() => navigate(-1)}>
            Go back
          </Button>
        </Typography>
      </Box>
    );
  }

  const shoeLabel = [contract.shoeDetails?.brand, contract.shoeDetails?.model]
    .filter(Boolean)
    .join(" ");

  return (
    <Box sx={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Box
        sx={{
          px: { xs: 2.5, sm: 3.5 },
          pt: 3,
          pb: 2.5,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.7rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "text.secondary",
            mb: 0.5,
          }}
        >
          Review &amp; Protect{contract.orderRef ? ` · Order ${contract.orderRef}` : ""}
        </Typography>
        <Typography fontWeight="bold" sx={{ fontSize: { xs: "1.4rem", sm: "1.75rem", md: "2rem" }, lineHeight: 1.1 }}>
          {shoeLabel || "Your contract"} · Service {money(servicePrice)}
        </Typography>
      </Box>

      {!checkoutAllowed && (
        <Alert severity="info" sx={{ m: { xs: 2, sm: 2.5 }, mb: 0 }}>
          This contract is {contract.status?.toLowerCase().replace(/_/g, " ")}{" "}
          and can no longer be checked out.
        </Alert>
      )}

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2.5,
          p: { xs: 2, sm: 2.5 },
          alignItems: "stretch",
          overflowY: { xs: "auto", md: "hidden" },
          minHeight: 0,
        }}
      >
        {/* Left column — choices */}
        <Box sx={{ flex: { xs: "0 0 auto", md: 2 }, display: "flex", flexDirection: "column", gap: 2.5, minWidth: 0, overflowY: { xs: "visible", md: "auto" }, minHeight: 0 }}>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" fontWeight={600} mb={2}>
          Ship-from address
        </Typography>
        {client?.addressLineOne ? (
          <Typography variant="body1">
            {[client.firstName, client.lastName].filter(Boolean).join(" ")}
            <br />
            {client.addressLineOne}
            {client.addressLineTwo ? `, ${client.addressLineTwo}` : ""}
            <br />
            {[client.city, client.state, client.zipcode].filter(Boolean).join(", ")}
            {client.country && client.country !== "US" ? `, ${client.country}` : ""}
          </Typography>
        ) : (
          <Typography variant="body1" color="text.secondary">
            No ship-from address on file.
          </Typography>
        )}
        {addressIncomplete && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Your ship-from address is incomplete (street, city, and zip are
            required) — the inbound label can&apos;t be created until
            it&apos;s finished.{" "}
            <Button
              size="small"
              component={RouterLink}
              to="/user/update-profile"
            >
              Update profile
            </Button>
          </Alert>
        )}
      </Paper>

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" fontWeight={600} mb={2}>
          Shipping size
        </Typography>
        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            value={preset}
            onChange={handlePresetChange}
            sx={{ "& .MuiFormControlLabel-root": { alignItems: "flex-start", mr: 0 }, "& .MuiFormControlLabel-label": { fontSize: "0.875rem", pt: 1 } }}
          >
            <FormControlLabel
              value="single"
              control={<Radio />}
              label="1 pair (4 lbs box)"
            />
            <FormControlLabel
              value="multi"
              control={<Radio />}
              label="Multiple pairs (8 lbs box)"
            />
          </RadioGroup>
        </FormControl>
      </Paper>

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" fontWeight={600} mb={2}>
          Protection
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <FiShield size={16} />
          <Typography variant="body1" fontWeight={700}>
            Shipping insurance
          </Typography>
          <Chip
            size="small"
            label={
              !insuranceToggleable
                ? "Covered by us"
                : declined
                  ? "Declined"
                  : "Included in rates"
            }
            color={!insuranceToggleable || declined ? "success" : "default"}
          />
        </Box>
        {insuranceToggleable ? (
          <>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!declined}
                  onChange={handleInsuranceToggle}
                  sx={{ "&.Mui-checked": { color: "#FFD100" } }}
                />
              }
              label="Protect my shipment — full value covered on both trips"
              sx={{ alignItems: "flex-start", "& .MuiFormControlLabel-label": { fontSize: "0.875rem", pt: 1 } }}
            />
            {declined && (
              <Typography variant="caption" color="warning.main" sx={{ display: "block", mt: 0.5 }}>
                Protection removed — you accepted responsibility for loss or damage in transit.
              </Typography>
            )}
          </>
        ) : (
          <Typography variant="body1" color="text.secondary">
            {`Covered by Sneaker Society — full transit protection included on us for declared values under ${money(INSURANCE_THRESHOLD)}.`}
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <FiTruck size={16} />
          <Typography variant="body1" fontWeight={700}>
            Signature on delivery
          </Typography>
          <Chip
            size="small"
            label={
              signatureAuto
                ? signatureDeclined
                  ? "Declined"
                  : "Active"
                : signatureOptIn
                ? "Active"
                : "Not required"
            }
            color={signatureEffective ? "success" : "default"}
          />
        </Box>
        {signatureAuto ? (
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                Signature Confirmation
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {signatureDeclined
                  ? "Signature declined — delivery driver may leave package unattended at doorstep."
                  : `Signature required on orders over ${money(SIGNATURE_THRESHOLD)} — someone must sign at delivery to prevent porch piracy.`}
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={!signatureDeclined}
                  onChange={handleSignatureToggle}
                  color="primary"
                />
              }
              label={!signatureDeclined ? "Active" : "Off"}
              labelPlacement="start"
              sx={{ m: 0, flexShrink: 0 }}
            />
          </Box>
        ) : (
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                Signature Confirmation
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Add direct signature on delivery to ensure your package is handed directly to someone.
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={signatureOptIn}
                  onChange={(e) => {
                    setSignatureOptIn(e.target.checked);
                    setSelectedIdx(0);
                  }}
                  color="primary"
                />
              }
              label={signatureOptIn ? "Active" : "Off"}
              labelPlacement="start"
              sx={{ m: 0, flexShrink: 0 }}
            />
          </Box>
        )}
      </Paper>

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" fontWeight={600} mb={1}>
          Shipping option
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={2}>
          Live rates, there and back{declined ? ", insurance excluded" : ", insurance included"}.
        </Typography>
        
        {ratesLoading ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 2 }}>
            <CircularProgress size={20} />
            <Typography variant="body1" color="text.secondary">
              Fetching live carrier rates…
            </Typography>
          </Box>
        ) : ratesError ? (
          <Alert
            severity="error"
            action={
              <Button size="small" onClick={() => refetchRates()}>
                Retry
              </Button>
            }
          >
            Couldn&apos;t load live rates: {ratesError.message}
          </Alert>
        ) : (
          <FormControl component="fieldset" fullWidth sx={{ mt: 1 }}>
            <RadioGroup
              value={selected ? options.indexOf(selected) : ""}
              onChange={(e) => setSelectedIdx(Number(e.target.value))}
              sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
            >
              {options.map((o, i) => (
                <Box
                  key={`${o.carrier}-${o.serviceToken}-${i}`}
                  onClick={() => setSelectedIdx(i)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: "2px solid",
                    borderColor: selectedIdx === i ? "#FFD100" : "divider",
                    bgcolor: selectedIdx === i ? "rgba(255,209,0,0.05)" : "transparent",
                    borderRadius: 2,
                    p: 2,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": { borderColor: selectedIdx === i ? "#FFD100" : "text.secondary" }
                  }}
                >
                  <Radio
                    value={i}
                    checked={selectedIdx === i}
                    onChange={() => setSelectedIdx(i)}
                    sx={{ p: 0, mr: 2, color: "text.secondary", "&.Mui-checked": { color: "#FFD100" } }}
                  />
                  <Box>
                    <Typography variant="body1" fontWeight={700}>
                      {o.carrier} {o.service}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {o.etaDays != null ? `~${o.etaDays} days` : "Standard delivery"} — {money(Math.round((o.roundTripTotal - (o.insuranceTotal || 0)) * 100) / 100)} round trip
                    </Typography>
                  </Box>
                </Box>
              ))}
            </RadioGroup>
          </FormControl>
        )}
      </Paper>
        </Box>

        {/* Right column — summary + actions */}
        <Box sx={{ flex: { xs: "0 0 auto", md: 1 }, display: "flex", flexDirection: "column", gap: 2.5, minWidth: 0, overflowY: { xs: "visible", md: "auto" }, minHeight: 0 }}>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" fontWeight={600} mb={2}>
          Order summary
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 1 }}>
          <Typography variant="body1" sx={{ minWidth: 0 }}>Service</Typography>
          <Typography variant="h6" fontWeight={600} sx={{ whiteSpace: "nowrap" }}>{money(servicePrice)}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 1 }}>
          <Typography variant="body1" sx={{ minWidth: 0 }}>Shipping{selected ? ` (${selected.carrier} ${selected.service})` : ""}</Typography>
          <Typography variant="h6" fontWeight={600} sx={{ whiteSpace: "nowrap" }}>{money(customerShippingFee)}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 1 }}>
          <Typography variant="body1" sx={{ minWidth: 0 }}>Package Protection</Typography>
          <Typography variant="h6" fontWeight={600} sx={{ whiteSpace: "nowrap", color: (declined && insuranceToggleable) ? "text.secondary" : "text.primary" }}>
            {declined && insuranceToggleable
              ? "Declined"
              : insuranceToggleable
                ? money(customerInsuranceFee)
                : "Included"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 1 }}>
          <Typography variant="body1" sx={{ minWidth: 0 }}>Signature Required</Typography>
          <Typography variant="h6" fontWeight={600} sx={{ whiteSpace: "nowrap", color: (signatureAuto && signatureDeclined) ? "text.secondary" : signatureEffective ? "text.primary" : "text.secondary" }}>
            {signatureAuto && signatureDeclined
              ? "Declined"
              : signatureEffective
                ? "Included"
                : "Not required"}
          </Typography>
        </Box>
        <Divider sx={{ my: 1.5 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h4" fontWeight={700}>Total</Typography>
          <Typography variant="h4" fontWeight={700}>
            {money(total)}
          </Typography>
        </Box>
      </Paper>

      {checkoutError && (
        <Alert severity="error">
          Couldn&apos;t start checkout: {checkoutError.message}
        </Alert>
      )}

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button
          variant="contained"
          size="large"
          fullWidth
          disabled={!checkoutAllowed || checkingOut || ratesLoading || servicePrice == null || !selected}
          onClick={() => setPackagingModalOpen(true)}
          sx={{
            bgcolor: "#FFD100",
            color: "#000",
            fontWeight: 700,
            textTransform: "none",
            fontSize: "1rem",
            py: 1.25,
            borderRadius: "4px",
            "&:hover": { bgcolor: "#E6BC00" },
          }}
        >
          {checkingOut ? (
            <CircularProgress size={22} sx={{ color: "#000" }} />
          ) : (
            <>
              Pay {money(total)} <FiArrowRight size={18} style={{ marginLeft: 8 }} />
            </>
          )}
        </Button>
      </Box>
        </Box>
      </Box>

      <Dialog open={waiverOpen} onClose={() => setWaiverOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Ship without insurance?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
            If your sneakers are damaged or lost in transit, <strong>you are
            responsible for the loss</strong> — Sneaker Society is not liable
            and cannot reimburse you for uninsured shipments.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setWaiverOpen(false)}
            variant="outlined"
            fullWidth
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
          >
            Keep protection
          </Button>
          <Button
            onClick={() => {
              setDeclined(true);
              setWaiverOpen(false);
            }}
            fullWidth
            sx={{
              bgcolor: "#FFD100",
              color: "#000",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: 2,
              "&:hover": { bgcolor: "#E6BC00" },
            }}
          >
            I accept responsibility
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={signatureWaiverOpen} onClose={() => setSignatureWaiverOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Ship without signature?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
            For orders over <strong>{money(SIGNATURE_THRESHOLD)}</strong>, signature confirmation prevents porch piracy and unattended delivery theft. By waiving a signature, <strong>you accept full responsibility</strong> if the carrier marks the package as delivered but it is missing or stolen.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setSignatureWaiverOpen(false)}
            variant="outlined"
            fullWidth
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
          >
            Keep signature
          </Button>
          <Button
            onClick={() => {
              setSignatureDeclined(true);
              setSignatureWaiverOpen(false);
              setSelectedIdx(0);
            }}
            fullWidth
            sx={{
              bgcolor: "#FFD100",
              color: "#000",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: 2,
              "&:hover": { bgcolor: "#E6BC00" },
            }}
          >
            I accept responsibility
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={packagingModalOpen} onClose={() => setPackagingModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Almost there!</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2, mt: 1 }}>
            By continuing, you accept responsibility for packaging the shoes securely and correctly, ensuring they do not violate our <RouterLink to="/terms" style={{ color: "inherit", textDecoration: "underline" }}>Terms of Service</RouterLink>.
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Note:</strong> There is no need to provide a return shipping label inside the box. The member will handle getting the return label themselves.
          </Typography>
          <Typography variant="body1">
            After your payment is processed, your shipping label will be provided so you can ship the shoes out!
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setPackagingModalOpen(false)}
            variant="outlined"
            fullWidth
            disabled={checkingOut}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              // keep it open while checking out so we see the spinner on this button
              handleContinue();
            }}
            disabled={checkingOut}
            fullWidth
            sx={{
              bgcolor: "#FFD100",
              color: "#000",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: 2,
              "&:hover": { bgcolor: "#E6BC00" },
            }}
          >
            {checkingOut ? <CircularProgress size={22} sx={{ color: "#000" }} /> : "I understand, Continue"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReviewProtectPage;
