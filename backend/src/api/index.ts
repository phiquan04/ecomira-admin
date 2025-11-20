import express from 'express';
import users from './users'; 
import MessageResponse from '../interfaces/MessageResponse';
import emojis from './emojis';
import categories from './categories';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/emojis', emojis);
router.use('/users', users);
router.use('/categories', categories);

export default router;
