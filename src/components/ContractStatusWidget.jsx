import React from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import { gql, useQuery } from "@apollo/client";

const GET_MEMBER_CONTRACT_STATUS = gql`
  query GetMemberContractStatus {
    memberContractStatus {
      finished
      notStarted
      started
    }
  }
`;

export default function ContractStatusWidget() {
  const { data, loading, error } = useQuery(GET_MEMBER_CONTRACT_STATUS);

  const ContractStatueAmount = ({ name, amount }) => (
    <Box sx={{ textAlign: "center", margin: "10px", flex: 1, minWidth: 0 }}>
      <Typography sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" }, fontWeight: "bold" }}>
        {amount}
      </Typography>
      <Typography sx={{ fontSize: { xs: "0.85rem", sm: "1rem", md: "1.25rem" } }}>
        {name}
      </Typography>
    </Box>
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-around",
          alignItems: "center",
          width: "100%",
          height: "100%",
          bgcolor: "black",
          color: "white",
          borderRadius: 2,
          border: "4px solid white",
          padding: "20px",
        }}
      >
        {[...Array(3)].map((_, index) => (
          <Box key={index} sx={{ textAlign: "center", margin: "10px", flex: 1, minWidth: 0 }}>
            <Skeleton variant="text" width={50} sx={{ mx: "auto", fontSize: { xs: "1.5rem", md: "2.5rem" } }} />
            <Skeleton variant="text" width={100} sx={{ mx: "auto", fontSize: { xs: "0.85rem", md: "1.25rem" } }} />
          </Box>
        ))}
      </Box>
    );
  }
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        alignItems: "center",
        width: "100%",
        height: "100%",
        bgcolor: "black",
        color: "white",
        borderRadius: 2,
        border: "4px solid white",
        padding: "20px",
      }}
    >
      <ContractStatueAmount
        name="Not Started"
        amount={data.memberContractStatus.notStarted}
      />
      <ContractStatueAmount
        name="In Progress"
        amount={data.memberContractStatus.started}
      />
      <ContractStatueAmount
        name="Completed"
        amount={data.memberContractStatus.finished}
      />
    </Box>
  );
}
