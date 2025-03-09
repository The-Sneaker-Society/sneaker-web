import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { format } from "date-fns";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const ContractListWidget = () => {
  const navigate = useNavigate();

  // Input gql here

  const contractWidgetStyle = {
    minHeight: 400,
    height: "100%",
    width: "100%",
    p: 2,
    borderRadius: 2,
    boxShadow: 3,
    overflowX: "auto",
    border: '4px solid white',
    borderColor: "white",
  };

  let contracts = [
    {
      id: "1",
      clientName: "Acme Corporation",
      status: "In Progress",
      contractCreatedAt: new Date("2023-10-26T10:00:00Z").toISOString(),
    },
    {
      id: "2",
      clientName: "Beta Industries",
      status: "Completed",
      contractCreatedAt: new Date("2023-11-15T14:30:00Z").toISOString(),
    },
    {
      id: "3",
      clientName: "Gamma Solutions",
      status: "Pending",
      contractCreatedAt: new Date("2023-12-01T09:15:00Z").toISOString(),
    },
    {
      id: "4",
      clientName: "Delta Enterprises",
      status: "In Progress",
      contractCreatedAt: new Date("2024-01-10T16:45:00Z").toISOString(),
    },
    {
      id: "5",
      clientName: "Epsilon Group",
      status: "Completed",
      contractCreatedAt: new Date("2024-02-20T11:00:00Z").toISOString(),
    },
    {
      id: "6",
      clientName: "Zeta Systems",
      status: "Pending",
      contractCreatedAt: new Date("2024-03-05T13:20:00Z").toISOString(),
    },
    {
      id: "7",
      clientName: "Eta Technologies",
      status: "In Progress",
      contractCreatedAt: new Date("2023-09-18T08:00:00Z").toISOString(),
    },
    {
      id: "8",
      clientName: "Theta Innovations",
      status: "Completed",
      contractCreatedAt: new Date("2023-11-28T15:55:00Z").toISOString(),
    },
    {
      id: "9",
      clientName: "Iota Ventures",
      status: "Pending",
      contractCreatedAt: new Date("2024-01-03T10:30:00Z").toISOString(),
    },
    {
      id: "10",
      clientName: "Kappa Limited",
      status: "In Progress",
      contractCreatedAt: new Date("2024-02-12T12:40:00Z").toISOString(),
    },
    {
      id: "11",
      clientName: "Lambda Holdings",
      status: "Completed",
      contractCreatedAt: new Date("2023-12-22T14:10:00Z").toISOString(),
    },
    {
      id: "12",
      clientName: "Lambda Holdings",
      status: "Completed",
      contractCreatedAt: new Date("2023-12-22T14:10:00Z").toISOString(),
    },
    {
      id: "13",
      clientName: "Lambda Holdings",
      status: "Completed",
      contractCreatedAt: new Date("2023-12-22T14:10:00Z").toISOString(),
    },
    {
      id: "14",
      clientName: "Lambda Holdings",
      status: "Completed",
      contractCreatedAt: new Date("2023-12-22T14:10:00Z").toISOString(),
    },
    {
      id: "14",
      clientName: "Lambda Holdings",
      status: "Completed",
      contractCreatedAt: new Date("2023-12-22T14:10:00Z").toISOString(),
    },
    {
      id: "14",
      clientName: "Lambda Holdings",
      status: "Completed",
      contractCreatedAt: new Date("2023-12-22T14:10:00Z").toISOString(),
    },
    {
      id: "14",
      clientName: "Lambda Holdings",
      status: "Completed",
      contractCreatedAt: new Date("2023-12-22T14:10:00Z").toISOString(),
    },
    {
      id: "14",
      clientName: "Lambda Holdings",
      status: "Completed",
      contractCreatedAt: new Date("2023-12-22T14:10:00Z").toISOString(),
    },
    {
      id: "14",
      clientName: "Lambda Holdings",
      status: "Completed",
      contractCreatedAt: new Date("2023-12-22T14:10:00Z").toISOString(),
    },
    {
      id: "14",
      clientName: "Lambda Holdings",
      status: "Completed",
      contractCreatedAt: new Date("2023-12-22T14:10:00Z").toISOString(),
    },
    {
      id: "14",
      clientName: "Lambda Holdings",
      status: "Completed",
      contractCreatedAt: new Date("2023-12-22T14:10:00Z").toISOString(),
    },
  ];

  // contracts = []

  const testContracts = contracts.map((contract) => ({
    ...contract,
    id: contract.id,
    contractCreatedAt: format(
      new Date(contract.contractCreatedAt),
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
        let backgroundColor = "";
        switch (params.value) {
          case "In Progress":
            backgroundColor = "#D4AC0D"; // Golden yellow
            break;
          case "Pending":
            backgroundColor = "#2ECC71"; // Green
            break;
          case "Completed":
            backgroundColor = "#3498DB"; // Blue
            break;
          case "Not Started":
            backgroundColor = "#E67E22"; // Orange
            break;
          default:
            backgroundColor = "#E0E0E0"; // Light gray for unknown statuses
        }

        return (
          <div
            style={{
              backgroundColor,
              borderRadius: 2,
              minWidth: { xs: "250px" },
              px: "10px",
              py: "4px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {params.value}
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
      <Box sx={contractWidgetStyle}>
        <p>No contracts found.</p>
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
        rows={testContracts}
        columns={columns}
        autoPageSize={true}
        onRowClick={handleRowClick}
      />
    </Box>
  );
};
