// $1: userIds
const usersFromIDsSQL = `
  SELECT id, email, username, first_name AS "firstName", last_name AS "lastName", created_at AS "createdAt"
  FROM azdev.users
  WHERE id = ANY ($1)
`;

const usersInfo = ({ pgQuery }) => async (userIds) => {
  const pgResp = await pgQuery(usersFromIDsSQL, {
    $1: userIds,
  });
  return userIds.map((userId) => pgResp.rows.find((row) => userId == row.id));
};

export default usersInfo;
