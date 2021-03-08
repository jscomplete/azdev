import { GraphQLNonNull } from 'graphql';

import TaskPayload from 'schema/types/payload-task';
import TaskInput from 'schema/types/input-task';

const TaskCreateMutation = {
  type: TaskPayload,
  args: {
    input: { type: new GraphQLNonNull(TaskInput) },
  },
  resolve: async (source, { input }, { mutators }) => {
    const { errors, task } = await mutators.taskCreate({
      input,
    });
    return { errors, task };
  },
};

export default TaskCreateMutation;
