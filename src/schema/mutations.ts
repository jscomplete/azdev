import { GraphQLObjectType } from 'graphql';

import ApproachCreateMutation from './mutations/approach-create';
import ApproachVoteMutation from './mutations/approach-vote';
import TaskCreateMutation from './mutations/task-create';
import UserCreateMutation from './mutations/user-create';
import UserLoginMutation from './mutations/user-login';

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    approachCreate: ApproachCreateMutation,
    approachVote: ApproachVoteMutation,
    taskCreate: TaskCreateMutation,
    userCreate: UserCreateMutation,
    userLogin: UserLoginMutation,
  },
});

export default MutationType;
