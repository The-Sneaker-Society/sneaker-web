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