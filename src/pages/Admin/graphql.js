import { gql } from "@apollo/client";

export const GET_ADMIN_DISPUTE_QUEUE = gql`
  query GetAdminDisputeQueue($limit: Int, $offset: Int) {
    adminDisputeQueue(limit: $limit, offset: $offset) {
      total
      items {
        id
        orderRef
        status
        clientName
        clientId
        memberName
        memberId
        servicePrice
        declaredMarketValue
        disputeOpenedAt
        createdAt
        severityScore
      }
    }
  }
`;

export const GET_ADMIN_DISPUTE_DETAIL = gql`
  query GetAdminDisputeDetail($orderRef: String!) {
    adminDisputeDetail(orderRef: $orderRef) {
      contract {
        id
        orderRef
        status
        payoutStatus
        declaredMarketValue
        boxIncluded
        proposedPrice
        price
        shippingPreset
        shippingSpeed
        insuranceFee
        shippingFee
        taxFee
        insuranceDeclined
        signatureRequired
        inboundTracking {
          carrier
          trackingNumber
        }
        outboundTracking {
          carrier
          trackingNumber
        }
        inboundLabelUrl
        outboundLabelUrl
        unboxingPhotos
        packagingPhotos
        returnPackagingPhotos
        completionPhotos
        afterFormNotes
        createdAt
        shoeDetails {
          model
          color
          size
          material
          soleCondition
          year
          returnTimeframe
          odorLevel
          previousRepairs
          previousRepairsNotes
          photos {
            frontView { url note key }
            backView { url note key }
            inside { url note key }
            tongue { url note key }
            box { url note key }
            other { url note key }
          }
        }
        repairDetails {
          clientNotes
          memberNotes
        }
        member {
          id
          firstName
          lastName
          email
          phoneNumber
          businessName
          avatar
        }
        client {
          id
          firstName
          lastName
          email
          phoneNumber
          avatar
        }
        timeline {
          event
          date
          reason
          actor
          refundCents
        }
      }
      chatMessages {
        id
        chatId
        content
        senderId
        createdAt
        senderType
        type
        metadata {
          price
          status
        }
      }
      pnl {
        grossCollected
        servicePrice
        shippingFee
        insuranceFee
        taxFee
        payoutAmount
        platformFee
        actualLabelCost
        actualInsurancePremium
        estimatedStripeFee
        salesTaxRemittance
        totalOutflows
        netPlatformProfit
        netPlatformMarginPercent
        shippingSpread
        insuranceSpread
      }
    }
  }
`;

export const RESOLVE_DISPUTE_FOR_USER = gql`
  mutation ResolveDisputeForUser($contractId: ID!, $banMember: Boolean, $reason: String) {
    resolveDisputeForUser(contractId: $contractId, banMember: $banMember, reason: $reason)
  }
`;

export const RESOLVE_DISPUTE_FOR_MEMBER = gql`
  mutation ResolveDisputeForMember($contractId: ID!, $banUser: Boolean, $reason: String) {
    resolveDisputeForMember(contractId: $contractId, banUser: $banUser, reason: $reason)
  }
`;

export const RESOLVE_DISPUTE_INCONCLUSIVE = gql`
  mutation ResolveDisputeInconclusive(
    $contractId: ID!
    $refundCents: Int!
    $payoutCents: Int!
    $banBoth: Boolean
    $reason: String
  ) {
    resolveDisputeInconclusive(
      contractId: $contractId
      refundCents: $refundCents
      payoutCents: $payoutCents
      banBoth: $banBoth
      reason: $reason
    )
  }
`;
