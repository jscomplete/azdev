// $1: userId
// $2: content
// $3: taskId
const approachInsertSQL = `
  INSERT INTO azdev.approaches (created_by, content, task_id)
  VALUES ($1, $2, $3)
  RETURNING id, content, created_by AS "createdBy", task_id AS "taskId", vote_count AS "voteCount", created_at AS "createdAt";
`;

// $1: userId
// $2: approachId,
// $3: category
// $4: content
const approachDetailInsertSQL = `
  INSERT INTO azdev.approach_details (created_by, approach_id, category, content)
  VALUES ($1, $2, $3, $4)
  RETURNING id, category, content, created_by AS "createdBy", created_at AS "createdAt";
`;

const approachCreate = ({ pgQuery, currentUser }) => async ({
  taskId,
  input,
}) => {
  if (!currentUser) {
    throw Error('Invalid request');
  }
  const payload: PayloadType = { detailList: [], errors: [] };
  let pgResp;
  if (payload.errors.length === 0) {
    pgResp = await pgQuery(approachInsertSQL, {
      $1: currentUser.id,
      $2: input.content,
      $3: taskId,
    });
    if (pgResp.rows[0]) {
      payload.approach = pgResp.rows[0];
      for (const detailInput of input.detailList) {
        pgResp = await pgQuery(approachDetailInsertSQL, {
          $1: currentUser.id,
          $2: payload.approach.id,
          $3: detailInput.category,
          $4: detailInput.content,
        });
        payload.detailList.push(pgResp.rows[0]);
      }
    }
  }
  return payload;
};

export default approachCreate;
