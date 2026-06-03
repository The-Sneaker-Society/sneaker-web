import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { format } from "date-fns";
import { Box, Typography, Button, useTheme, useMediaQuery, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { useColors } from "../../theme/colors";
import { FiInbox, FiTool, FiCheckCircle, FiClock, FiLink, FiClipboard } from "react-icons/fi";

const GET_CONTRACT_LIST = gql`
  query GetContractList {
    getContractList {
      id
      name
      status
      createdAt
    }
    currentMember {
      id
      qrWidgetData {
        image
        url
      }
    }
  }
`;

const STATUS_CONFIG = {
  PENDING_REVIEW:      { label: "Pending Review",      icon: FiClock,       colorKey: "pending"    },
  PRICE_PROPOSED:      { label: "Price Proposed",      icon: FiClock,       colorKey: "inProgress" },
  PRICE_ACCEPTED:      { label: "Price Accepted",      icon: FiClock,       colorKey: "inProgress" },
  WAITING_SHIPMENT:    { label: "Waiting Shipment",    icon: FiInbox,       colorKey: "inProgress" },
  SHIPPED:             { label: "Shipped",              icon: FiInbox,       colorKey: "inProgress" },
  ARRIVED_AT_MEMBER:   { label: "Arrived at Member",   icon: FiTool,        colorKey: "inProgress" },
  WORK_IN_PROGRESS:    { label: "Work in Progress",    icon: FiTool,        colorKey: "inProgress" },
  PROCESSING_RETURN:   { label: "Processing Return",   icon: FiTool,        colorKey: "inProgress" },
  SHIPPED_BACK:        { label: "Shipped Back",         icon: FiInbox,       colorKey: "inProgress" },
  USER_RECEIVED:       { label: "User Received",        icon: FiCheckCircle, colorKey: "completed"  },
  PAYOUT_RELEASED:     { label: "Payout Released",      icon: FiCheckCircle, colorKey: "completed"  },
};

const STATUS_BUCKETS = [
  { label: "Pending Review", statuses: ["PENDING_REVIEW"],                                    icon: FiClock,       colorKey: "pending"    },
  { label: "In Progress",    statuses: ["PRICE_PROPOSED","PRICE_ACCEPTED","WAITING_SHIPMENT", "SHIPPED","ARRIVED_AT_MEMBER","WORK_IN_PROGRESS","PROCESSING_RETURN","SHIPPED_BACK"], icon: FiTool, colorKey: "inProgress" },
  { label: "Completed",      statuses: ["USER_RECEIVED","PAYOUT_RELEASED"],                    icon: FiCheckCircle, colorKey: "completed"  },
];

function StatusStrip({ contracts, activeFilter, onFilterChange, colors }) {
  const counts = {};
  STATUS_BUCKETS.forEach(({ label, statuses }) => {
    counts[label] = contracts.filter((c) => statuses.includes(c.status)).length;
  });

  return (
    <Box sx={{ display: "flex", gap: 1.5, mb: 2, pb: 2, borderBottom: `1px solid ${colors.borderSubtle}` }}>
      {STATUS_BUCKETS.map(({ label, statuses, icon: Icon, colorKey }) => {
        const color = colors.status[colorKey];
        const isActive = activeFilter === label;

        return (
          <Box
            key={label}
            onClick={() => onFilterChange(isActive ? null : label)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              px: 1.5,
              py: 0.75,
              borderRadius: 2,
              border: `1px solid ${isActive ? color : colors.borderSubtle}`,
              bgcolor: isActive ? `${color}18` : "transparent",
              cursor: "pointer",
              transition: "all 0.18s ease",
              userSelect: "none",
              "&:hover": {
                borderColor: color,
                bgcolor: `${color}10`,
              },
            }}
          >
            <Icon size={13} color={color} />
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color, lineHeight: 1 }}>
              {counts[label]}
            </Typography>
            <Typography sx={{ fontSize: "0.7rem", color: isActive ? colors.textPrimary : colors.textSecondary, fontWeight: 500, display: { xs: "none", sm: "block" } }}>
              {label}
            </Typography>
          </Box>
        );
      })}

      {/* Clear filter hint */}
      {activeFilter && (
        <Typography
          onClick={() => onFilterChange(null)}
          sx={{
            ml: "auto",
            fontSize: "0.7rem",
            color: colors.textSecondary,
            cursor: "pointer",
            alignSelf: "center",
            "&:hover": { color: colors.textPrimary },
            transition: "color 0.15s ease",
          }}
        >
          Clear ×
        </Typography>
      )}
    </Box>
  );
}

export const ContractListWidget = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_CONTRACT_LIST);
  const colors = useColors();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [activeFilter, setActiveFilter] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const handleCopyLink = async () => {
    const url = data?.currentMember?.qrWidgetData?.url;
    if (!url) return;
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
    minHeight: 400,
    height: "100%",
    width: "100%",
    p: 2.5,
    borderRadius: 3,
    border: `1px solid ${colors.borderSubtle}`,
    bgcolor: colors.widgetBg,
    color: colors.textPrimary,
    display: "flex",
    flexDirection: "column",
  };

  if (loading) {
    return (
      <Box sx={containerSx}>
        <Box sx={{ height: 12, width: "30%", borderRadius: 1, bgcolor: colors.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", mb: 2 }} />
        <Box sx={{ display: "flex", gap: 1.5, mb: 2, pb: 2, borderBottom: `1px solid ${colors.borderSubtle}` }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Box key={i} sx={{ height: 34, width: 100, borderRadius: 2, bgcolor: colors.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />
          ))}
        </Box>
        {Array.from({ length: 4 }).map((_, i) => (
          <Box key={i} sx={{ display: "flex", gap: 2, py: 1.5, borderBottom: i < 3 ? `1px solid ${colors.borderSubtle}` : "none" }}>
            <Box sx={{ flex: 1, height: 14, borderRadius: 1, bgcolor: colors.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />
            <Box sx={{ flex: 1, height: 14, borderRadius: 1, bgcolor: colors.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />
            <Box sx={{ flex: 1, height: 14, borderRadius: 1, bgcolor: colors.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />
          </Box>
        ))}
      </Box>
    );
  }

  if (error) {
    return <Box sx={containerSx}><Typography color={colors.status.error}>Error: {error.message}</Typography></Box>;
  }

  const allContracts = data?.getContractList.map((c) => ({
    id: c.id,
    clientName: c.name,
    status: c.status,
    contractCreatedAt: format(new Date(Number(c.createdAt)), "MM-dd-yyyy"),
  })) ?? [];

  // Apply filter
  const visibleContracts = activeFilter
    ? allContracts.filter((c) => {
        const bucket = STATUS_BUCKETS.find((b) => b.label === activeFilter);
        return bucket ? bucket.statuses.includes(c.status) : true;
      })
    : allContracts;

  const columns = [
    { field: "clientName", headerName: "Client", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        const cfg = STATUS_CONFIG[params.value] ?? { label: params.value, icon: FiInbox, colorKey: "notStarted" };
        const color = colors.status[cfg.colorKey];
        const Icon = cfg.icon;
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, height: "100%" }}>
            <Icon size={13} color={color} />
            <Typography sx={{ fontSize: "0.8rem", color, fontWeight: 600 }}>
              {cfg.label}
            </Typography>
          </Box>
        );
      },
    },
    { field: "contractCreatedAt", headerName: "Created", flex: 1 },
  ];

  const handleRowClick = (row) => {
    navigate(`/member/contract/${row.id}`);
  };

  return (
    <Box sx={containerSx}>
      {/* Clickable status strip */}
      {allContracts.length > 0 && (
        <StatusStrip
          contracts={allContracts}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          colors={colors}
        />
      )}

      {/* Data grid or empty state */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        {allContracts.length === 0 ? (
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", gap: 3, px: 3 }}>
            {/* QR code */}
            <Box sx={{ flexShrink: 0 }}>
              <img
                src={data?.currentMember?.qrWidgetData?.image}
                alt="QR Code"
                style={{ width: "160px", height: "160px", display: "block", borderRadius: 8 }}
              />
            </Box>
            {/* Text + CTA */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: { xs: "center", sm: "flex-start" }, textAlign: { xs: "center", sm: "left" }, gap: 1.5 }}>
              <Typography sx={{ fontSize: "1.25rem", fontWeight: 700, color: colors.textPrimary }}>
                No contracts yet
              </Typography>
              <Typography sx={{ fontSize: "0.9rem", color: colors.textSecondary, maxWidth: 300, lineHeight: 1.5 }}>
                Share your intake link with clients to start receiving contracts and growing your business.
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<FiLink size={15} />}
                  onClick={handleCopyLink}
                  sx={{ color: colors.textPrimary, borderColor: colors.borderSecondary, textTransform: "none", fontSize: "0.9rem", fontWeight: 600, borderRadius: 1.5, px: 3, py: 0.75, "&:hover": { bgcolor: `${colors.textPrimary}08`, borderColor: colors.textPrimary } }}
                >
                  Link
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<FiClipboard size={15} />}
                  onClick={() => navigate("/member/preview-contract")}
                  sx={{ color: colors.textPrimary, borderColor: colors.borderSecondary, textTransform: "none", fontSize: "0.9rem", fontWeight: 600, borderRadius: 1.5, px: 3, py: 0.75, "&:hover": { bgcolor: `${colors.textPrimary}08`, borderColor: colors.textPrimary } }}
                >
                  Preview Intake Form
                </Button>
              </Box>
            </Box>
          </Box>
        ) : (
        <DataGrid
          sx={{
            border: "none",
            color: colors.textPrimary,
            "& .MuiDataGrid-columnHeaders": { borderBottom: `1px solid ${colors.borderSubtle}` },
            "& .MuiDataGrid-footerContainer": { borderTop: `1px solid ${colors.borderSubtle}` },
            "& .MuiDataGrid-row": { cursor: "pointer" },
            "& .MuiDataGrid-cell": { borderBottom: `1px solid ${colors.borderSubtle}` },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 600,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: colors.textSecondary,
            },
          }}
          rows={visibleContracts}
          columns={columns}
          {...(isDesktop ? { autoPageSize: true } : { initialState: { pagination: { paginationModel: { pageSize: 4 } } }, pageSizeOptions: [4] })}
          onRowClick={handleRowClick}
        />
        )}
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
