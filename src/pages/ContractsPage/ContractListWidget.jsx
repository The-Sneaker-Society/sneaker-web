import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { format } from "date-fns";
import { Box, Skeleton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { PostAddOutlined } from "@mui/icons-material";
import { useColors } from "../../theme/colors";

const GET_CONTRACT_LIST = gql`
  query GetContractList {
    getContractList {
      id
      name
      status
      createdAt
    }
  }
`;

export const ContractListWidget = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_CONTRACT_LIST);
  const colors = useColors();

  const stageTypeColors = {
    NOT_STARTED: { name: "Not Started", color: colors.status.notStarted },
    PENDING_REVIEW: { name: "Pending Review", color: colors.status.pending },
    STARTED: { name: "Started", color: colors.status.inProgress },
    FINISHED: { name: "Finished", color: colors.status.completed },
  };

  const contractWidgetStyle = {
    minHeight: 400,
    height: "100%",
    width: "100%",
    p: 2,
    borderRadius: 2,
    boxShadow: 3,
    overflowX: "auto",
    border: `4px solid ${colors.border}`,
    borderColor: colors.border,
    bgcolor: colors.widgetBg,
    color: colors.textPrimary,
  };

  if (loading) {
    return (
      <Box sx={contractWidgetStyle}>
        <p>Loading contracts...</p>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={contractWidgetStyle}>
        <p>Error loading contracts: {error.message}</p>
      </Box>
    );
  }

  const contracts = data?.getContractList.map((contract) => ({
    id: contract.id,
    clientName: contract.name,
    status: contract.status,
    contractCreatedAt: format(
      new Date(Number(contract.createdAt)),
      "MM-dd-yyyy"
    ),
  }));

  const columns = [
    { field: "clientName", headerName: "Client Name", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      filterable: true,
      sortable: true,
      renderCell: (params) => {
        const stage = stageTypeColors[params.value] || {
          name: params.value,
          color: colors.textSecondary,
        };

        return (
          <div
            style={{
              backgroundColor: stage.color,
              borderRadius: 2,
              minWidth: { xs: "250px" },
              px: "10px",
              py: "4px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {stage.name}
          </div>
        );
      },
    },
    {
      field: "contractCreatedAt",
      headerName: "Created At",
      flex: 1,
    },
  ];

  const handleRowClick = (row) => {
    navigate(`/member/contract/${row.id}`);
    console.log(row.id);
  };

  if (contracts.length === 0) {
    return (
      <Box
        sx={{
          ...contractWidgetStyle,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PostAddOutlined sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h3" align="center">
          Share your QR code at the bottom right and start building your
          contracts today!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={contractWidgetStyle}>
      <DataGrid
        sx={{
          border: "none",
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
          },
        }}
        rows={contracts}
        columns={columns}
        autoPageSize={true}
        onRowClick={handleRowClick}
      />
    </Box>
  );
};
