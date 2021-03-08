import { GraphQLEnumType } from 'graphql';

const ApproachDetailCategory = new GraphQLEnumType({
  name: 'ApproachDetailCategory',
  values: {
    NOTE: { value: 'note' },
    EXPLANATION: { value: 'explanation' },
    WARNING: { value: 'warning' },
  },
});

export default ApproachDetailCategory;
