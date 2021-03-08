import 'ts-polyfill';
import * as React from 'react';
import ReactDOM from 'react-dom';

import fetch from 'cross-fetch';
import {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache,
  split,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/client/link/context';

import 'styles/index.css';
import { LOCAL_APP_STATE } from 'store';
import Root from 'components/Root';

import { GRAPHQL_SERVER_URL, GRAPHQL_SUBSCRIPTIONS_URL } from 'config/browser';

const cache = new InMemoryCache();
const httpLink = new HttpLink({ uri: GRAPHQL_SERVER_URL, fetch });
const authLink = setContext((_, { headers }) => {
  const { user } = cache.readQuery({ query: LOCAL_APP_STATE });
  return {
    headers: {
      ...headers,
      authorization: user ? `Bearer ${user.authToken}` : '',
    },
  };
});
const wsLink = new WebSocketLink({
  uri: GRAPHQL_SUBSCRIPTIONS_URL,
  options: { reconnect: true },
});
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
);

const client = new ApolloClient({
  link: splitLink,
  cache,
});

const initialLocalAppState = {
  component: { name: 'Home', props: {} },
  user: JSON.parse(window.localStorage.getItem('azdev:user')),
};

client.writeQuery({
  query: LOCAL_APP_STATE,
  data: initialLocalAppState,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Root />
  </ApolloProvider>,
  document.getElementById('root'),
);
