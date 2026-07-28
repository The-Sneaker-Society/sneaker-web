import { gql } from "@apollo/client";

export const GET_VAULT_SUBMISSIONS = gql`
  query GetVaultSubmissions {
    vaultSubmissions {
      id title description category platforms mediaUrls thumbnailUrl
      status isApproved isFeatured publishedAt consentAccepted adminNotes
      createdAt updatedAt
      member { id firstName lastName businessName }
    }
  }
`;

export const GET_VAULT_SUBMISSION_BY_ID = gql`
  query GetVaultSubmissionById($id: ID!) {
    vaultSubmissionById(id: $id) {
      id title description category platforms mediaUrls thumbnailUrl
      status isApproved isFeatured publishedAt consentAccepted adminNotes
      createdAt updatedAt
      member { id firstName lastName businessName }
    }
  }
`;

export const GET_ADMIN_VAULT_QUEUE = gql`
  query GetAdminVaultQueue($status: String, $limit: Int, $offset: Int) {
    adminVaultQueue(status: $status, limit: $limit, offset: $offset) {
      items {
        id title description category platforms mediaUrls thumbnailUrl
        status isApproved isFeatured publishedAt consentAccepted adminNotes
        createdAt updatedAt
        member { id firstName lastName businessName }
      }
      totalCount hasMore nextOffset
    }
  }
`;

export const CREATE_VAULT_SUBMISSION = gql`
  mutation CreateVaultSubmission($data: CreateVaultSubmissionInput!) {
    createVaultSubmission(data: $data) {
      id title description category platforms mediaUrls thumbnailUrl
      status isApproved isFeatured publishedAt consentAccepted adminNotes
      createdAt updatedAt
      member { id firstName lastName businessName }
    }
  }
`;

export const UPDATE_VAULT_SUBMISSION = gql`
  mutation UpdateVaultSubmission($id: ID!, $data: UpdateVaultSubmissionInput!) {
    updateVaultSubmission(id: $id, data: $data) {
      id title description category status mediaUrls updatedAt
    }
  }
`;

export const DELETE_VAULT_SUBMISSION = gql`
  mutation DeleteVaultSubmission($id: ID!) {
    deleteVaultSubmission(id: $id)
  }
`;

export const APPROVE_VAULT_SUBMISSION = gql`
  mutation ApproveVaultSubmission($id: ID!, $notes: String) {
    approveVaultSubmission(id: $id, notes: $notes) {
      id status isApproved adminNotes
    }
  }
`;

export const REJECT_VAULT_SUBMISSION = gql`
  mutation RejectVaultSubmission($id: ID!, $notes: String!) {
    rejectVaultSubmission(id: $id, notes: $notes) {
      id status isApproved adminNotes
    }
  }
`;

export const FEATURE_VAULT_SUBMISSION = gql`
  mutation FeatureVaultSubmission($id: ID!, $featured: Boolean!) {
    featureVaultSubmission(id: $id, featured: $featured) {
      id isFeatured
    }
  }
`;

export const PUBLISH_VAULT_SUBMISSION = gql`
  mutation PublishVaultSubmission($id: ID!) {
    publishVaultSubmission(id: $id) {
      id status publishedAt
    }
  }
`;
