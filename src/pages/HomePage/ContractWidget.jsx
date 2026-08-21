import React, { useMemo, useState } from "react";
import {
  Box,
  Checkbox,
  Chip,
  IconButton,
  Pagination,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useColors } from "../../theme/colors";

const initialContracts = [
  {
    id: 1,
    client: "Richard Cochechagua",
    status: "In Progress",
    date: "01/24/2023",
    selected: false,
  },
  {
    id: 2,
    client: "Gerardo Delao",
    status: "Done",
    date: "01/04/2023",
    selected: false,
  },
  {
    id: 3,
    client: "Kyle Desmond",
    status: "Complete",
    date: "02/24/2023",
    selected: false,
  },
  {
    id: 4,
    client: "Alanis Yates",
    status: "Not Started",
    date: "08/19/2023",
    selected: false,
  },
  {
    id: 5,
    client: "Alanis Yates",
    status: "Not Started",
    date: "08/19/2023",
    selected: false,
  },
  {
    id: 6,
    client: "Kyle Desmond",
    status: "Complete",
    date: "02/24/2023",
    selected: false,
  },
  {
    id: 7,
    client: "New Client",
    status: "In Review",
    date: "03/01/2023",
    selected: false,
  },
  {
    id: 11,
    client: "Richard Cochechagua",
    status: "In Progress",
    date: "01/24/2023",
    selected: false,
  },
  {
    id: 21,
    client: "Gerardo Delao",
    status: "Done",
    date: "01/04/2023",
    selected: false,
  },
  {
    id: 31,
    client: "Kyle Desmond",
    status: "Complete",
    date: "02/24/2023",
    selected: false,
  },
  {
    id: 41,
    client: "Alanis Yates",
    status: "Not Started",
    date: "08/19/2023",
    selected: false,
  },
  {
    id: 51,
    client: "Alanis Yates",
    status: "Not Started",
    date: "08/19/2023",
    selected: false,
  },
  {
    id: 61,
    client: "Kyle Desmond",
    status: "Complete",
    date: "02/24/2023",
    selected: false,
  },
  {
    id: 17,
    client: "New Client",
    status: "In Review",
    date: "03/01/2023",
    selected: false,
  },
  {
    id: 100,
    client: "Sarah Lee",
    status: "In Progress",
    date: "04/15/2023",
    selected: false,
  },
  {
    id: 101,
    client: "James Sullivan",
    status: "Not Started",
    date: "05/21/2023",
    selected: false,
  },
  {
    id: 102,
    client: "Michael Johnson",
    status: "Done",
    date: "06/30/2023",
    selected: false,
  },
  {
    id: 103,
    client: "Amanda Robertson",
    status: "Complete",
    date: "07/18/2023",
    selected: false,
  },
  {
    id: 104,
    client: "Emily Watson",
    status: "In Review",
    date: "08/05/2023",
    selected: false,
  },
  {
    id: 105,
    client: "Emily Watson",
    status: "In Review",
    date: "08/05/2023",
    selected: false,
  },
  {
    id: 106,
    client: "Emily Watson",
    status: "In Review",
    date: "08/05/2023",
    selected: false,
  },
  {
    id: 107,
    client: "Emily Watson",
    status: "In Review",
    date: "08/05/2023",
    selected: false,
  },
];

const getStatusChipProps = (status) => {
  const statusMap = {
    "In Progress": {
      color: "warning",
      label: "In Progress",
    },
    Done: {
      color: "success",
      label: "Done",
    },
    Complete: {
      color: "info",
      label: "Complete",
    },
    "Not Started": {
      color: "error",
      label: "Not Started",
    },
    "In Review": {
      color: "secondary",
      label: "In Review",
    },
  };

  return (
    statusMap[status] ?? {
      color: "default",
      label: status,
    }
  );
};

function ContractWidget() {
  const [contracts, setContracts] = useState(initialContracts);
  const [currentPage, setCurrentPage] = useState(1);

  const theme = useTheme();
  const colors = useColors();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const contractsPerPage = isSmallScreen ? 6 : 20;
  const totalPages = Math.ceil(contracts.length / contractsPerPage);

  const currentContracts = useMemo(() => {
    const firstContractIndex = (currentPage - 1) * contractsPerPage;
    const lastContractIndex = firstContractIndex + contractsPerPage;

    return contracts.slice(firstContractIndex, lastContractIndex);
  }, [contracts, contractsPerPage, currentPage]);

  const allContractsSelected =
    contracts.length > 0 && contracts.every((contract) => contract.selected);

  const someContractsSelected =
    contracts.some((contract) => contract.selected) && !allContractsSelected;

  const handleSelectAll = (event) => {
    const selected = event.target.checked;

    setContracts((currentContractsState) =>
      currentContractsState.map((contract) => ({
        ...contract,
        selected,
      })),
    );
  };

  const handleSelectSingle = (id) => {
    setContracts((currentContractsState) =>
      currentContractsState.map((contract) =>
        contract.id === id
          ? { ...contract, selected: !contract.selected }
          : contract,
      ),
    );
  };

  const handlePaginationChange = (_, page) => {
    setCurrentPage(page);
  };

  return (
    <Box
      sx={{
        bgcolor: colors.surfaceBg,
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        color: colors.textPrimary,
        overflow: "hidden",
      }}
    >
      <Stack
        alignItems={{ xs: "flex-start", sm: "center" }}
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        spacing={2}
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          px: { xs: 2, sm: 3 },
          py: 2,
        }}
      >
        <Typography fontWeight={700} variant="h5">
          Contracts ({contracts.length} total)
        </Typography>

        <Typography color={colors.textSecondary} variant="body2">
          Manage client service agreements and job progress.
        </Typography>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "auto minmax(0, 1fr) auto",
            sm: "auto minmax(160px, 1.5fr) minmax(130px, 1fr) minmax(110px, 0.8fr) auto",
          },
          gap: 2,
          alignItems: "center",
          borderBottom: 1,
          borderColor: "divider",
          color: colors.textSecondary,
          px: { xs: 2, sm: 3 },
          py: 1.5,
        }}
      >
        <Checkbox
          checked={allContractsSelected}
          color="primary"
          indeterminate={someContractsSelected}
          inputProps={{ "aria-label": "Select all contracts" }}
          onChange={handleSelectAll}
          size="small"
          sx={{ p: 0 }}
        />

        <Typography fontWeight={700} variant="body2">
          Client
        </Typography>

        {!isSmallScreen && (
          <Typography fontWeight={700} variant="body2">
            Status
          </Typography>
        )}

        {!isSmallScreen && (
          <Typography fontWeight={700} variant="body2">
            Date
          </Typography>
        )}

        <Box />
      </Box>

      <Stack divider={<Box sx={{ borderTop: 1, borderColor: "divider" }} />}>
        {currentContracts.map((contract) => {
          const statusChip = getStatusChipProps(contract.status);

          return (
            <Box
              key={contract.id}
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "auto minmax(0, 1fr) auto",
                  sm: "auto minmax(160px, 1.5fr) minmax(130px, 1fr) minmax(110px, 0.8fr) auto",
                },
                gap: 2,
                alignItems: "center",
                px: { xs: 2, sm: 3 },
                py: 1.5,
                transition: theme.transitions.create("background-color", {
                  duration: theme.transitions.duration.shortest,
                }),
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <Checkbox
                checked={contract.selected}
                color="primary"
                inputProps={{
                  "aria-label": `Select ${contract.client}'s contract`,
                }}
                onChange={() => handleSelectSingle(contract.id)}
                size="small"
                sx={{ p: 0 }}
              />

              <Box sx={{ minWidth: 0 }}>
                <Typography noWrap fontWeight={600} variant="body2">
                  {contract.client}
                </Typography>

                {isSmallScreen && (
                  <Stack
                    alignItems="center"
                    direction="row"
                    spacing={1}
                    sx={{ mt: 0.75 }}
                  >
                    <Chip
                      color={statusChip.color}
                      label={statusChip.label}
                      size="small"
                    />

                    <Typography color={colors.textSecondary} variant="caption">
                      {contract.date}
                    </Typography>
                  </Stack>
                )}
              </Box>

              {!isSmallScreen && (
                <Chip
                  color={statusChip.color}
                  label={statusChip.label}
                  size="small"
                />
              )}

              {!isSmallScreen && (
                <Typography color={colors.textSecondary} variant="body2">
                  {contract.date}
                </Typography>
              )}

              <IconButton
                aria-label={`More actions for ${contract.client}`}
                size="small"
                sx={{
                  color: colors.textSecondary,
                  "&:hover": {
                    bgcolor: "action.hover",
                    color: colors.textPrimary,
                  },
                }}
              >
                <MoreHorizIcon fontSize="small" />
              </IconButton>
            </Box>
          );
        })}
      </Stack>

      {totalPages > 1 && (
        <Box
          sx={{
            borderTop: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "center",
            p: 2,
          }}
        >
          <Pagination
            color="primary"
            count={totalPages}
            onChange={handlePaginationChange}
            page={currentPage}
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
}

export default ContractWidget;
