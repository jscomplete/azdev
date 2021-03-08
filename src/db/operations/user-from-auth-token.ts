// $1: authToken
const userFromAuthTokenSQL = `
  SELECT id, username, first_name AS "firstName", last_name AS "lastName"
  FROM azdev.users
  WHERE hashed_auth_token = crypt($1, hashed_auth_token)
`;

const userFromAuthToken = ({ pgQuery }) => async (authToken) => {
  if (!authToken) {
    return null;
  }
  const pgResp = await pgQuery(userFromAuthTokenSQL, {
    $1: authToken,
  });
  return pgResp.rows[0];
};

export default userFromAuthToken;
