import React from "react";
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
  Grid2,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_ADMIN_DISPUTE_QUEUE } from "./graphql";
import Header from "../../components/Header";
import { FiAlertCircle, FiDollarSign, FiClock, FiShield } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";

const money = (val) => `$${Number(val || 0).toFixed(2)}`;

const AdminDisputeQueuePage = () => {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useQuery(GET_ADMIN_DISPUTE_QUEUE, {
    variables: { limit: 50, offset: 0 },
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
        <Alert severity="error">Failed to load dispute queue: {error.message}</Alert>
      </Box>
    );
  }

  const items = data?.adminDisputeQueue?.items || [];
  const total = data?.adminDisputeQueue?.total || 0;

  const totalDeclaredAtRisk = items.reduce((sum, item) => sum + (item.declaredMarketValue || 0), 0);
  const highSeverityCount = items.filter((item) => (item.severityScore || 0) > 100 || (item.declaredMarketValue || 0) > 300).length;

  return (
    <Box m="20px">
      <Header title="Admin Dispute Queue" subtitle="Review and adjudicate disputed contracts under manual review" />

      {/* KPI Metrics Row */}
      <Grid2 container spacing={2} sx={{ mb: 3 }}>
        <Grid2 xs={12} sm={4}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "rgba(239, 68, 68, 0.1)", color: "#EF4444" }}>
                <FiAlertCircle size={24} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={800}>{total}</Typography>
                <Typography variant="body2" color="text.secondary">Open Disputes</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 xs={12} sm={4}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "rgba(255, 209, 0, 0.15)", color: "#B45309" }}>
                <FiDollarSign size={24} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={800}>{money(totalDeclaredAtRisk)}</Typography>
                <Typography variant="body2" color="text.secondary">Total Value at Risk</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 xs={12} sm={4}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "rgba(59, 130, 246, 0.1)", color: "#3B82F6" }}>
                <FiShield size={24} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={800}>{highSeverityCount}</Typography>
                <Typography variant="body2" color="text.secondary">High Severity Cases</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Queue Table */}
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        {items.length === 0 ? (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Dispute Queue is Empty
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 450, mx: "auto", mb: 2 }}>
              There are currently no contracts locked in manual review. Platform escrow operations are running smoothly.
            </Typography>
            <Button variant="outlined" size="small" onClick={() => refetch()}>
              Refresh Queue
            </Button>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                <TableCell sx={{ fontWeight: 700 }}>Order Ref</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Restorer</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Service Price</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Declared Value</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Flagged Age</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Severity</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => {
                const isHighSeverity = (item.severityScore || 0) > 100 || (item.declaredMarketValue || 0) > 300;
                let ageText = "Recently";
                if (item.disputeOpenedAt || item.createdAt) {
                  try {
                    ageText = formatDistanceToNow(new Date(item.disputeOpenedAt || item.createdAt), {
                      addSuffix: true,
                    });
                  } catch (e) {
                    // fallback
                  }
                }

                return (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={800} sx={{ letterSpacing: "0.05em" }}>
                        {item.orderRef}
                      </Typography>
                    </TableCell>
                    <TableCell>{item.clientName}</TableCell>
                    <TableCell>{item.memberName}</TableCell>
                    <TableCell align="right">{money(item.servicePrice)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>{money(item.declaredMarketValue)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
                        <FiClock size={13} />
                        <Typography variant="caption">{ageText}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={isHighSeverity ? "High Risk" : "Standard"}
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          bgcolor: isHighSeverity ? "rgba(239, 68, 68, 0.15)" : "rgba(128, 128, 128, 0.15)",
                          color: isHighSeverity ? "#EF4444" : "text.primary",
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`/admin/disputes/${item.orderRef}`)}
                        sx={{
                          bgcolor: "#FFD100",
                          color: "#000",
                          fontWeight: 700,
                          "&:hover": { bgcolor: "#e6bd00" },
                        }}
                      >
                        Review Dispute →
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

export default AdminDisputeQueuePage;
