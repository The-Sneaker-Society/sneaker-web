import { gql } from "@apollo/client";

export const GET_GROUPS = gql`
  query GetGroups {
    getGroups {
      id
      name
      description
      avatar
      members {
        id
      }
      createdAt
    }
  }
`;

export const GET_GROUP = gql`
  query GetGroup($id: ID!) {
    getGroup(id: $id) {
      id
      name
      description
      avatar
      members {
        id
        firstName
        lastName
        email
      }
      createdAt
    }
  }
`;