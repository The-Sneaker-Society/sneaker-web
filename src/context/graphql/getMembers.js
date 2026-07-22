import { gql } from "@apollo/client";

export const GET_DISCOVER_MEMBERS = gql`
  query GetDiscoverMembers($limit: Int, $offset: Int) {
    getDiscoverMembers(limit: $limit, offset: $offset) {
      items {
        id
        firstName
        lastName
        businessName
        state
        isActive
        subscriptionStatus
      }
      totalCount
      hasMore
      nextOffset
    }
  }
`;

// Pending backend implementation of follow relationship on Member model
export const FOLLOW_MEMBER = gql`
  mutation FollowMember($memberId: ID!) {
    followMember(memberId: $memberId)
  }
`;

export const UNFOLLOW_MEMBER = gql`
  mutation UnfollowMember($memberId: ID!) {
    unfollowMember(memberId: $memberId)
  }
`;
