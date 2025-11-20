import express from 'express';
import pool from '../db/db';

const router = express.Router();

// GET all users
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        full_name as "fullName",
        email,
        phone,
        user_type as "userType",
        is_verified as "verified",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM users 
      ORDER BY id ASC
    `);
    
    // Format data to match frontend expectations
    const formattedUsers = result.rows.map(user => ({
      ...user,
      // Add default image since database doesn't have img field
      img: '/Portrait_Placeholder.png',
      // For compatibility with existing frontend that expects firstName/lastName
      firstName: user.fullName.split(' ')[0] || user.fullName,
      lastName: user.fullName.split(' ').slice(1).join(' ') || 'User'
    }));
    
    res.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET single user by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(`
      SELECT 
        id,
        full_name as "fullName",
        email,
        phone,
        user_type as "userType",
        is_verified as "verified",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM users 
      WHERE id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = result.rows[0];
    // Format single user data
    const formattedUser = {
      ...user,
      img: '/Portrait_Placeholder.png',
      firstName: user.fullName.split(' ')[0] || user.fullName,
      lastName: user.fullName.split(' ').slice(1).join(' ') || 'User'
    };
    
    res.json(formattedUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;