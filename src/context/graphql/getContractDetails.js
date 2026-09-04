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

export const CONTRACT_FULL_FIELDS = gql`
  fragment ContractFullFields on Contract {
    id
    orderRef
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
    shippingPreset
    shippingSpeed
    shippingFee
    insuranceFee
    insuranceDeclined
    signatureRequired
    selectedServiceMenuItem {
      id
      name
      price
    }
    unboxingPhotos
    completionPhotos
    inboundLabelUrl
    outboundLabelUrl
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
`;

export const CONTRACT_CHECKOUT_FIELDS = gql`
  fragment ContractCheckoutFields on Contract {
    id
    orderRef
    chatId
    status
    declaredMarketValue
    proposedPrice
    price
    shippingPreset
    shippingSpeed
    shippingFee
    insuranceFee
    insuranceDeclined
    signatureRequired
    selectedServiceMenuItem {
      id
      name
      price
    }
    shoeDetails {
      brand
      model
    }
      client {
        firstName
        lastName
        email
        phoneNumber
        addressLineOne
        addressLineTwo
        city
        state
        country
        zipcode
      }
  }
`;

export const GET_CONTRACT_BY_ID = gql`
  query GetContractById($id: ID!) {
    contractById(id: $id) {
      ...ContractFullFields
    }
  }
  ${CONTRACT_FULL_FIELDS}
`;

export const GET_CONTRACT_BY_ORDER_REF = gql`
  query GetContractByOrderRef($orderRef: String!) {
    contractById: contractByOrderRef(orderRef: $orderRef) {
      ...ContractFullFields
    }
  }
  ${CONTRACT_FULL_FIELDS}
`;
export const GET_CHECKOUT_CONTRACT = gql`
  query GetCheckoutContract($id: ID!) {
    contractById(id: $id) {
      ...ContractCheckoutFields
    }
  }
  ${CONTRACT_CHECKOUT_FIELDS}
`;

export const GET_CHECKOUT_BY_ORDER_REF = gql`
  query GetCheckoutByOrderRef($orderRef: String!) {
    contractById: contractByOrderRef(orderRef: $orderRef) {
      ...ContractCheckoutFields
    }
  }
  ${CONTRACT_CHECKOUT_FIELDS}
`; 