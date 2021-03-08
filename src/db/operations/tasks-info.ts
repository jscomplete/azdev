// $1: taskIds
// $2: createdBy (can be null)
const tasksFromIdsSQL = `
  SELECT id, content, created_by AS "createdBy", approach_count AS "approachCount", is_private AS "isPrivate", created_at AS "createdAt",
         ARRAY(select title from azdev.task_tags_view where task_id = t.id) AS tags
  FROM azdev.tasks t
  WHERE id = ANY ($1)
  AND (is_private = FALSE OR created_by = $2)
`;

const tasksInfo = ({ pgQuery, currentUser }) => async (taskIds) => {
  const pgResp = await pgQuery(tasksFromIdsSQL, {
    $1: taskIds,
    $2: currentUser ? currentUser.id : null,
  });
  return taskIds.map((taskId) => pgResp.rows.find((row) => taskId == row.id));
};

export default tasksInfo;
