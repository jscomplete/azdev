import { GraphQLNonNull, GraphQLObjectType, GraphQLID } from 'graphql';

import { pubsub } from 'server/pubsub';
import Approach from './types/approach';

const SubscriptionType = new GraphQLObjectType({
  name: 'Subscription',
  fields: () => ({
    voteChanged: {
      type: new GraphQLNonNull(Approach),
      args: {
        taskId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (source) => source.updatedApproach,
      subscribe: async (source, { taskId }) => {
        return pubsub.asyncIterator([`VOTE_CHANGED_${taskId}`]);
      },
    },
  }),
});

export default SubscriptionType;
