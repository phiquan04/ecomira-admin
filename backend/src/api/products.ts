import express from 'express';
import pool from '../db/db';

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        name,
        description,
        price,
        stock,
        category_id as "categoryId",
        seller_id as "sellerId",
        images,
        rating,
        sold_count as "soldCount",
        is_active as "isActive",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM products 
      ORDER BY id ASC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET single product by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(`
      SELECT 
        id,
        name,
        description,
        price,
        stock,
        category_id as "categoryId",
        seller_id as "sellerId",
        images,
        rating,
        sold_count as "soldCount",
        is_active as "isActive",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM products 
      WHERE id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;