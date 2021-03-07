// TODO: check env variables existence

export const GRAPHQL_SERVER_URL = process.env.GRAPHQL_SERVER_URL;
export const GRAPHQL_SUBSCRIPTIONS_URL = process.env.GRAPHQL_SUBSCRIPTIONS_URL;
export const isBrowser = typeof window !== 'undefined';
