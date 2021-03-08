// $1: approachIds
// $2: userId (can be null)
const approachesFromIdsSQL = `
  SELECT a.id, a.content, a.created_by AS "createdBy", a.task_id AS "taskId", a.vote_count AS "voteCount", a.created_at AS "createdAt"
  FROM azdev.approaches a, azdev.tasks t
  WHERE a.id = ANY ($1)
  AND a.task_id = t.id
  AND (t.is_private = FALSE OR t.created_by = $2)
`;

const approachesInfo = ({ pgQuery, currentUser }) => async (approachIds) => {
  const pgResp = await pgQuery(approachesFromIdsSQL, {
    $1: approachIds,
    $2: currentUser ? currentUser.id : null,
  });
  return approachIds.map((approachId) =>
    pgResp.rows.find((row) => approachId == row.id),
  );
};

export default approachesInfo;
