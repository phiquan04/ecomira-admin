import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import * as middlewares from './middlewares';
import api from './api';
// import MessageResponse from './interfaces/MessageResponse';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  const navigationLinks = {
    users: '/api/v1/users',
    user1: '/api/v1/users/1',
    products: '/products',
    products1: '/products/1',
    categories: '/categories',
    posts: '/posts',
    notes: '/notes',
    logs: '/logs',
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


// ... giữ nguyên các route khác

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;