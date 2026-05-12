import React, { useRef, useMemo } from "react";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useAuth } from "@clerk/clerk-react";
import { createClient } from "graphql-ws";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = createHttpLink({
  uri: `${import.meta.env.VITE_API_URL}/graphql`,
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: `${import.meta.env.VITE_WS_URL}/subscriptions`,
  })
);

const ApolloProviderWithAuth = ({ children }) => {
  const { getToken } = useAuth();

  // Keep a ref to getToken so the authLink always calls the latest version
  // without needing to recreate the client on every Clerk token refresh.
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  // Create the client exactly once. Recreating it on every render (e.g. when
  // Clerk refreshes its token in the background) replaces the ApolloProvider
  // value, wipes the InMemoryCache, and re-mounts the entire subtree —
  // which looks like a full page reload to the user.
  const client = useMemo(() => {
    const authLink = setContext(async (_, { headers }) => {
      const token = await getTokenRef.current();
      return {
        headers: {
          ...headers,
          Authorization: token ? `Bearer ${token}` : "",
        },
      };
    });

    const splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      authLink.concat(httpLink)
    );

    return new ApolloClient({
      link: splitLink,
      cache: new InMemoryCache(),
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloProviderWithAuth;
