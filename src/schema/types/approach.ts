import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';

import User from './user';
import Task from './task';
import ApproachDetail from './approach-detail';
import SearchResultItem from './search-result-item';

const Approach = new GraphQLObjectType({
  name: 'Approach',
  interfaces: [SearchResultItem],
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
    author: {
      type: new GraphQLNonNull(User),
      resolve: (source, args, { loaders }) =>
        loaders.users.load(source.createdBy),
    },
    detailList: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(ApproachDetail)),
      ),
      resolve: (source, args, { loaders }) =>
        loaders.detailLists.load(source.id),
    },
    voteCount: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    task: {
      type: new GraphQLNonNull(Task),
      resolve: (source, args, { loaders }) => loaders.tasks.load(source.taskId),
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ createdAt }) => createdAt.toISOString(),
    },
  }),
});

export default Approach;
