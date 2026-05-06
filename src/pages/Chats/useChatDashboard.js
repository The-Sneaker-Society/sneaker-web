import { gql, useQuery, useMutation, useSubscription } from "@apollo/client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const GET_CHAT_BY_ID = gql`
  query GetChatById($id: ID!) {
    getChatById(chatId: $id) {
      id
      name
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

  const { data: subscriptionData } = useSubscription(SUBSCRIBE_TO_CHAT, {
    variables: { data: { chatId: id } },
    skip: !id,
  });

  const [isSending, setIsSending] = useState(false);
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

  return {
    chatId: id,
    chat: data?.getChatById,
    loading,
    error,
    messages,
    isSending,
    setIsSending,
    sendMessage,
  };
};

export default useChatDashboard;
