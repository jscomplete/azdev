import { randomString } from 'utilities';

// $1: username
// $2: password
const userFromCredentialsSQL = `
  SELECT id, username, first_name AS "firstName", last_name AS "lastName"
  FROM azdev.users
  WHERE username = $1
  AND hashed_password = crypt($2, hashed_password)
`;

// $1: userId
// $2: new authToken
const userUpdateAuthTokenSQL = `
  UPDATE azdev.users
  SET hashed_auth_token = crypt($2, gen_salt('bf'))
  WHERE id = $1;
`;

const userLogin = ({ pgQuery }) => async ({ input }) => {
  const payload: PayloadType = { errors: [] };
  if (!input.username || !input.password) {
    payload.errors.push({
      message: 'Invalid username or password',
    });
  }
  if (payload.errors.length === 0) {
    const pgResp = await pgQuery(userFromCredentialsSQL, {
      $1: input.username.toLowerCase(),
      $2: input.password,
    });
    const user = pgResp.rows[0];
    if (user) {
      const authToken = randomString();
      await pgQuery(userUpdateAuthTokenSQL, {
        $1: user.id,
        $2: authToken,
      });
      payload.user = user;
      payload.authToken = authToken;
    } else {
      payload.errors.push({
        message: 'Invalid username or password',
      });
    }
  }
  return payload;
};

export default userLogin;
