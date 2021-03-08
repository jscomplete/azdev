const redirectsSQL = `
  SELECT path, dest
  FROM azdev.redirects
`;

const redirects = ({ pgQuery }) => async () => {
  const pgResp = await pgQuery(redirectsSQL);
  return pgResp.rows;
};

export default redirects;
