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
        disputeOpenedBy
        disputeOpenReason
        clientPriorDisputes
        memberPriorDisputes
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
        preDisputeStatus
        preDisputePayoutStatus
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
          brand
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
            leftSide { url note key }
            rightSide { url note key }
            topView { url note key }
            bottomView { url note key }
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
        }
        client {
          id
          firstName
          lastName
          email
          phoneNumber
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

export const DISMISS_DISPUTE = gql`
  mutation DismissDispute(
    $contractId: ID!
    $resumeStatus: String
    $banUser: Boolean
    $banMember: Boolean
    $reason: String
  ) {
    dismissDispute(
      contractId: $contractId
      resumeStatus: $resumeStatus
      banUser: $banUser
      banMember: $banMember
      reason: $reason
    )
  }
`;

export const MEMBER_OUTSTANDING_DEBT = gql`
  query MemberOutstandingDebt($memberId: ID!) {
    memberOutstandingDebt(memberId: $memberId)
  }
`;

export const CHARGE_MEMBER_DEBT = gql`
  mutation ChargeMemberDebt(
    $memberId: ID!
    $contractId: ID!
    $type: String
    $amountCents: Int!
    $reason: String
  ) {
    chargeMemberDebt(
      memberId: $memberId
      contractId: $contractId
      type: $type
      amountCents: $amountCents
      reason: $reason
    )
  }
`;
export const RESOLVE_DISPUTE_FOR_USER = gql`
  mutation ResolveDisputeForUser($contractId: ID!, $banMember: Boolean, $banUser: Boolean, $reason: String) {
    resolveDisputeForUser(contractId: $contractId, banMember: $banMember, banUser: $banUser, reason: $reason)
  }
`;

export const RESOLVE_DISPUTE_FOR_MEMBER = gql`
  mutation ResolveDisputeForMember($contractId: ID!, $banUser: Boolean, $banMember: Boolean, $reason: String) {
    resolveDisputeForMember(contractId: $contractId, banUser: $banUser, banMember: $banMember, reason: $reason)
  }
`;

export const RESOLVE_DISPUTE_INCONCLUSIVE = gql`
  mutation ResolveDisputeInconclusive(
    $contractId: ID!
    $refundCents: Int!
    $payoutCents: Int!
    $banBoth: Boolean
    $banUser: Boolean
    $banMember: Boolean
    $reason: String
  ) {
    resolveDisputeInconclusive(
      contractId: $contractId
      refundCents: $refundCents
      payoutCents: $payoutCents
      banBoth: $banBoth
      banUser: $banUser
      banMember: $banMember
      reason: $reason
    )
  }
`;

export const GET_ADMIN_CONTRACTS = gql`
  query GetAdminContracts($status: String, $search: String, $limit: Int, $offset: Int) {
    adminContracts(status: $status, search: $search, limit: $limit, offset: $offset) {
      total
      metrics {
        totalVolume
        totalPayouts
        totalNetProfit
        avgMarginPercent
        completedCount
        inFlightCount
        disputeCount
      }
      items {
        id
        orderRef
        status
        payoutStatus
        price
        shippingFee
        insuranceFee
        taxFee
        payoutAmount
        declaredMarketValue
        createdAt
        client {
          id
          firstName
          lastName
          email
        }
        member {
          id
          firstName
          lastName
          businessName
        }
        shoeDetails {
          brand
          model
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
  }
`;

export const GET_ADMIN_CONTRACT_DETAIL = gql`
  query GetAdminContractDetail($orderRef: String!) {
    contractByOrderRef(orderRef: $orderRef) {
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
        brand
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
          leftSide { url note key }
          rightSide { url note key }
          topView { url note key }
          bottomView { url note key }
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
      }
      client {
        id
        firstName
        lastName
        email
        phoneNumber
      }
      timeline {
        event
        date
        reason
        actor
        refundCents
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
