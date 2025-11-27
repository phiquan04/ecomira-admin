import express from 'express';
import users from './users'; 
import MessageResponse from '../interfaces/MessageResponse';
import emojis from './emojis';
import categories from './categories';
import products from './products';
import { 
  getSellerStats, 
  getBuyerStats, 
  getUserRegistrations, 
  getProductRegistrations 
} from './analytics';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/emojis', emojis);
router.use('/users', users);
router.use('/categories', categories);
router.use('/products', products);


router.get('/analytics/seller-stats', getSellerStats);
router.get('/analytics/buyer-stats', getBuyerStats);
router.get('/analytics/user-registrations', getUserRegistrations);
router.get('/analytics/product-registrations', getProductRegistrations);

export default router;
