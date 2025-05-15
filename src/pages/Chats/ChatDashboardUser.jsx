import { useParams } from "react-router-dom";
import { gql, useQuery, useMutation, useSubscription } from "@apollo/client";
import { useEffect, useState } from "react";
import Chat from "../MemberChat/Chat";
import { useSneakerUser } from "../../context/UserContext";

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

export const ChatDashboardUser = () => {
  const { id } = useParams();
  const { user: currentUser, loading: userLoading } = useSneakerUser();

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

  const sendMessage = async (content) => {
    setIsSending(true);
    try {
      await createMessage({
        variables: {
          data: {
            chatId: id,
            content,
            senderType: "USER",
          },
        },
      });
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (data?.getChatById?.messages) {
      setMessages((prevMessages) => {
        const uniqueMessages = data.getChatById.messages.filter(
          (newMessage) => !prevMessages.some((msg) => msg.id === newMessage.id)
        );
        return [...prevMessages, ...uniqueMessages];
      });
    }
  }, [data]);

  useEffect(() => {
    if (subscriptionData?.subscribeToChat) {
      setMessages((prevMessages) => {
        const isDuplicate = prevMessages.some(
          (message) => message.id === subscriptionData.subscribeToChat.id
        );
        if (!isDuplicate) {
          return [...prevMessages, subscriptionData.subscribeToChat];
        }
        return prevMessages;
      });
    }
  }, [subscriptionData]);

  if (!id) {
    return <div>Chat ID is required</div>;
  }

  if (loading || userLoading) {
    return <div>Loading...</div>;
  }

  const otherUserName = data?.getChatById?.member?.firstName || "Chat";

  return (
    <Chat
      messages={messages}
      sendMessage={sendMessage}
      isSending={isSending}
      setIsSending={setIsSending}
      currentUser={currentUser?.id}
      otherUserName={otherUserName}
    />
  );
};
