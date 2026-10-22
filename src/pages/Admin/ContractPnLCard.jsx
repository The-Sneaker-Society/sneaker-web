import React from "react";
import {
  Paper,
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Divider,
} from "@mui/material";
import { FiDollarSign, FiTrendingUp, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";

const money = (centsOrDollars) => {
  const val = Number(centsOrDollars || 0);
  return `$${val.toFixed(2)}`;
};

const ContractPnLCard = ({ pnl }) => {
  if (!pnl) return null;

  const isProfitable = pnl.netPlatformProfit >= 0;

  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FiTrendingUp size={20} color="#FFD100" />
          <Typography variant="h6" fontWeight={700}>
            Unit Economics & P&L
          </Typography>
        </Box>
        <Chip
          icon={isProfitable ? <FiCheckCircle size={14} /> : <FiAlertTriangle size={14} />}
          label={`${isProfitable ? "+" : ""}${money(pnl.netPlatformProfit)} (${pnl.netPlatformMarginPercent.toFixed(1)}% margin)`}
          sx={{
            fontWeight: 700,
            bgcolor: isProfitable ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
            color: isProfitable ? "#10B981" : "#EF4444",
            border: `1px solid ${isProfitable ? "#10B981" : "#EF4444"}`,
          }}
        />
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Itemized financial breakdown showing captured inflows, vendor and restorer outflows, and platform take.
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Line Item</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>Inflow (Charged)</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>Outflow (Cost/Payout)</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>Net Platform Spread</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography variant="body2" fontWeight={600}>Service Price</Typography>
              <Typography variant="caption" color="text.secondary">85% to Restorer / 15% Take Rate</Typography>
            </TableCell>
            <TableCell align="right">{money(pnl.servicePrice)}</TableCell>
            <TableCell align="right">-{money(pnl.payoutAmount)}</TableCell>
            <TableCell align="right" sx={{ color: "#10B981", fontWeight: 700 }}>
              +{money(pnl.platformFee)}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <Typography variant="body2" fontWeight={600}>Shipping (Round-Trip)</Typography>
              <Typography variant="caption" color="text.secondary">Postage Charged vs. Shippo Label Cost</Typography>
            </TableCell>
            <TableCell align="right">{money(pnl.shippingFee)}</TableCell>
            <TableCell align="right">-{money(pnl.actualLabelCost)}</TableCell>
            <TableCell align="right" sx={{ color: pnl.shippingSpread >= 0 ? "#10B981" : "#EF4444", fontWeight: 700 }}>
              {pnl.shippingSpread >= 0 ? "+" : ""}{money(pnl.shippingSpread)}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <Typography variant="body2" fontWeight={600}>Return Insurance</Typography>
              <Typography variant="caption" color="text.secondary">Customer Paid vs. Carrier Premium</Typography>
            </TableCell>
            <TableCell align="right">{money(pnl.insuranceFee)}</TableCell>
            <TableCell align="right">-{money(pnl.actualInsurancePremium)}</TableCell>
            <TableCell align="right" sx={{ color: pnl.insuranceSpread >= 0 ? "#10B981" : "#EF4444", fontWeight: 700 }}>
              {pnl.insuranceSpread >= 0 ? "+" : ""}{money(pnl.insuranceSpread)}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <Typography variant="body2" fontWeight={600}>Sales Tax Remittance</Typography>
              <Typography variant="caption" color="text.secondary">Pass-Through to Tax Authorities</Typography>
            </TableCell>
            <TableCell align="right">{money(pnl.taxFee)}</TableCell>
            <TableCell align="right">-{money(pnl.salesTaxRemittance)}</TableCell>
            <TableCell align="right" sx={{ color: "text.secondary", fontWeight: 600 }}>
              $0.00
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <Typography variant="body2" fontWeight={600}>Stripe Processing</Typography>
              <Typography variant="caption" color="text.secondary">Standard Card Processing (~2.9% + $0.30)</Typography>
            </TableCell>
            <TableCell align="right">—</TableCell>
            <TableCell align="right">-{money(pnl.estimatedStripeFee)}</TableCell>
            <TableCell align="right" sx={{ color: "#EF4444", fontWeight: 700 }}>
              -{money(pnl.estimatedStripeFee)}
            </TableCell>
          </TableRow>

          <TableRow sx={{ bgcolor: "action.hover" }}>
            <TableCell sx={{ fontWeight: 800 }}>Total Economics</TableCell>
            <TableCell align="right" sx={{ fontWeight: 800 }}>{money(pnl.grossCollected)}</TableCell>
            <TableCell align="right" sx={{ fontWeight: 800 }}>-{money(pnl.totalOutflows)}</TableCell>
            <TableCell
              align="right"
              sx={{
                fontWeight: 800,
                fontSize: "1rem",
                color: isProfitable ? "#10B981" : "#EF4444",
              }}
            >
              {isProfitable ? "+" : ""}{money(pnl.netPlatformProfit)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};

export default ContractPnLCard;
