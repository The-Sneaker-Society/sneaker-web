import { gql } from "@apollo/client";

export const GET_GROUPS = gql`
  query GetGroups {
    getGroups {
      id
      name
      description
      avatar
      createdAt
      updatedAt
      createdBy {
        id
        firstName
        lastName
        email
      }
      admins {
        id
        firstName
        lastName
        email
      }
      members {
        id
        firstName
        lastName
        email
      }
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
      createdAt
      updatedAt
      createdBy {
        id
        firstName
        lastName
        email
      }
      admins {
        id
        firstName
        lastName
        email
      }
      members {
        id
        firstName
        lastName
        email
      }
    }
  }
`;