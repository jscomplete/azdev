import express from 'express';

import { isDev } from 'config/server';
import redirectsRouter from './redirects';
import apisRouter from './apis';

import pagesData from 'store/pages';

const router = express.Router({ caseSensitive: true });

router.use('/', redirectsRouter);
router.use('/api', apisRouter);

Object.entries(pagesData).forEach(([pageId, pageData]) => {
  router.get(pageData.path || pageData.route, async (req, res) => {
    try {
      console.log(`TODO: SSR for ${pageId}`);
      res.render('main', { viewData: pageData });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .send(
          isDev
            ? `Error in router for ${pageData.path}: ${err.message}`
            : 'Oops! Something went wrong! :(',
        );
    }
  });
});

export default router;
