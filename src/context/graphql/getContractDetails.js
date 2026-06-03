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
      chatId
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
      declaredMarketValue
      boxIncluded
      shoeDetails {
        brand
        model
        color
        size
        material
        soleCondition
        photos {
          leftSide { url note }
          rightSide { url note }
          topView { url note }
          bottomView { url note }
          frontView { url note }
          backView { url note }
          inside { url note }
          tongue { url note }
          box { url note }
          other { url note }
        }
      }
      repairDetails {
        clientNotes
        memberNotes
      }
      proposedPrice
      price
      status
      inboundTracking {
        carrier
        trackingNumber
      }
      outboundTracking {
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