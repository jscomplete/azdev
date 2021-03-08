import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';

import Approach from './approach';
import UserError from './user-error';

const ApproachVotePayload = new GraphQLObjectType({
  name: 'ApproachVotePayload',
  fields: () => ({
    errors: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserError))),
    },
    approach: {
      type: new GraphQLNonNull(Approach),
    },
  }),
});

export default ApproachVotePayload;
