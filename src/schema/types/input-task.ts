import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
} from 'graphql';

const TaskInput = new GraphQLInputObjectType({
  name: 'TaskInput',
  fields: () => ({
    content: { type: new GraphQLNonNull(GraphQLString) },
    tags: { type: GraphQLString },
    isPrivate: { type: new GraphQLNonNull(GraphQLBoolean) },
  }),
});

export default TaskInput;
