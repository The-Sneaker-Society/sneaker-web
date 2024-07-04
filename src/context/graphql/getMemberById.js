import { gql } from '@apollo/client';

export const CURRENT_MEMBER = gql`
  query CurrentMember {
    currentMember {
      id
      firstName
      lastName
      email
    }
  }
`;
