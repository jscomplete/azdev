import { GraphQLNonNull } from 'graphql';

import UserPayload from 'schema/types/payload-user';
import UserInput from 'schema/types/input-user';

const UserCreateMutation = {
  type: UserPayload,
  args: {
    input: { type: new GraphQLNonNull(UserInput) },
  },
  resolve: async (source, { input }, { mutators }) => {
    return mutators.userCreate({ input });
  },
};

export default UserCreateMutation;
