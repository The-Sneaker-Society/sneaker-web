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
    <Box sx={{ textAlign: "center", margin: "10px" }}>
      <Typography variant="h2">{amount}</Typography>
      <Typography variant="h4">{name}</Typography>
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
          <Box key={index} sx={{ textAlign: "center", margin: "10px" }}>
            <Typography variant="h2">
              <Skeleton variant="text" width={50} />
            </Typography>
            <Typography variant="h4">
              <Skeleton variant="text" width={100} />
            </Typography>
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
