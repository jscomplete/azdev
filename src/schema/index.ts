import fs from 'fs';
import path from 'path';
import { GraphQLSchema, printSchema } from 'graphql';

import { isDev } from 'config/server';

import QueryType from './queries';
import MutationType from './mutations';
import SubscriptionType from './subscriptions';

export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
  subscription: SubscriptionType,
});

if (isDev) {
  fs.writeFileSync(
    path.resolve('./src/schema/schema.graphql'),
    printSchema(schema),
  );
}
