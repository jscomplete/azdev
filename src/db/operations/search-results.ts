// $1: searchTerm
// $2: createdBy (can be null)
const searchResultsSQL = `
  WITH viewable_tasks AS (
    SELECT *, ARRAY(select title from azdev.task_tags_view where task_id = t.id) AS tags
    FROM azdev.tasks t
    WHERE (is_private = FALSE OR created_by = $2)
  )
  SELECT id, "taskId", content, tags, "approachCount", "voteCount", "createdAt", type,
          ts_rank(to_tsvector(content), websearch_to_tsquery($1)) AS rank
  FROM (
    SELECT id, id AS "taskId", content, tags, approach_count AS "approachCount", null AS "voteCount", created_at AS "createdAt", 'task' AS type
    FROM viewable_tasks
    UNION ALL
    SELECT a.id, t.id AS "taskId", a.content, null AS tags, null AS "approachCount", a.vote_count AS "voteCount", a.created_at AS "createdAt", 'approach' AS type
    FROM azdev.approaches a JOIN viewable_tasks t ON (t.id = a.task_id)
  ) search_view
  WHERE to_tsvector(content) @@ websearch_to_tsquery($1)
  ORDER BY rank DESC, type DESC
`;

const searchResults = ({ pgQuery, currentUser }) => async (searchTerms) => {
  const results = searchTerms.map(async (searchTerm) => {
    const pgResp = await pgQuery(searchResultsSQL, {
      $1: searchTerm,
      $2: currentUser ? currentUser.id : null,
    });
    return pgResp.rows;
  });
  return Promise.all(results);
};

export default searchResults;
