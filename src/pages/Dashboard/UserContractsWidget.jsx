import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { format } from "date-fns";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { useColors } from "../../theme/colors";
import { STATUS_UI_CONFIG } from "../../utils/statusConfig";
import { FiPackage, FiUsers } from "react-icons/fi";

const GET_USER_CONTRACTS_WIDGET = gql`
  query GetUserContractsWidget {
    contracts {
      id
      orderRef
      status
      paymentStatus
      createdAt
      shoeDetails {
        brand
        model
      }
      member {
        firstName
        lastName
      }
    }
  }
`;

const STATUS_BUCKETS = [
  { label: "Pending Review", statuses: ["PENDING_REVIEW"] },
  {
    label: "In Progress",
    statuses: [
      "PRICE_PROPOSED",
      "AWAITING_PAYMENT",
      "READY_TO_SHIP",
      "INBOUND_SHIPPED",
      "ARRIVED_AT_MEMBER",
      "WORK_IN_PROGRESS",
      "RETURN_SHIPPED",
      "DELIVERED_TO_USER",
    ],
  },
  { label: "Completed", statuses: ["COMPLETED"] },
];

function StatusStrip({ contracts, activeFilter, onFilterChange, colors }) {
  const counts = {};
  STATUS_BUCKETS.forEach(({ label, statuses }) => {
    counts[label] = contracts.filter((c) => statuses.includes(c.status)).length;
  });

  return (
    <Box sx={{ display: "flex", gap: 1.5, mb: 2, pb: 2, borderBottom: `1px solid ${colors.borderSubtle}` }}>
      {STATUS_BUCKETS.map(({ label }) => {
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
              border: `1px solid ${isActive ? colors.textPrimary : colors.borderSubtle}`,
              cursor: "pointer",
              userSelect: "none",
              "&:hover": { borderColor: colors.textPrimary },
            }}
          >
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: colors.textPrimary, lineHeight: 1 }}>
              {counts[label]}
            </Typography>
            <Typography sx={{ fontSize: "0.7rem", color: colors.textSecondary, fontWeight: 500, display: { xs: "none", sm: "block" } }}>
              {label}
            </Typography>
          </Box>
        );
      })}
      {activeFilter && (
        <Typography
          onClick={() => onFilterChange(null)}
          sx={{ ml: "auto", fontSize: "0.7rem", color: colors.textSecondary, cursor: "pointer", alignSelf: "center" }}
        >
          Clear ×
        </Typography>
      )}
    </Box>
  );
}

export const UserContractsWidget = () => {
  const navigate = useNavigate();
  const colors = useColors();
  const [activeFilter, setActiveFilter] = useState(null);
  const { data, loading, error } = useQuery(GET_USER_CONTRACTS_WIDGET, {
    fetchPolicy: "network-only",
  });

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
        {Array.from({ length: 4 }).map((_, i) => (
          <Box key={i} sx={{ height: 40, borderRadius: 1, mb: 1.5, bgcolor: colors.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={containerSx}>
        <Typography color={colors.status.error}>Error: {error.message}</Typography>
      </Box>
    );
  }

  const allContracts = (data?.contracts ?? []).map((c) => ({
    id: c.id,
    order: c.orderRef || "—",
    shoeName: [c.shoeDetails?.brand, c.shoeDetails?.model].filter(Boolean).join(" ") || "Sneakers",
    status: c.status,
    payment: c.paymentStatus || "unpaid",
    memberName: [c.member?.firstName, c.member?.lastName].filter(Boolean).join(" ") || "—",
    createdAt: c.createdAt ? format(new Date(Number(c.createdAt) || c.createdAt), "MM-dd-yyyy") : "—",
  }));

  if (allContracts.length === 0) {
    return (
      <Box sx={containerSx}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", gap: 1.5, px: 3, py: 4 }}>
          <FiPackage size={36} color={colors.textSecondary} />
          <Typography sx={{ fontSize: "1.25rem", fontWeight: 700, color: colors.textPrimary }}>
            No requests yet
          </Typography>
          <Typography sx={{ fontSize: "0.9rem", color: colors.textSecondary, maxWidth: 320, lineHeight: 1.5 }}>
            Find a restorer in the Society to start your first request — pick a service, ship your sneakers, and track them here.
          </Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<FiUsers size={15} />}
            onClick={() => navigate("/mysociety")}
            sx={{ bgcolor: "#FFD100", color: "#000", textTransform: "none", fontSize: "0.9rem", fontWeight: 700, borderRadius: 1.5, px: 3, py: 0.75, mt: 1, "&:hover": { bgcolor: "#E6BC00" } }}
          >
            Find a member
          </Button>
        </Box>
      </Box>
    );
  }

  const visibleContracts = activeFilter
    ? allContracts.filter((c) => {
        const bucket = STATUS_BUCKETS.find((b) => b.label === activeFilter);
        return bucket ? bucket.statuses.includes(c.status) : true;
      })
    : allContracts;

  const chip = (label, color) => (
    <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
      <Typography sx={{ fontSize: "0.8rem", color, fontWeight: 600 }}>{label}</Typography>
    </Box>
  );

  const columns = [
    { field: "order", headerName: "Order", flex: 0.7 },
    { field: "shoeName", headerName: "Sneakers", flex: 1.2 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        const cfg = STATUS_UI_CONFIG[params.value] ?? { label: params.value, color: colors.textSecondary };
        return chip(cfg.label, cfg.color);
      },
    },
    {
      field: "payment",
      headerName: "Payment",
      flex: 0.8,
      renderCell: (params) =>
        chip(params.value, params.value === "paid" ? colors.status.completed : colors.status.pending),
    },
    { field: "memberName", headerName: "Member", flex: 1 },
    { field: "createdAt", headerName: "Created", flex: 0.8 },
  ];

  return (
    <Box sx={containerSx}>
      <StatusStrip
        contracts={allContracts}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        colors={colors}
      />
      <Box sx={{ flex: 1, minHeight: 0 }}>
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
          initialState={{ pagination: { paginationModel: { pageSize: 8 } } }}
          pageSizeOptions={[8]}
          onRowClick={(params) => navigate(`/user/contract/${params.row.order || params.row.id}`)}
        />
      </Box>
    </Box>
  );
};
