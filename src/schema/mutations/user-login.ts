import { GraphQLNonNull } from 'graphql';

import UserPayload from 'schema/types/payload-user';
import AuthInput from 'schema/types/input-auth';

const UserLoginMutation = {
  type: UserPayload,
  args: {
    input: { type: new GraphQLNonNull(AuthInput) },
  },
  resolve: async (source, { input }, { mutators }) => {
    return mutators.userLogin({ input });
  },
};

export default UserLoginMutation;
