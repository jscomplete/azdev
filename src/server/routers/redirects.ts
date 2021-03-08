import express from 'express';

const router = express.Router({ caseSensitive: true });

const redirects = {
  '/favicon.ico': '/sf/favicon.ico',
};

router.get('/:p1/:p2?', async (req, res, next) => {
  const redirectId =
    '/' + req.params.p1 + (req.params.p2 ? `/${req.params.p2}` : '');

  if (redirects[redirectId]) {
    const dest = redirects[redirectId];
    return res.redirect(dest);
  }

  next();
});

export default router;
