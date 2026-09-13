import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  Alert,
  CircularProgress,
  Chip,
  Paper,
  Divider,
  MenuItem,
} from "@mui/material";
import { useMutation, useQuery } from "@apollo/client";
import {
  RESOLVE_DISPUTE_FOR_USER,
  RESOLVE_DISPUTE_FOR_MEMBER,
  RESOLVE_DISPUTE_INCONCLUSIVE,
  DISMISS_DISPUTE,
  MEMBER_OUTSTANDING_DEBT,
  CHARGE_MEMBER_DEBT,
} from "./graphql";
import {
  FiUser,
  FiTool,
  FiShield,
  FiTruck,
  FiDollarSign,
  FiAlertCircle,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";

const money = (val) => `$${Number(val || 0).toFixed(2)}`;

const RESUME_STATUSES = [
  "READY_TO_SHIP",
  "INBOUND_SHIPPED",
  "ARRIVED_AT_MEMBER",
  "WORK_IN_PROGRESS",
  "READY_FOR_RETURN",
  "RETURN_SHIPPED",
  "DELIVERED_TO_USER",
];

const prettyStatus = (s) =>
  String(s || "")
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");

const SHIP_EVENT_LABELS = {
  INBOUND_LABEL_GENERATED: "Label created",
  INBOUND_SHIPPED: "In transit",
  INBOUND_DELIVERED: "Delivered to restorer",
  OUTBOUND_LABEL_GENERATED: "Label created (ready to return)",
  RETURN_SHIPPED: "Return shipped",
  RETURN_DELIVERED: "Return delivered",
  LABEL_GENERATION_FAILED: "Label generation delayed",
};

const legStatus = (contract, leg) => {
  const events = (contract?.timeline || []).filter((t) =>
    leg === "inbound"
      ? String(t?.event || "").startsWith("INBOUND_")
      : [
          "OUTBOUND_LABEL_GENERATED",
          "RETURN_SHIPPED",
          "RETURN_DELIVERED",
          "LABEL_GENERATION_FAILED",
        ].includes(t?.event)
  );
  const last = events
    .slice()
    .sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0))
    .pop();
  const tracking =
    leg === "inbound" ? contract?.inboundTracking : contract?.outboundTracking;
  return {
    label: last
      ? SHIP_EVENT_LABELS[last.event] ||
        String(last.event).replace(/_/g, " ").toLowerCase()
      : "No movement yet",
    date: last?.date || null,
    carrier: tracking?.carrier || null,
    trackingNumber: tracking?.trackingNumber || null,
  };
};

const formatShortDate = (value) => {
  if (!value) return "";
  try {
    const d = new Date(Number(value) || value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "";
  }
};

const DisputeResolutionModal = ({
  open,
  onClose,
  contract,
  pnl,
  onSuccess,
}) => {
  const [step, setStep] = useState("edit"); // "edit" | "review"

  // Allocation state
  const totalCaptured =
    (contract?.price || 0) +
    (contract?.shippingFee || 0) +
    (contract?.insuranceFee || 0) +
    (contract?.taxFee || 0);
  const maxCents = Math.round(totalCaptured * 100);
  const fullPayout = contract?.payoutAmount ?? pnl?.payoutAmount ?? 0;
  const sunkLabels = pnl?.actualLabelCost || contract?.shippingFee || 0;
  const estimatedStripeFee =
    pnl?.estimatedStripeFee ?? Math.round(totalCaptured * 0.029 + 0.3);

  const [refundDollars, setRefundDollars] = useState(totalCaptured.toFixed(2));
  const [payoutDollars, setPayoutDollars] = useState("0.00");
  const [laborFeeInput, setLaborFeeInput] = useState("");
  const [preset, setPreset] = useState("CUSTOMER_FULL"); // "CUSTOMER_FULL" | "HALF_HALF" | "MEMBER_FULL" | "CUSTOM"

  // Shipping & Return liability state
  // "platform" | "member" | "user" | "none"
  const [shippingPayer, setShippingPayer] = useState("platform");
  const [shippingChargeDollars, setShippingChargeDollars] = useState(
    sunkLabels > 0 ? sunkLabels.toFixed(2) : "0.00"
  );

  // Administrative actions
  const [banCustomer, setBanCustomer] = useState(false);
  const [banMember, setBanMember] = useState(false);
  const [reason, setReason] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  // Dismiss mode ("no action needed"): restores pre-dispute status, moves no money
  const [dismissMode, setDismissMode] = useState(false);
  const [resumeStatus, setResumeStatus] = useState("");
  const effectiveResume = resumeStatus || contract?.preDisputeStatus || "";

  // GraphQL mutations & queries
  const [resolveUser, { loading: loadingUser }] = useMutation(
    RESOLVE_DISPUTE_FOR_USER
  );
  const [resolveMember, { loading: loadingMember }] = useMutation(
    RESOLVE_DISPUTE_FOR_MEMBER
  );
  const [resolveInconclusive, { loading: loadingInconclusive }] = useMutation(
    RESOLVE_DISPUTE_INCONCLUSIVE
  );
  const [chargeDebt] = useMutation(CHARGE_MEMBER_DEBT);
  const [dismissDispute, { loading: loadingDismiss }] =
    useMutation(DISMISS_DISPUTE);

  const memberId = contract?.member?.id || null;
  const { data: debtData } = useQuery(MEMBER_OUTSTANDING_DEBT, {
    variables: { memberId },
    skip: !memberId || !open,
    fetchPolicy: "network-only",
  });
  const alreadyOwes = Number(debtData?.memberOutstandingDebt || 0);

  const loading = loadingUser || loadingMember || loadingInconclusive || loadingDismiss;

  // Numbers & math
  const rawRefundCents = Math.round(Number(refundDollars || 0) * 100);
  const rawPayoutCents = Math.round(Number(payoutDollars || 0) * 100);
  const shippingChargeCents = Math.round(
    Number(shippingChargeDollars || 0) * 100
  );

  // If customer absorbs shipping, deduct from refund
  const customerShippingDeduction =
    shippingPayer === "user" ? shippingChargeCents : 0;
  const effectiveRefundCents = Math.max(
    0,
    rawRefundCents - customerShippingDeduction
  );
  const effectivePayoutCents = rawPayoutCents;

  const allocatedCents = rawRefundCents + rawPayoutCents;
  const retainsCents = maxCents - effectiveRefundCents - effectivePayoutCents;

  // Validation
  let validationError = null;
  if (dismissMode) {
    if (!effectiveResume) {
      validationError =
        "Pick where the contract resumes — nothing was recorded when it was flagged.";
    } else if (!reason.trim()) {
      validationError = "Attach a reason — dismissals require a memo on the timeline.";
    }
  } else if (rawRefundCents < 0 || rawPayoutCents < 0 || shippingChargeCents < 0) {
    validationError = "All monetary amounts must be non-negative.";
  } else if (allocatedCents > maxCents) {
    validationError = `Total allocation ($${(allocatedCents / 100).toFixed(
      2
    )}) exceeds captured escrow ($${totalCaptured.toFixed(2)}).`;
  } else if (shippingPayer === "user" && shippingChargeCents > rawRefundCents) {
    validationError = `Shipping deduction ($${(
      shippingChargeCents / 100
    ).toFixed(2)}) exceeds customer refund ($${(rawRefundCents / 100).toFixed(
      2
    )}).`;
  }

  const isValid = !validationError;

  // Platform Net Cash calculation:
  // Retained escrow from order - Shippo label spend - Stripe card fee + any debt recoverable from member
  const platformDebtRecoveryDollars =
    shippingPayer === "member" ? shippingChargeCents / 100 : 0;
  const netPlatformCash =
    retainsCents / 100 -
    sunkLabels -
    estimatedStripeFee +
    platformDebtRecoveryDollars;

  // Restorer Ledger math:
  const newMemberDebt =
    shippingPayer === "member" ? shippingChargeCents / 100 : 0;
  const totalMemberDebt = alreadyOwes + newMemberDebt;
  // If restorer receives payout now, debt netting will deduct from it:
  const netTransferredToRestorer = Math.max(
    0,
    effectivePayoutCents / 100 - totalMemberDebt
  );
  const remainingDebtAfterSettlement = Math.max(
    0,
    totalMemberDebt - effectivePayoutCents / 100
  );

  // Preset Handlers
  const handlePresetCustomerFull = () => {
    setErrorMsg(null);
    setRefundDollars(totalCaptured.toFixed(2));
    setPayoutDollars("0.00");
    setLaborFeeInput("");
    setPreset("CUSTOMER_FULL");
  };

  const handlePresetHalfHalf = () => {
    setErrorMsg(null);
    const half = (totalCaptured / 2).toFixed(2);
    setRefundDollars(half);
    setPayoutDollars(half);
    setLaborFeeInput("");
    setPreset("HALF_HALF");
  };

  const handlePresetMemberFull = () => {
    setErrorMsg(null);
    setRefundDollars("0.00");
    setPayoutDollars(Number(fullPayout).toFixed(2));
    setLaborFeeInput("");
    setPreset("MEMBER_FULL");
  };

  const handleApplyLaborFee = () => {
    const fee = Number(laborFeeInput || 0);
    if (Number.isNaN(fee) || fee < 0) {
      setErrorMsg("Please enter a valid labor fee.");
      return;
    }
    setErrorMsg(null);
    const feeCents = Math.round(fee * 100);
    const remainingCents = Math.max(0, maxCents - feeCents);
    setPayoutDollars((feeCents / 100).toFixed(2));
    setRefundDollars((remainingCents / 100).toFixed(2));
    setPreset("CUSTOM");
  };

  const customerName =
    `${contract?.client?.firstName || ""} ${
      contract?.client?.lastName || ""
    }`.trim() ||
    contract?.client?.email ||
    "Customer";
  const restorerName =
    `${contract?.member?.firstName || ""} ${
      contract?.member?.lastName || ""
    }`.trim() ||
    contract?.member?.businessName ||
    "Restorer";

  const orderRef = contract?.orderRef || contract?.id || "";
  const confirmMatches = confirmText.trim() === orderRef && orderRef !== "";

  const inbound = legStatus(contract, "inbound");
  const outbound = legStatus(contract, "outbound");

  const withReturnNote = (base) => {
    const payerTag =
      shippingPayer === "member"
        ? "Restorer debt"
        : shippingPayer === "user"
        ? "Customer deducted"
        : shippingPayer === "platform"
        ? "Platform absorbed"
        : "N/A";
    return `${base} [Shipping: ${payerTag}]`;
  };

  const handleExecute = async () => {
    setErrorMsg(null);
    try {
      // Dismiss path: no money moves, restore pre-dispute state
      if (dismissMode) {
        await dismissDispute({
          variables: {
            contractId: contract.id,
            resumeStatus: resumeStatus || undefined,
            banUser: banCustomer,
            banMember,
            reason: reason.trim(),
          },
        });
        onSuccess();
        onClose();
        return;
      }
      // 1. If restorer incurs shipping debt, record it in ledger first
      if (shippingPayer === "member" && shippingChargeCents > 0) {
        if (!memberId) {
          setErrorMsg(
            "Cannot charge shipping: restorer not found on this contract."
          );
          return;
        }
        await chargeDebt({
          variables: {
            memberId,
            contractId: contract.id,
            type: "OTHER",
            amountCents: shippingChargeCents,
            reason: withReturnNote(
              reason.trim() || "Dispute shipping charge to restorer"
            ),
          },
        });
      }

      // 2. Determine and fire the appropriate adjudication mutation
      const isPureCustomerRefund =
        effectiveRefundCents === maxCents && effectivePayoutCents === 0;
      const isPureMemberPayout =
        effectivePayoutCents === Math.round(Number(fullPayout) * 100) &&
        effectiveRefundCents === 0;

      if (isPureCustomerRefund) {
        await resolveUser({
          variables: {
            contractId: contract.id,
            banMember,
            banUser: banCustomer,
            reason: withReturnNote(
              reason.trim() || "Admin ruled full refund to customer"
            ),
          },
        });
      } else if (isPureMemberPayout) {
        await resolveMember({
          variables: {
            contractId: contract.id,
            banUser: banCustomer,
            banMember,
            reason: withReturnNote(
              reason.trim() || "Admin ruled full payout to restorer"
            ),
          },
        });
      } else {
        await resolveInconclusive({
          variables: {
            contractId: contract.id,
            refundCents: effectiveRefundCents,
            payoutCents: effectivePayoutCents,
            banUser: banCustomer,
            banMember,
            reason: withReturnNote(
              reason.trim() || "Admin resolved dispute with split allocation"
            ),
          },
        });
      }

      onSuccess();
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Failed to execute dispute decision.");
      setStep("edit");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle
        sx={{
          fontWeight: 800,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={800} component="span">
            Dispute Adjudication — Order {orderRef}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", fontWeight: 600, mt: 0.25 }}
          >
            Escrow Inflow: {money(totalCaptured)} · Shippo Postage Sunk:{" "}
            {money(sunkLabels)} · Est. Stripe Fee: {money(estimatedStripeFee)}
          </Typography>
        </Box>
        <Chip
          label={
            step === "edit"
              ? "Step 1: Configure Decision"
              : "Step 2: Review & Confirm"
          }
          color={step === "edit" ? "primary" : "warning"}
          size="small"
          sx={{ fontWeight: 700 }}
        />
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2, pb: 2 }}>
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        {validationError && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {validationError}
          </Alert>
        )}

        {step === "edit" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* 0. DISMISS — no action needed */}
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                borderRadius: 2,
                bgcolor: dismissMode ? "rgba(16, 185, 129, 0.06)" : "background.paper",
                border: dismissMode ? "1px solid #10B981" : undefined,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                <Chip
                  label={dismissMode ? "Dismissing — no action needed" : "No action needed? Dismiss instead"}
                  clickable
                  color={dismissMode ? "success" : "default"}
                  variant={dismissMode ? "filled" : "outlined"}
                  onClick={() => setDismissMode((v) => !v)}
                  sx={{ fontWeight: 700 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {dismissMode
                    ? "Money sections collapse. Nothing moves — contract resumes where it was."
                    : "False alarm? Dismiss restores the contract and records your reason."}
                </Typography>
              </Box>
              {dismissMode && (
                <Box sx={{ mt: 2 }}>
                  {contract?.preDisputeStatus ? (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      Resumes to <strong>{prettyStatus(contract.preDisputeStatus)}</strong> — where it
                      was when flagged. Payout unfreezes. Override below if that&apos;s wrong.
                    </Alert>
                  ) : (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      Flagged before resume tracking — pick where the contract resumes.
                    </Alert>
                  )}
                  <TextField
                    select
                    label="Resume status"
                    size="small"
                    value={resumeStatus}
                    onChange={(e) => setResumeStatus(e.target.value)}
                    placeholder={contract?.preDisputeStatus ? prettyStatus(contract.preDisputeStatus) : "Select…"}
                    sx={{ minWidth: 240 }}
                    helperText={
                      contract?.preDisputeStatus
                        ? "Leave empty to use the recorded pre-dispute status"
                        : "Required — no recorded status exists"
                    }
                  >
                    {RESUME_STATUSES.map((s) => (
                      <MenuItem key={s} value={s}>
                        {prettyStatus(s)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              )}
            </Paper>
            {!dismissMode && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* 1. ESCROW ALLOCATION */}
            <Paper
              variant="outlined"
              sx={{ p: 2.5, borderRadius: 2, bgcolor: "background.paper" }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1.5,
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight={800}>
                    1. Escrow Allocation
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Distribute captured funds ({money(totalCaptured)}) between
                    customer and restorer
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                  <Chip
                    label="100% Customer"
                    clickable
                    color={preset === "CUSTOMER_FULL" ? "primary" : "default"}
                    variant={
                      preset === "CUSTOMER_FULL" ? "filled" : "outlined"
                    }
                    onClick={handlePresetCustomerFull}
                    sx={{ fontWeight: 700 }}
                  />
                  <Chip
                    label="50 / 50 Split"
                    clickable
                    color={preset === "HALF_HALF" ? "primary" : "default"}
                    variant={preset === "HALF_HALF" ? "filled" : "outlined"}
                    onClick={handlePresetHalfHalf}
                    sx={{ fontWeight: 700 }}
                  />
                  <Chip
                    label="100% Restorer"
                    clickable
                    color={preset === "MEMBER_FULL" ? "primary" : "default"}
                    variant={preset === "MEMBER_FULL" ? "filled" : "outlined"}
                    onClick={handlePresetMemberFull}
                    sx={{ fontWeight: 700 }}
                  />
                </Box>
              </Box>

              {/* Bench / Labor fee quick-apply input */}
              <Box
                sx={{
                  p: 1.5,
                  mb: 2,
                  borderRadius: 1.5,
                  bgcolor: "action.hover",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ minWidth: 160 }}
                >
                  Restorer Labor Fee ($):
                </Typography>
                <TextField
                  size="small"
                  type="number"
                  placeholder="e.g. 50.00"
                  value={laborFeeInput}
                  onChange={(e) => setLaborFeeInput(e.target.value)}
                  sx={{ maxWidth: 140 }}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleApplyLaborFee}
                  sx={{ textTransform: "none", fontWeight: 700 }}
                >
                  Apply Fee
                </Button>
                <Typography variant="caption" color="text.secondary">
                  Pays restorer this labor fee; refunds the remainder to
                  customer.
                </Typography>
              </Box>

              {/* Amount Inputs */}
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <TextField
                  label={`Customer Refund (${customerName})`}
                  type="number"
                  size="small"
                  sx={{ flex: 1, minWidth: 180 }}
                  value={refundDollars}
                  onChange={(e) => {
                    setRefundDollars(e.target.value);
                    setPreset("CUSTOM");
                  }}
                  helperText={`Out of ${money(totalCaptured)} total captured`}
                />
                <TextField
                  label={`Restorer Payout (${restorerName})`}
                  type="number"
                  size="small"
                  sx={{ flex: 1, minWidth: 180 }}
                  value={payoutDollars}
                  onChange={(e) => {
                    setPayoutDollars(e.target.value);
                    setPreset("CUSTOM");
                  }}
                  helperText={`Agreed contract payout: ${money(fullPayout)}`}
                />
              </Box>

              <Box
                sx={{
                  mt: 1.5,
                  display: "flex",
                  justifyContent: "space-between",
                  px: 0.5,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Allocated: {money(allocatedCents / 100)} /{" "}
                  {money(totalCaptured)}
                </Typography>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color={retainsCents >= 0 ? "text.primary" : "error.main"}
                >
                  Platform Retains: {money(retainsCents / 100)}
                </Typography>
              </Box>
            </Paper>

            {/* 2. SHIPPING & RETURN LOGISTICS */}
            <Paper
              variant="outlined"
              sx={{ p: 2.5, borderRadius: 2, bgcolor: "background.paper" }}
            >
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="subtitle1" fontWeight={800}>
                  2. Shipping & Return Logistics
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Who absorbs the sunk round-trip postage ({money(sunkLabels)})?
                </Typography>
              </Box>

              {/* Custody tracking pill strip */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  mb: 2,
                  flexWrap: "wrap",
                  p: 1.25,
                  borderRadius: 1.5,
                  bgcolor: "action.hover",
                }}
              >
                <Box sx={{ flex: 1, minWidth: 200 }}>
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    color="text.secondary"
                  >
                    INBOUND LEG (Customer → Restorer)
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {inbound.label}
                    {inbound.date ? ` · ${formatShortDate(inbound.date)}` : ""}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {inbound.carrier || "USPS"}:{" "}
                    {inbound.trackingNumber || "no tracking"}
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ flex: 1, minWidth: 200 }}>
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    color="text.secondary"
                  >
                    RETURN / OUTBOUND LEG (Restorer → Customer)
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {outbound.label}
                    {outbound.date
                      ? ` · ${formatShortDate(outbound.date)}`
                      : ""}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {outbound.carrier || "USPS"}:{" "}
                    {outbound.trackingNumber || "label generated at checkout"}
                  </Typography>
                </Box>
              </Box>

              {/* Who absorbs shipping pills */}
              <Typography
                variant="caption"
                fontWeight={700}
                color="text.secondary"
                sx={{ display: "block", mb: 1 }}
              >
                WHO ABSORBS SHIPPING POSTAGE:
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                <Chip
                  label="Platform absorbs (Goodwill / Shared)"
                  clickable
                  color={shippingPayer === "platform" ? "primary" : "default"}
                  variant={
                    shippingPayer === "platform" ? "filled" : "outlined"
                  }
                  onClick={() => setShippingPayer("platform")}
                  sx={{ fontWeight: 700 }}
                />
                <Chip
                  label="Restorer incurs debt (Member Ledger)"
                  clickable
                  color={shippingPayer === "member" ? "warning" : "default"}
                  variant={shippingPayer === "member" ? "filled" : "outlined"}
                  onClick={() => setShippingPayer("member")}
                  sx={{ fontWeight: 700 }}
                />
                <Chip
                  label="Customer absorbs (Deducted from refund)"
                  clickable
                  color={shippingPayer === "user" ? "info" : "default"}
                  variant={shippingPayer === "user" ? "filled" : "outlined"}
                  onClick={() => setShippingPayer("user")}
                  sx={{ fontWeight: 700 }}
                />
                <Chip
                  label="N/A (No shipping adjustment)"
                  clickable
                  color={shippingPayer === "none" ? "default" : "default"}
                  variant={shippingPayer === "none" ? "filled" : "outlined"}
                  onClick={() => setShippingPayer("none")}
                  sx={{ fontWeight: 700 }}
                />
              </Box>

              {/* Conditional Amount Controls */}
              {shippingPayer === "member" && (
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 1.5,
                    bgcolor: "rgba(255, 209, 0, 0.08)",
                    border: "1px solid rgba(255, 209, 0, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    flexWrap: "wrap",
                  }}
                >
                  <TextField
                    label="Shipping debt charged to restorer ($)"
                    size="small"
                    type="number"
                    value={shippingChargeDollars}
                    onChange={(e) => setShippingChargeDollars(e.target.value)}
                    sx={{ maxWidth: 200 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Logged as outstanding debt. Member owes {money(alreadyOwes)}{" "}
                    already. Automatically netted from future payouts.
                  </Typography>
                </Box>
              )}

              {shippingPayer === "user" && (
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 1.5,
                    bgcolor: "rgba(59, 130, 246, 0.08)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    flexWrap: "wrap",
                  }}
                >
                  <TextField
                    label="Postage deducted from customer refund ($)"
                    size="small"
                    type="number"
                    value={shippingChargeDollars}
                    onChange={(e) => setShippingChargeDollars(e.target.value)}
                    sx={{ maxWidth: 220 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Customer covers shipping. This amount is subtracted directly
                    from their refund.
                  </Typography>
                </Box>
              )}

              {shippingPayer === "platform" && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block" }}
                >
                  Sneaker Society absorbs the label spend. No debt is charged to
                  the restorer, and customer refund is not penalized.
                </Typography>
              )}
            </Paper>

            {/* 3. REAL-TIME 3-PARTY IMPACT CARDS */}
            <Box>
              <Typography
                variant="caption"
                fontWeight={800}
                color="text.secondary"
                sx={{ letterSpacing: "0.08em", display: "block", mb: 1 }}
              >
                REAL-TIME FINANCIAL IMPACT BREAKDOWN
              </Typography>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {/* Customer Card */}
                <Paper
                  variant="outlined"
                  sx={{
                    flex: 1,
                    minWidth: 230,
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid rgba(59, 130, 246, 0.4)",
                    bgcolor: "rgba(59, 130, 246, 0.04)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1.5,
                    }}
                  >
                    <FiUser color="#3B82F6" size={18} />
                    <Typography variant="subtitle2" fontWeight={800}>
                      Customer ({customerName})
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Original Paid:
                    </Typography>
                    <Typography variant="caption" fontWeight={600}>
                      {money(totalCaptured)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Escrow Refund:
                    </Typography>
                    <Typography variant="caption" fontWeight={600}>
                      +{money(rawRefundCents / 100)}
                    </Typography>
                  </Box>
                  {shippingPayer === "user" && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="caption" color="error.main">
                        Shipping Deducted:
                      </Typography>
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        color="error.main"
                      >
                        -{money(shippingChargeCents / 100)}
                      </Typography>
                    </Box>
                  )}
                  <Divider sx={{ my: 1 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" fontWeight={800}>
                      Net Received:
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      color="primary.main"
                    >
                      {money(effectiveRefundCents / 100)}
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 0.5 }}
                  >
                    Refunded via Stripe to original payment method.
                  </Typography>
                </Paper>

                {/* Restorer Card */}
                <Paper
                  variant="outlined"
                  sx={{
                    flex: 1,
                    minWidth: 230,
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid rgba(255, 209, 0, 0.4)",
                    bgcolor: "rgba(255, 209, 0, 0.04)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1.5,
                    }}
                  >
                    <FiTool color="#FFD100" size={18} />
                    <Typography variant="subtitle2" fontWeight={800}>
                      Restorer ({restorerName})
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Escrow Payout:
                    </Typography>
                    <Typography variant="caption" fontWeight={600}>
                      {money(rawPayoutCents / 100)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Prior Debt Balance:
                    </Typography>
                    <Typography variant="caption" fontWeight={600}>
                      {money(alreadyOwes)}
                    </Typography>
                  </Box>
                  {shippingPayer === "member" && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="caption" color="warning.main">
                        New Shipping Debt:
                      </Typography>
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        color="warning.main"
                      >
                        +{money(shippingChargeCents / 100)}
                      </Typography>
                    </Box>
                  )}
                  <Divider sx={{ my: 1 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" fontWeight={800}>
                      Payout Now:
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      color={
                        netTransferredToRestorer > 0
                          ? "success.main"
                          : "text.primary"
                      }
                    >
                      {money(netTransferredToRestorer)}
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 0.5 }}
                  >
                    {remainingDebtAfterSettlement > 0
                      ? `Remaining ledger debt: ${money(
                          remainingDebtAfterSettlement
                        )}`
                      : "Zero debt remaining on ledger"}
                  </Typography>
                </Paper>

                {/* Platform Card */}
                <Paper
                  variant="outlined"
                  sx={{
                    flex: 1,
                    minWidth: 230,
                    p: 2,
                    borderRadius: 2,
                    border: `1px solid ${
                      netPlatformCash >= 0
                        ? "rgba(16, 185, 129, 0.4)"
                        : "rgba(239, 68, 68, 0.4)"
                    }`,
                    bgcolor:
                      netPlatformCash >= 0
                        ? "rgba(16, 185, 129, 0.04)"
                        : "rgba(239, 68, 68, 0.04)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1.5,
                    }}
                  >
                    <FiShield
                      color={netPlatformCash >= 0 ? "#10B981" : "#EF4444"}
                      size={18}
                    />
                    <Typography variant="subtitle2" fontWeight={800}>
                      Sneaker Society (Platform)
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Escrow Retained:
                    </Typography>
                    <Typography variant="caption" fontWeight={600}>
                      {money(retainsCents / 100)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Sunk Labels:
                    </Typography>
                    <Typography variant="caption" fontWeight={600}>
                      -{money(sunkLabels)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Stripe Card Fee:
                    </Typography>
                    <Typography variant="caption" fontWeight={600}>
                      -{money(estimatedStripeFee)}
                    </Typography>
                  </Box>
                  {shippingPayer === "member" && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="caption" color="success.main">
                        Member Receivable:
                      </Typography>
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        color="success.main"
                      >
                        +{money(platformDebtRecoveryDollars)}
                      </Typography>
                    </Box>
                  )}
                  <Divider sx={{ my: 1 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" fontWeight={800}>
                      Net Platform P&L:
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      color={
                        netPlatformCash >= 0 ? "success.main" : "error.main"
                      }
                    >
                      {netPlatformCash >= 0 ? "+" : ""}
                      {money(netPlatformCash)}
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 0.5 }}
                  >
                    Actual cash impact on platform account.
                  </Typography>
                </Paper>
              </Box>
            </Box>
            </Box>
            )}

            {/* 4. ACCOUNT ACTIONS & INTERNAL MEMO */}
            <Box>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 1.5 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={banCustomer}
                      onChange={(e) => setBanCustomer(e.target.checked)}
                      color="error"
                    />
                  }
                  label="Ban customer account"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={banMember}
                      onChange={(e) => setBanMember(e.target.checked)}
                      color="error"
                    />
                  }
                  label="Ban restorer account"
                />
              </Box>

              <TextField
                label="Internal Adjudication Reason / Memo"
                multiline
                rows={2}
                fullWidth
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Document findings for the timeline audit trail (e.g. mutual agreement for partial labor, member unable to acquire matching materials, etc.)"
              />
            </Box>
          </Box>
        )}

        {/* STEP 2: REVIEW & CONFIRM */}
        {step === "review" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Alert severity="info">
              Please review the final money movements and order status below
              before executing. This will trigger Stripe transfers/refunds and
              ledger updates.
            </Alert>

            {dismissMode ? (
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, border: "1px solid #10B981" }}>
                <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1 }}>
                  Dismissal Summary: Order {orderRef}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">Money moves:</Typography>
                    <Typography variant="body2" fontWeight={700}>None — $0 refund, $0 payout</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">Resumes to:</Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {prettyStatus(effectiveResume)} — payout unfrozen
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">Account Actions:</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {banCustomer && banMember
                        ? "Ban both customer & restorer"
                        : banCustomer
                        ? "Ban customer"
                        : banMember
                        ? "Ban restorer"
                        : "No bans"}
                    </Typography>
                  </Box>
                </Box>
                {reason.trim() && (
                  <Box sx={{ mt: 1.5, p: 1, bgcolor: "action.hover", borderRadius: 1 }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary">Memo:</Typography>
                    <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                      &ldquo;{reason.trim()}&rdquo;
                    </Typography>
                  </Box>
                )}
              </Paper>
            ) : (
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1 }}>
                Decision Summary: Order {orderRef}
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Captured Escrow:
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {money(totalCaptured)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Customer Refund ({customerName}):
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color="primary.main"
                  >
                    {money(effectiveRefundCents / 100)}
                    {shippingPayer === "user"
                      ? ` (${money(
                          shippingChargeCents / 100
                        )} postage deducted)`
                      : ""}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Restorer Payout ({restorerName}):
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color="warning.main"
                  >
                    {money(netTransferredToRestorer)} (now via Stripe Connect)
                  </Typography>
                </Box>
                {shippingPayer === "member" && shippingChargeCents > 0 && (
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Restorer Shipping Debt:
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      color="error.main"
                    >
                      +{money(shippingChargeCents / 100)} added to debt ledger
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Platform Net Cash Impact:
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={800}
                    color={netPlatformCash >= 0 ? "success.main" : "error.main"}
                  >
                    {netPlatformCash >= 0 ? "+" : ""}
                    {money(netPlatformCash)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Account Actions:
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {banCustomer && banMember
                      ? "Ban both customer & restorer"
                      : banCustomer
                      ? "Ban customer"
                      : banMember
                      ? "Ban restorer"
                      : "No bans"}
                  </Typography>
                </Box>
              </Box>

              {reason.trim() && (
                <Box sx={{ mt: 1.5, p: 1, bgcolor: "action.hover", borderRadius: 1 }}>
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    color="text.secondary"
                  >
                    Memo:
                  </Typography>
                  <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                    &ldquo;{reason.trim()}&rdquo;
                  </Typography>
                </Box>
              )}
            </Paper>
            )}

            <TextField
              label={`Type ${orderRef} to confirm`}
              size="small"
              fullWidth
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={orderRef}
              helperText="Exact order reference required to prevent accidental settlement"
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        {step === "review" && (
          <Button
            onClick={() => setStep("edit")}
            disabled={loading}
            color="inherit"
          >
            Back
          </Button>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={onClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        {step === "edit" ? (
          <Button
            onClick={() => setStep("review")}
            variant="contained"
            disabled={!isValid || loading}
            sx={{ fontWeight: 700, px: 3 }}
          >
            Continue to review
          </Button>
        ) : (
          <Button
            onClick={handleExecute}
            variant="contained"
            disabled={loading || !confirmMatches || !isValid}
            color={dismissMode ? "success" : "warning"}
            sx={{ fontWeight: 700, px: 3 }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : dismissMode ? (
              "Confirm Dismissal"
            ) : (
              "Confirm & Execute Settlement"
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DisputeResolutionModal;
