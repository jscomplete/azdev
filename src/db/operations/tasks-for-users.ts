// $1: userIds
const tasksForUsersSQL = `
  SELECT id, content, created_by AS "createdBy", approach_count AS "approachCount", is_private AS "isPrivate", created_at AS "createdAt",
         ARRAY(select title from azdev.task_tags_view where task_id = t.id) AS tags
  FROM azdev.tasks t
  WHERE created_by = ANY ($1)
  ORDER by created_at DESC
`;

const tasksForUsers = ({ pgQuery }) => async (userIds) => {
  const pgResp = await pgQuery(tasksForUsersSQL, {
    $1: userIds,
  });
  return userIds.map((userId) =>
    pgResp.rows.filter((row) => userId === row.createdBy),
  );
};

export default tasksForUsers;
