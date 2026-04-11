import { gql } from '@apollo/client';

export const GET_USER_IMAGES = gql`
  query GetUserImages {
    getUserImages {
      id
      userId
      key
      filename
      fileType
      createdAt
      url
    }
  }
`;

export const REQUEST_UPLOAD = gql`
  mutation RequestImageUpload($filename: String!, $fileType: String) {
    requestImageUpload(filename: $filename, fileType: $fileType) {
      uploadUrl
      key
    }
  }
`;

export const CONFIRM_UPLOAD = gql`
  mutation ConfirmImageUpload($key: String!, $filename: String, $fileType: String) {
    confirmImageUpload(key: $key, filename: $filename, fileType: $fileType) {
      id
      key
      filename
      fileType
      createdAt
      url
    }
  }
`;

export const UPDATE_IMAGE = gql`
  mutation UpdateImage($id: ID!, $filename: String, $fileType: String) {
    updateImage(id: $id, filename: $filename, fileType: $fileType) {
      id
      filename
      fileType
    }
  }
`;

export const DELETE_IMAGE = gql`
  mutation DeleteImage($id: ID!) {
    deleteImage(id: $id)
  }
`;
