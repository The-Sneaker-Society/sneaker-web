import * as React from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Chip, Skeleton, Box } from '@mui/material';

const statusColors = {
  Pending: 'warning',
  Completed: 'success',
  Cancelled: 'error',
  InProgress: 'info',
  // Add more statuses as needed
};

const columns = [
  { field: 'shoeName', headerName: 'Shoe Name', flex: 1, sortable: true },
  {
    field: 'status',
    headerName: 'Status',
    flex: 1,
    sortable: true,
    renderCell: (params) => (
      <Chip
        label={params.value}
        color={statusColors[params.value] || 'default'}
        size="small"
        sx={{ borderRadius: 2, fontWeight: 500, textTransform: 'capitalize' }}
      />
    ),
  },
  { field: 'createdAt', headerName: 'Created At', flex: 1, sortable: true },
  { field: 'memberName', headerName: 'Member Name', flex: 1, sortable: true },
];

// Example rows (replace with real data as needed)
const rows = [
  { id: 1, shoeName: 'Air Max 90', status: 'Pending', createdAt: '2025-08-01', memberName: 'Alex Yates' },
  { id: 2, shoeName: 'Jordan 1', status: 'Completed', createdAt: '2025-07-28', memberName: 'Sam Smith' },
];


const ContractsDataTable = ({ data = rows, onSelectionModelChange, selectionModel, loading = false }) => {
  if (loading) {
    // Table-like skeleton for loading state
    return (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', bgcolor: 'background.paper'}}>
          {/* Table header skeleton */}
          <Box sx={{ display: 'flex', mb: 1 }}>
            <Skeleton variant="rectangular" width="25%" height={32} sx={{ mr: 2, borderRadius: 1 }} />
            <Skeleton variant="rectangular" width="15%" height={32} sx={{ mr: 2, borderRadius: 1 }} />
            <Skeleton variant="rectangular" width="25%" height={32} sx={{ mr: 2, borderRadius: 1 }} />
            <Skeleton variant="rectangular" width="25%" height={32} sx={{ borderRadius: 1 }} />
          </Box>
          {/* Table rows skeleton */}
          {[...Array(5)].map((_, i) => (
            <Box key={i} sx={{ display: 'flex', mb: 1 }}>
              <Skeleton variant="rectangular" width="25%" height={28} sx={{ mr: 2, borderRadius: 1 }} />
              <Skeleton variant="rectangular" width="15%" height={28} sx={{ mr: 2, borderRadius: 1 }} />
              <Skeleton variant="rectangular" width="25%" height={28} sx={{ mr: 2, borderRadius: 1 }} />
              <Skeleton variant="rectangular" width="25%" height={28} sx={{ borderRadius: 1 }} />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        sortingOrder={["asc", "desc"]}
        autoHeight={false}
        sx={{ background: 'transparent', border: 'none', color: 'inherit' }}
      />
    </div>
  );
};

export default ContractsDataTable;
