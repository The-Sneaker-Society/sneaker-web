import { gql } from "@apollo/client";

// Companion mutations for plan-escrow-dispute §5. Backend branch
// (chicago feature/escrow-dispute) had not landed these resolvers at the
// time of writing, so arg names/shapes below are guesses following the
// plan's names and the existing cancelContract(contractId, reason) convention.
export const START_WORK = gql`
  mutation StartWork($contractId: ID!) {
    startWork(contractId: $contractId)
  }
`;

export const UPLOAD_UNBOXING_PHOTOS = gql`
  mutation UploadUnboxingPhotos($contractId: ID!, $keys: [String!]!) {
    uploadUnboxingPhotos(contractId: $contractId, keys: $keys)
  }
`;

export const UPLOAD_PACKAGING_PHOTOS = gql`
  mutation UploadPackagingPhotos($contractId: ID!, $keys: [String!]!) {
    uploadPackagingPhotos(contractId: $contractId, keys: $keys)
  }
`;

export const FLAG_CONTRACT = gql`
  mutation FlagContract($contractId: ID!, $reason: String!) {
    flagContract(contractId: $contractId, reason: $reason)
  }
`;

export const CONFIRM_RECEIPT = gql`
  mutation ConfirmReceipt($contractId: ID!) {
    confirmReceipt(contractId: $contractId)
  }
`;

export const MARK_WORK_COMPLETE = gql`
  mutation MarkWorkComplete($contractId: ID!) {
    markWorkComplete(contractId: $contractId)
  }
`;

export const MARK_RETURN_SHIPPED = gql`
  mutation MarkReturnShipped($contractId: ID!) {
    markReturnShipped(contractId: $contractId)
  }
`;

export const UPLOAD_RETURN_PACKAGING_PHOTOS = gql`
  mutation UploadReturnPackagingPhotos($contractId: ID!, $keys: [String!]!) {
    uploadReturnPackagingPhotos(contractId: $contractId, keys: $keys)
  }
`;
