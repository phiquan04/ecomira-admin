import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import usersRouter from './api/users';
import authRouter from './api/login';
import analyticsRouter from './api/analytics';

import * as middlewares from './middlewares';
import api from './api';
// import MessageResponse from './interfaces/MessageResponse';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());

app.get('/', (req, res) => {
  const navigationLinks = {
    users: '/api/v1/users',
    user1: '/api/v1/users/1',
    products: '/products',
    products1: '/products/1',
    categories: '/categories',
    // posts: '/posts',
    // notes: '/notes',
    // logs: '/logs',
  };

  let htmlResponse =
    '<h3>🦄🌈✨ React Dashboard Admin V1 API ✨🌈🦄</h3>';
  htmlResponse += '<ul>';
  for (const [route, url] of Object.entries(navigationLinks)) {
    htmlResponse += `<li><a href="${url}">${route}</a></li>`;
  }
  htmlResponse += '</ul>';

  // Send HTML response
  res.send(htmlResponse);
});

app.use(cors({
  origin: process.env.VITE_DEV_ORIGIN || '*'
}));
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/v1', api);
app.use('/api/analytics', analyticsRouter);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;