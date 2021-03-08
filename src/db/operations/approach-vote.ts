// $1: userId
// $2: approachId
// $3: voteIncrement
const approachVoteSQL = `
  INSERT INTO azdev.approach_votes (created_by, approach_id, vote)
  VALUES ($1, $2, $3)
  ON CONFLICT (created_by, approach_id) DO UPDATE SET vote = $3
  RETURNING id, approach_id as "approachId", created_by as "createdBy",
            (select task_id from azdev.approaches where id = $2) as "taskId";
`;

const approachVote = ({ pgQuery, currentUser }) => async ({
  approachId,
  input,
}) => {
  if (!currentUser) {
    throw Error('Invalid request');
  }
  const payload: PayloadType = { errors: [] };
  const pgResp = await pgQuery(approachVoteSQL, {
    $1: currentUser.id,
    $2: approachId,
    $3: input.up ? 1 : -1,
  });
  if (pgResp.rows[0]) {
    payload.approachVote = pgResp.rows[0];
  }
  return payload;
};

export default approachVote;
