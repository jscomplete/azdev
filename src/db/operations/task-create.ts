import { pgExpand } from 'utilities';

// $1: userId
// $2: content
// $4: TRUE if private
const taskInsertSQL = `
  INSERT INTO azdev.tasks (created_by, content, is_private)
  VALUES ($1, $2, $3)
  RETURNING id, content, created_by AS "createdBy", approach_count AS "approachCount", is_private AS "isPrivate", created_at AS "createdAt",
            ARRAY(select title from azdev.task_tags_view where task_id = azdev.tasks.id) AS tags;
`;

// [[tagTitel, userId], ..]
const tagsInsertSQL = (rowsCount) => `
  INSERT INTO azdev.tags (title, created_by)
  VALUES ${pgExpand(rowsCount, 2)}
  ON CONFLICT (title) DO UPDATE SET use_counter = EXCLUDED.use_counter + 1
  RETURNING id, title, created_by as "createdBy";
`;

// [[taskId, tagId, userId], ...]
const taskTagsInsertSQL = (rowsCount) => `
  INSERT INTO azdev.task_tags (task_id, tag_id, created_by)
  VALUES ${pgExpand(rowsCount, 3)}
  RETURNING task_id as "taskId", tag_id as "tagId", created_by as "createdBy";
`;

const taskCreate = ({ pgQuery, currentUser }) => async ({ input }) => {
  if (!currentUser) {
    throw Error('Invalid request');
  }
  const payload: PayloadType = { errors: [] };
  if (input.content.length < 15) {
    payload.errors.push({
      message: 'Text is too short',
    });
  }
  let pgResp;
  if (payload.errors.length === 0) {
    pgResp = await pgQuery(taskInsertSQL, {
      $1: currentUser.id,
      $2: input.content,
      $4: input.isPrivate,
    });

    if (pgResp.rows[0]) {
      payload.task = pgResp.rows[0];
    }

    if (input.tags) {
      const tagsArray = [];

      for (let tag of input.tags.split(',')) {
        tag = tag.toLowerCase().replace(/[^a-z]/gi, '');
        if (tag.length > 2 && !tagsArray.includes(tag)) {
          tagsArray.push(tag);
        }
      }

      let valuesCounter = 0;
      pgResp = await pgQuery(
        tagsInsertSQL(tagsArray.length),
        tagsArray.reduce((values, tagTitle) => {
          values[`$${++valuesCounter}`] = tagTitle;
          values[`$${++valuesCounter}`] = currentUser.id;
          console.log({ tagTitle, values });
          return values;
        }, {}),
      );

      const tagsRows = pgResp.rows;
      if (tagsRows.length > 0) {
        valuesCounter = 0;
        pgResp = await pgQuery(
          taskTagsInsertSQL(tagsRows.length),
          tagsRows.reduce((values, tagRow) => {
            values[`$${++valuesCounter}`] = payload.task.id;
            values[`$${++valuesCounter}`] = tagRow.id;
            values[`$${++valuesCounter}`] = currentUser.id;
            return values;
          }, {}),
        );
      }
    }
  }
  return payload;
};

export default taskCreate;
