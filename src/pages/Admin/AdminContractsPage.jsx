import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Grid2,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_ADMIN_CONTRACTS } from "./graphql";
import Header from "../../components/Header";
import {
  FiSearch,
  FiTrendingUp,
  FiDollarSign,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiEye,
} from "react-icons/fi";
import { format } from "date-fns";

const money = (val) => `$${Number(val || 0).toFixed(2)}`;

const AdminContractsPage = () => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, loading, error, refetch } = useQuery(GET_ADMIN_CONTRACTS, {
    variables: {
      status: selectedStatus === "ALL" ? null : selectedStatus,
      search: searchTerm.trim() || null,
      limit: 100,
      offset: 0,
    },
    fetchPolicy: "network-only",
    pollInterval: 30000,
  });

  if (loading && !data) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m="20px">
        <Alert severity="error">Failed to load contracts: {error.message}</Alert>
      </Box>
    );
  }

  const items = data?.adminContracts?.items || [];
  const metrics = data?.adminContracts?.metrics || {
    totalVolume: 0,
    totalPayouts: 0,
    totalNetProfit: 0,
    avgMarginPercent: 0,
    completedCount: 0,
    inFlightCount: 0,
    disputeCount: 0,
  };

  const statusFilters = [
    { label: "All Contracts", value: "ALL" },
    { label: `Completed (${metrics.completedCount})`, value: "COMPLETED" },
    { label: `In-Flight (${metrics.inFlightCount})`, value: "IN_FLIGHT" },
    { label: `Disputes (${metrics.disputeCount})`, value: "UNDER_MANUAL_REVIEW" },
    { label: "Canceled", value: "CANCELED" },
  ];

  return (
    <Box m="20px">
      <Header
        title="Contracts Overview & P&L"
        subtitle="Lookup any contract, monitor profit & loss, and audit unit economics across the portfolio"
      />

      {/* Financial Portfolio Metrics */}
      <Grid2 container spacing={2} sx={{ mb: 3 }}>
        <Grid2 xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "rgba(59, 130, 246, 0.1)", color: "#3B82F6" }}>
                <FiDollarSign size={24} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={800}>{money(metrics.totalVolume)}</Typography>
                <Typography variant="body2" color="text.secondary">Gross Volume (GMV)</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "rgba(255, 209, 0, 0.15)", color: "#B45309" }}>
                <FiCheckCircle size={24} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={800}>{money(metrics.totalPayouts)}</Typography>
                <Typography variant="body2" color="text.secondary">Restorer Payouts</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "rgba(16, 185, 129, 0.15)", color: "#10B981" }}>
                <FiTrendingUp size={24} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={800} color="#10B981">
                  +{money(metrics.totalNetProfit)}
                </Typography>
                <Typography variant="body2" color="text.secondary">Net Platform Profit</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "rgba(139, 92, 246, 0.1)", color: "#8B5CF6" }}>
                <FiTrendingUp size={24} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={800}>{metrics.avgMarginPercent.toFixed(1)}%</Typography>
                <Typography variant="body2" color="text.secondary">Avg Net Margin</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Filter & Search Bar */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2, display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {statusFilters.map((tab) => (
            <Button
              key={tab.value}
              size="small"
              variant={selectedStatus === tab.value ? "contained" : "outlined"}
              onClick={() => setSelectedStatus(tab.value)}
              sx={{
                borderRadius: 4,
                textTransform: "none",
                fontWeight: 700,
                ...(selectedStatus === tab.value
                  ? { bgcolor: "#FFD100", color: "#000", "&:hover": { bgcolor: "#e6bd00" } }
                  : {}),
              }}
            >
              {tab.label}
            </Button>
          ))}
        </Box>

        <TextField
          size="small"
          placeholder="Search Order Ref, shoe, brand..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 280 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FiSearch size={16} />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Contracts Table */}
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        {items.length === 0 ? (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              No Contracts Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 450, mx: "auto", mb: 2 }}>
              {searchTerm || selectedStatus !== "ALL"
                ? "No contracts match your search and filter criteria."
                : "No contracts have been created yet on the platform."}
            </Typography>
            <Button variant="outlined" size="small" onClick={() => { setSearchTerm(""); setSelectedStatus("ALL"); refetch(); }}>
              Reset Filters
            </Button>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                <TableCell sx={{ fontWeight: 700 }}>Order Ref</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Shoe / Item</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Restorer</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Customer Paid</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Restorer Net</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Platform Profit</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Margin %</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((contract) => {
                const pnl = contract.pnl || {};
                const isProfitable = (pnl.netPlatformProfit || 0) >= 0;
                const clientName = `${contract.client?.firstName || ""} ${contract.client?.lastName || ""}`.trim() || contract.client?.email || "Customer";
                const memberName = `${contract.member?.firstName || ""} ${contract.member?.lastName || ""}`.trim() || contract.member?.businessName || "Restorer";
                const shoeName = [contract.shoeDetails?.brand, contract.shoeDetails?.model].filter(Boolean).join(" ") || "Custom Repair";

                return (
                  <TableRow key={contract.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={800} sx={{ letterSpacing: "0.05em" }}>
                        {contract.orderRef || contract.id.slice(-6)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{shoeName}</Typography>
                    </TableCell>
                    <TableCell>{clientName}</TableCell>
                    <TableCell>{memberName}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={contract.status}
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.72rem",
                          bgcolor: contract.status === "COMPLETED"
                            ? "rgba(16, 185, 129, 0.15)"
                            : contract.status === "UNDER_MANUAL_REVIEW"
                            ? "rgba(239, 68, 68, 0.15)"
                            : "rgba(59, 130, 246, 0.15)",
                          color: contract.status === "COMPLETED"
                            ? "#10B981"
                            : contract.status === "UNDER_MANUAL_REVIEW"
                            ? "#EF4444"
                            : "#3B82F6",
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">{money(pnl.grossCollected || contract.price)}</TableCell>
                    <TableCell align="right">{money(pnl.payoutAmount || contract.payoutAmount)}</TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 700,
                        color: isProfitable ? "#10B981" : "#EF4444",
                      }}
                    >
                      {isProfitable ? "+" : ""}{money(pnl.netPlatformProfit)}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 700,
                        color: isProfitable ? "#10B981" : "#EF4444",
                      }}
                    >
                      {(pnl.netPlatformMarginPercent || 0).toFixed(1)}%
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<FiEye />}
                        onClick={() => navigate(`/admin/contracts/${contract.orderRef || contract.id}`)}
                        sx={{ textTransform: "none", fontWeight: 700 }}
                      >
                        View P&L
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
};

export default AdminContractsPage;
