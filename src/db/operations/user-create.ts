import { randomString } from 'utilities';

// $1: email
// $2: username
// $3: password
// $4: firstName (can be null)
// $5: lastName (can be null)
// $6: authToken
const userInsertSQL = `
  INSERT INTO azdev.users (email, username, hashed_password, first_name, last_name, hashed_auth_token)
  VALUES ($1, $2, crypt($3, gen_salt('bf')), $4, $5, crypt($6, gen_salt('bf')))
  RETURNING id, email, username, first_name AS "firstName", last_name AS "lastName", created_at AS "createdAt"
`;

const userCreate = ({ pgQuery }) => async ({ input }) => {
  const payload: PayloadType = { errors: [] };
  if (input.password.length < 6) {
    payload.errors.push({
      message: 'Use a stronger password',
    });
  }
  if (payload.errors.length === 0) {
    const authToken = randomString();
    const pgResp = await pgQuery(userInsertSQL, {
      $1: input.email.toLowerCase(),
      $2: input.username.toLowerCase(),
      $3: input.password,
      $4: input.firstName,
      $5: input.lastName,
      $6: authToken,
    });
    if (pgResp.rows[0]) {
      payload.user = pgResp.rows[0];
      payload.authToken = authToken;
    }
  }
  return payload;
};

export default userCreate;
