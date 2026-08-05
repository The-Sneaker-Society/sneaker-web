import { gql, useQuery, useMutation, useSubscription } from "@apollo/client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const GET_CHAT_BY_ID = gql`
  query GetChatById($id: ID!) {
    getChatById(chatId: $id) {
      id
      name
      contractId
      member {
        id
        firstName
        lastName
      }
      user {
        id
        email
      }
      messages {
        id
        content
        senderId
        senderType
        type
        metadata {
          price
          checkoutUrl
          status
        }
        createdAt
      }
    }
  }
`;

const CREATE_MESSAGE = gql`
  mutation CreateMessage($data: CreateMessageInput!) {
    createMessage(data: $data) {
      id
      chatId
      content
      senderId
      senderType
      type
      metadata {
        price
        checkoutUrl
        status
      }
      createdAt
    }
  }
`;

const PROPOSE_PRICE = gql`
  mutation ProposePriceInChat($contractId: ID!, $price: Float!) {
    proposePriceInChat(contractId: $contractId, price: $price) {
      id
      chatId
      content
      senderId
      senderType
      type
      metadata {
        price
        checkoutUrl
        status
      }
      createdAt
    }
  }
`;

const SUBSCRIBE_TO_CHAT = gql`
  subscription SubscribeToChat($data: SubscribeToChatInput!) {
    subscribeToChat(data: $data) {
      id
      chatId
      senderId
      content
      senderType
      type
      metadata {
        price
        checkoutUrl
        status
      }
      createdAt
    }
  }
`;

const MESSAGE_UPDATED = gql`
  subscription MessageUpdated($data: SubscribeToChatInput!) {
    messageUpdated(data: $data) {
      id
      chatId
      senderId
      content
      senderType
      type
      metadata {
        price
        checkoutUrl
        status
      }
      createdAt
    }
  }
`;

/**
 * Shared hook for both ChatDashboardMember and ChatDashboardUser.
 * @param {string} senderType - "MEMBER" or "USER"
 */
const useChatDashboard = (senderType) => {
  const { id } = useParams();

  const { data, loading, error } = useQuery(GET_CHAT_BY_ID, {
    variables: { id },
    skip: !id,
  });

  const [createMessage] = useMutation(CREATE_MESSAGE);
  const [proposePriceMutation] = useMutation(PROPOSE_PRICE);

  const { data: subscriptionData } = useSubscription(SUBSCRIBE_TO_CHAT, {
    variables: { data: { chatId: id } },
    skip: !id,
  });

  const { data: updateData } = useSubscription(MESSAGE_UPDATED, {
    variables: { data: { chatId: id } },
    skip: !id,
  });

  const [isSending, setIsSending] = useState(false);
  const [isProposing, setIsProposing] = useState(false);
  const [messages, setMessages] = useState([]);

  // Merge initial query messages, deduped and sorted by createdAt
  useEffect(() => {
    if (data?.getChatById?.messages) {
      setMessages((prev) => {
        const merged = [...prev];
        for (const msg of data.getChatById.messages) {
          if (!merged.some((m) => m.id === msg.id)) merged.push(msg);
        }
        return merged.sort((a, b) => Number(a.createdAt) - Number(b.createdAt));
      });
    }
  }, [data]);

  // Append incoming subscription messages, deduped
  useEffect(() => {
    if (subscriptionData?.subscribeToChat) {
      setMessages((prev) => {
        const incoming = subscriptionData.subscribeToChat;
        if (prev.some((m) => m.id === incoming.id)) return prev;
        return [...prev, incoming];
      });
    }
  }, [subscriptionData]);

  // Update existing messages when their status changes (e.g. superseded, paid)
  useEffect(() => {
    if (updateData?.messageUpdated) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === updateData.messageUpdated.id ? updateData.messageUpdated : m,
        ),
      );
    }
  }, [updateData]);

  const sendMessage = async (content) => {
    setIsSending(true);
    try {
      await createMessage({
        variables: { data: { chatId: id, content, senderType } },
      });
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const proposePrice = async (price) => {
    const contractId = data?.getChatById?.contractId;
    if (!contractId) throw new Error("No contract associated with this chat");
    setIsProposing(true);
    try {
      await proposePriceMutation({
        variables: { contractId, price },
      });
    } catch (err) {
      console.error("Error proposing price:", err);
      throw err;
    } finally {
      setIsProposing(false);
    }
  };

  return {
    chatId: id,
    chat: data?.getChatById,
    loading,
    error,
    messages,
    isSending,
    isProposing,
    setIsSending,
    sendMessage,
    proposePrice,
  };
};

export default useChatDashboard;
