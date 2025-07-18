import { gql } from "@apollo/client";

export const GET_CONTRACT_DETAILS = gql`
  query GetContractDetails($contractId: ID!) {
    contractDetails(contractId: $contractId) {
      id
      status
      proposedPrice
      client {
        id
        firstName
        lastName
        address {
          street
          city
          state
          zipCode
        }
      }
      shipping {
        trackingNumber
        carrier
      }
      sneakerDetails {
        brand
        model
        color
        size
        material
        soleCondition
      }
      repairDetails {
        clientNotes
      }
      memberNotes
    }
  }
`;

export const GET_CONTRACT_BY_ID = gql`
  query GetContractById($id: ID!) {
    contractById(id: $id) {
      id
      client {
        firstName
        lastName
        email
      }
      member {
        firstName
        lastName
        email
      }
      shoeDetails {
        brand
        model
        color
        size
      }
      repairDetails {
        clientNotes
        memberNotes
      }
      proposedPrice
      price
      status
      trackingNumber {
        carrier
        trackingNumber
      }
      timeline {
        event
        date
      }
      shippingCarrier
      paymentStatus
      createdAt
      updatedAt
    }
  }
`; 