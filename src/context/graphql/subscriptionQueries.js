import { gql } from "@apollo/client";

// Query to get subscription details
export const GET_SUBSCRIPTION_DETAILS = gql`
  query GetSubscriptionDetails {
    subscriptionDetails {
      status
      currentPeriodEnd
      paymentMethod {
        brand
        last4
      }
    }
  }
`;

// Mutation to create a new subscription
export const CREATE_MEMBER_SUBSCRIPTION = gql`
  mutation CreateMemberSubscription {
    createMemberSubsctiprion
  }
`;

// Mutation to cancel a subscription
export const CANCEL_SUBSCRIPTION = gql`
  mutation CancelSubscription {
    cancelSubscription
  }
`;

// Mutation to pause a subscription
export const PAUSE_SUBSCRIPTION = gql`
  mutation PauseSubscription {
    pauseSubscription
  }
`;

// Mutation to reactivate a subscription
export const REACTIVATE_SUBSCRIPTION = gql`
  mutation ReactivateSubscription {
    reactivateSubscription
  }
`; 