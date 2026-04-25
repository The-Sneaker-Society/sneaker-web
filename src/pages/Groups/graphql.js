import { gql } from "@apollo/client";

export const GROUP_MEMBER_FIELDS = gql`
  fragment GroupMemberFields on Member {
    id
    firstName
    lastName
    email
  }
`;

export const POST_COMMENT_FIELDS = gql`
  fragment PostCommentFields on PostComment {
    id
    content
    createdAt
    author {
      ...GroupMemberFields
    }
  }
  ${GROUP_MEMBER_FIELDS}
`;

export const POST_FIELDS = gql`
  fragment PostFields on Post {
    id
    groupId
    content
    images
    shares
    createdAt
    commentCount
    author {
      ...GroupMemberFields
    }
    likes {
      id
    }
    commentsPage(limit: $commentLimit, offset: 0) {
      items {
        ...PostCommentFields
      }
      totalCount
      hasMore
      nextOffset
    }
  }
  ${POST_COMMENT_FIELDS}
`;

export const GET_GROUP = gql`
  query GetGroup($id: ID!) {
    getGroup(id: $id) {
      id
      name
      description
      avatar
      createdAt
      createdBy {
        ...GroupMemberFields
      }
      admins {
        ...GroupMemberFields
      }
      members {
        ...GroupMemberFields
      }
    }
  }
  ${GROUP_MEMBER_FIELDS}
`;

export const GET_POSTS_BY_GROUP = gql`
  query GetPostsByGroup(
    $groupId: ID!
    $limit: Int = 10
    $offset: Int = 0
    $commentLimit: Int = 3
  ) {
    getPostsByGroup(groupId: $groupId, limit: $limit, offset: $offset) {
      items {
        ...PostFields
      }
      totalCount
      hasMore
      nextOffset
    }
  }
  ${POST_FIELDS}
`;

export const JOIN_GROUP = gql`
  mutation JoinGroup($groupId: ID!) {
    joinGroup(groupId: $groupId) {
      id
      members {
        ...GroupMemberFields
      }
    }
  }
  ${GROUP_MEMBER_FIELDS}
`;

export const LEAVE_GROUP = gql`
  mutation LeaveGroup($groupId: ID!) {
    leaveGroup(groupId: $groupId) {
      id
      members {
        ...GroupMemberFields
      }
      admins {
        id
      }
    }
  }
  ${GROUP_MEMBER_FIELDS}
`;

export const CREATE_POST = gql`
  mutation CreatePost($groupId: ID!, $content: String!, $images: [String!]) {
    createPost(groupId: $groupId, content: $content, images: $images) {
      id
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
        ...GroupMemberFields
      }
    }
  }
  ${GROUP_MEMBER_FIELDS}
`;

export const DELETE_POST = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;