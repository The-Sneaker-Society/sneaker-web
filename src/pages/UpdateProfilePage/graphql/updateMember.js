import { gql } from "@apollo/client";

export const UPDATE_MEMBER = gql`
  mutation UpdateMember($data: UpdateMemberInput!) {
    updateMember(data: $data) {
      id
      email
      firstName
      lastName
      addressLineOne
      addressLineTwo
      zipcode
      state
      phoneNumber
    }
  }
`;
