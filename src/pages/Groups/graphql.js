import { gql } from "@apollo/client";

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
      createdAt
    }
  }
`;

export const GET_POSTS_BY_GROUP = gql`
  query GetPostsByGroup($groupId: ID!) {
    getPostsByGroup(groupId: $groupId) {
      id
      content
      images
      shares
      createdAt
      author {
        id
        firstName
        lastName
        email
      }
      likes {
        id
      }
      comments {
        id
        content
        createdAt
        author {
          id
          firstName
          lastName
          email
        }
      }
    }
  }
`;

export const JOIN_GROUP = gql`
  mutation JoinGroup($groupId: ID!) {
    joinGroup(groupId: $groupId) {
      id
      members {
        id
        firstName
        lastName
        email
      }
      createdBy {
        id
      }
      admins {
        id
      }
    }
  }
`;

export const LEAVE_GROUP = gql`
  mutation LeaveGroup($groupId: ID!) {
    leaveGroup(groupId: $groupId) {
      id
      members {
        id
        firstName
        lastName
        email
      }
      createdBy {
        id
      }
      admins {
        id
      }
    }
  }
`;

export const UPDATE_GROUP = gql`
  mutation UpdateGroup(
    $id: ID!
    $name: String
    $description: String
    $avatar: String
    $memberIds: [ID!]
  ) {
    updateGroup(
      id: $id
      name: $name
      description: $description
      avatar: $avatar
      memberIds: $memberIds
    ) {
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
      createdAt
    }
  }
`;

export const DELETE_GROUP = gql`
  mutation DeleteGroup($id: ID!) {
    deleteGroup(id: $id)
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($groupId: ID!, $content: String!, $images: [String!]) {
    createPost(groupId: $groupId, content: $content, images: $images) {
      id
      content
      images
      shares
      createdAt
      author {
        id
        firstName
        lastName
        email
      }
      likes {
        id
      }
      comments {
        id
        content
        createdAt
        author {
          id
          firstName
          lastName
          email
        }
      }
    }
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
      }
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($postId: ID!, $content: String!) {
    addComment(postId: $postId, content: $content) {
      id
      content
      createdAt
      author {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;
