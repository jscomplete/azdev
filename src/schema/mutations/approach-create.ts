import { GraphQLNonNull, GraphQLID } from 'graphql';

import ApproachPayload from 'schema/types/payload-approach';
import ApproachInput from 'schema/types/input-approach';

const ApproachCreateMutation = {
  type: ApproachPayload,
  args: {
    taskId: { type: new GraphQLNonNull(GraphQLID) },
    input: { type: new GraphQLNonNull(ApproachInput) },
  },
  resolve: async (source, { taskId, input }, { mutators }) => {
    return mutators.approachCreate({
      taskId,
      input,
    });
  },
};

export default ApproachCreateMutation;
