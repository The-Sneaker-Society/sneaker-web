import { gql } from "@apollo/client";

export const UPDATE_MEMBER = gql`
  mutation UpdateMember($data: UpdateMemberInput!) {
    updateMember(data: $data)
  }
`;

export const CHANGE_MEMBER_PASSWORD = gql`
  mutation ChangeMemberPassword($data: ChangeMemberPasswordInput!) {
    changeMemberPassword(data: $data) {
      success
      message
    }
  }
`;

export const CURRENT_MEMBER = gql`
  query CurrentMember {
    currentMember {
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
