import { gql } from "@apollo/client";

export const CURRENT_MEMBER = gql`
  query CurrentMember {
    currentMember {
      id
      email
      firstName
      stripeConnectAccountId
      stripeCustomerId
    }
  }
`;
