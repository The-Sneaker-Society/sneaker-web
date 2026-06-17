import { gql } from "@apollo/client";

export const GET_MY_SOCIETY_FEED = gql`
  query GetMySocietyFeed($limit: Int, $offset: Int) {
    getMySocietyFeed(limit: $limit, offset: $offset) {
      items {
        id
        content
        mediaUrls
        mediaType
        likeCount
        isLikedByMe
        commentCount
        shareCount
        createdAt
        member {
          id
          firstName
          lastName
          businessName
        }
      }
      hasMore
      nextOffset
    }
  }
`;

export const GET_POST_COMMENTS = gql`
  query GetPostComments($postId: ID!, $limit: Int, $offset: Int) {
    getPostComments(postId: $postId, limit: $limit, offset: $offset) {
      items {
        id
        content
        createdAt
        member {
          id
          firstName
          lastName
          businessName
        }
      }
      hasMore
      nextOffset
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($data: CreatePostInput!) {
    createPost(data: $data) {
      id
      content
      mediaUrls
      mediaType
      likeCount
      isLikedByMe
      commentCount
      shareCount
      createdAt
      member {
        id
        firstName
        lastName
        businessName
      }
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId)
  }
`;

export const UNLIKE_POST = gql`
  mutation UnlikePost($postId: ID!) {
    unlikePost(postId: $postId)
  }
`;

export const SHARE_POST = gql`
  mutation SharePost($postId: ID!) {
    sharePost(postId: $postId)
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($postId: ID!, $content: String!) {
    addComment(postId: $postId, content: $content) {
      id
      content
      createdAt
      member {
        id
        firstName
        lastName
        businessName
      }
    }
  }
`;
