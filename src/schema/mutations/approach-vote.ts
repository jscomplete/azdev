import { GraphQLNonNull, GraphQLID } from 'graphql';

import { pubsub } from 'server/pubsub';
import ApproachVotePayload from 'schema/types/payload-approach-vote';
import ApproachVoteInput from 'schema/types/input-approach-vote';

const ApproachVoteMutation = {
  type: ApproachVotePayload,
  args: {
    approachId: { type: new GraphQLNonNull(GraphQLID) },
    input: { type: new GraphQLNonNull(ApproachVoteInput) },
  },
  resolve: async (source, { approachId, input }, { mutators, loaders }) => {
    const { errors, approachVote } = await mutators.approachVote({
      approachId,
      input,
    });
    const approach = await loaders.approaches.load(approachId);
    if (errors.length === 0) {
      pubsub.publish(`VOTE_CHANGED_${approachVote.taskId}`, {
        updatedApproach: approach,
      });
    }
    return { errors, approach };
  },
};

export default ApproachVoteMutation;
