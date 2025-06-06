import { useParams } from "react-router-dom";
import MemberChat from "../MemberChat/Chat"; // Renamed from ChatInterface
import UserChat from "../MemberChat/UserChat"; // Import the new UserChat component
import { gql, useQuery, useMutation, useSubscription } from "@apollo/client";
import { useEffect, useState } from "react";

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
  subscription SubscribeToChat($data: ChatSubscriptionInput!) {
    subscribeToChat(data: $data) {
      id
      chatId
      content
      senderId
      senderType
      createdAt
    }
  }
`;

export const ChatDashboard = () => {
  const { id } = useParams();

  if (!id) {
    return <div>Chat ID is required</div>;
  }

  const { data, loading, error } = useQuery(GET_CHAT_BY_ID, {
    variables: { id },
  });

  const [createMessage] = useMutation(CREATE_MESSAGE);

  const { data: subscriptionData } = useSubscription(SUBSCRIBE_TO_CHAT, {
    variables: { data: { chatId: id } },
  });

  const [isSending, setIsSending] = useState(false);

  const sendMessage = async (content, senderType) => {
    setIsSending(true);
    try {
      await createMessage({
        variables: {
          data: {
            chatId: id,
            content,
            senderType,
          },
        },
      });
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const onNewMessage = (callback) => {
    if (subscriptionData) {
      callback(subscriptionData.subscribeToChat);
    }
  };

  useEffect(() => {
    if (subscriptionData) {
      onNewMessage(subscriptionData.subscribeToChat);
    }
  }, [subscriptionData, onNewMessage]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Render UserChat for user-specific chat functionality
  return (
    <>
      <UserChat
        messages={data?.getChatById?.messages || []}
        sendMessage={sendMessage}
        onNewMessage={onNewMessage}
        isSending={isSending}
        setIsSending={setIsSending}
      />
      <MemberChat
        messages={data?.getChatById?.messages || []}
        sendMessage={sendMessage}
        onNewMessage={onNewMessage}
        isSending={isSending}
        setIsSending={setIsSending}
      />
    </>
  );
};
