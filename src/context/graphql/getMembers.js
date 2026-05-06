import { gql } from "@apollo/client";

export const GET_DISCOVER_MEMBERS = gql`
  query GetDiscoverMembers {
    members {
      id
      firstName
      lastName
      businessName
      state
    }
  }
`;
