import { gql } from "@apollo/client";

export const GET_CONTRACT_STATUS_COUNTS = gql`
  query GetContractStatusCounts {
    contractStatusCounts {
      notStarted
      inProgress
      done
    }
  }
`;
