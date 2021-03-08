// $1: taskIds
const approachesForTaskIdsSQL = `
  SELECT id, content, created_by AS "createdBy", task_id AS "taskId", vote_count AS "voteCount", created_at AS "createdAt"
  FROM azdev.approaches
  WHERE task_id = ANY ($1)
  ORDER BY vote_count DESC, created_at DESC
`;

const approachLists = ({ pgQuery }) => async (taskIds) => {
  const pgResp = await pgQuery(approachesForTaskIdsSQL, {
    $1: taskIds,
  });
  return taskIds.map((taskId) =>
    pgResp.rows.filter((row) => taskId === row.taskId),
  );
};

export default approachLists;
