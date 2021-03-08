// $1: approachIds
const approacheListsSQL = `
  SELECT id, approach_id as "approachId", created_by as "createdBy", category, content,
         sort_rank as "sortRank", created_at as "createdAt"
  FROM azdev.approach_details
  WHERE approach_id = ANY ($1)
  ORDER BY sort_rank, created_at desc
`;

const approachDetailLists = ({ pgQuery }) => async (approachIds) => {
  const pgResp = await pgQuery(approacheListsSQL, {
    $1: approachIds,
  });
  return approachIds.map((approachId) =>
    pgResp.rows.filter((row) => approachId === row.approachId),
  );
};

export default approachDetailLists;
