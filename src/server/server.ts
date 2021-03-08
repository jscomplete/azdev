import path from 'path';
import express from 'express';
import morgan from 'morgan';
import cookieSession from 'cookie-session';
import serialize from 'serialize-javascript';
import helmet from 'helmet';

import { ApolloServer } from 'apollo-server';
import { schema } from 'schema/index';
import pgApiWrapper from 'db/api';

import * as config from 'config/server';
import mainRouter from './routers/index';
import redirectsRouter from './routers/redirects';

import { printBasicReq, morganString, printParams } from 'utilities/logger';

const startServer = async () => {
  const server = express();
  server.use(printBasicReq);
  server.use(morgan(morganString));
  server.use('/sf', express.static('public'));
  server.set('trust proxy', 1);
  server.use(
    helmet({
      frameguard: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'", '*.googletagmanager.com'],
          imgSrc: ["'self'", '*'],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            '*.googletagmanager.com',
          ],
          connectSrc: ["'self'", '*'],
          styleSrc: ["'self'", "'unsafe-inline'", '*.googleapis.com'],
          fontSrc: ["'self'", 'https:'],
          frameSrc: ["'self'", '*.googletagmanager.com'],
        },
      },
    }),
  );
  server.set('view engine', 'ejs');
  server.set('views', path.resolve(__dirname, './views'));
  server.use(
    cookieSession({
      name: 'session',
      keys: config.keys,
      secure: !config.isDev,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }),
  );

  server.locals.serialize = serialize;
  if (config.isDev) {
    server.locals.gVars = {
      main: ['main.css', 'main.js'],
      vendor: 'vendor.js',
    };
  } else {
    try {
      server.locals.gVars = require('../.reactful.json');
    } catch (err) {
      console.error('Reactful did not find Webpack generated assets');
    }
  }

  server.use(printParams);
  server.use('/', mainRouter);
  server.listen(config.port, () => {
    console.info(`Server is running on port ${config.port}`);
  });

  const pgApi = await pgApiWrapper();

  const redirectsObj = await pgApi.redirects();

  server.use(
    '/',
    redirectsRouter(
      redirectsObj.reduce((acc, curr) => {
        acc[curr.path] = curr.dest;
        return acc;
      }, {}),
    ),
  );

  const gServer = new ApolloServer({
    schema,
    subscriptions: {
      path: '/gs',
    },
    introspection: true,
    playground: true,
    formatError: (err) => {
      const errorReport = {
        message: err.message,
        locations: err.locations,
        stack: err.stack ? err.stack.split('\n') : [],
        path: err.path,
      };
      console.error('GraphQL Error', errorReport);
      console.error(err?.extensions?.exception?.stacktrace);
      return config.isDev
        ? errorReport
        : { message: 'Oops! Something went wrong! :(' };
    },
    context: async ({ req }) => {
      let currentUser;
      if (req && req.headers) {
        const authToken = req.headers.authorization
          ? req.headers.authorization.slice(7) // "Bearer "
          : null;
        currentUser = await pgApi.userFromAuthToken(authToken);
        if (authToken && !currentUser) {
          throw Error('Invalid access token');
        }
      }
      const { loaders, mutators } = pgApi(currentUser);
      return {
        loaders,
        mutators,
        currentUser,
      };
    },
  });

  gServer.listen({ port: config.gPort }).then(({ url, subscriptionsUrl }) => {
    console.info(`GraphQl Server URL: ${url}`);
    console.info(`GraphQL Subscriptions URL: ${subscriptionsUrl}`);
  });
};

startServer();
