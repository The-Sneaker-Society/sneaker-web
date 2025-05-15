import { gql } from "@apollo/client";

const GET_CONTRACT_BY_ID = gql`
  query GetContractById($id: ID!) {
    contractById(id: $id) {
      id
      client {
        name
        email
      }
      member {
        name
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