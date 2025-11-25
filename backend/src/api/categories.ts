import express from 'express';
import pool from '../db/db';

const router = express.Router();

// GET all categories
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        name,
        icon,
        color,
        description,
        is_active as "isActive",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM categories 
      ORDER BY id ASC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET single category by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(`
      SELECT 
        id,
        name,
        icon,
        color,
        description,
        is_active as "isActive",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM categories 
      WHERE id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST - CREATE new category
router.post('/', async (req, res) => {
  const { name, icon, color, description, isActive } = req.body;

  // Validate required fields
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO categories (name, icon, color, description, is_active) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING 
         id,
         name,
         icon,
         color,
         description,
         is_active as "isActive",
         created_at as "createdAt",
         updated_at as "updatedAt"`,
      [name, icon || null, color || null, description || null, isActive || true]
    );

    const newCategory = result.rows[0];
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT - UPDATE category
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, icon, color, description, isActive } = req.body;

  // Validate required fields
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const result = await pool.query(
      `UPDATE categories 
       SET name = $1, icon = $2, color = $3, description = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING 
         id,
         name,
         icon,
         color,
         description,
         is_active as "isActive",
         created_at as "createdAt",
         updated_at as "updatedAt"`,
      [name, icon || null, color || null, description || null, isActive || true, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const updatedCategory = result.rows[0];
    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE - DELETE category
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json({ 
      message: 'Category deleted successfully',
      deletedCategory: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;