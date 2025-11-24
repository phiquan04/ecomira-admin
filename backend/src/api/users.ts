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

router.post('/', async (req, res) => {
  const { fullName, email, phone, userType, isVerified } = req.body;

  // Validate required fields
  if (!fullName || !email) {
    return res.status(400).json({ error: 'Full name and email are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO users (full_name, email, phone, user_type, is_verified) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING 
         id,
         full_name as "fullName",
         email,
         phone,
         user_type as "userType",
         is_verified as "verified",
         created_at as "createdAt",
         updated_at as "updatedAt"`,
      [fullName, email, phone || null, userType || 'member', isVerified || false]
    );

    const newUser = result.rows[0];
    
    // Format response to match frontend expectations
    const formattedUser = {
      ...newUser,
      img: '/Portrait_Placeholder.png',
      firstName: newUser.fullName.split(' ')[0] || newUser.fullName,
      lastName: newUser.fullName.split(' ').slice(1).join(' ') || 'User'
    };

    res.status(201).json(formattedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    
    // Handle duplicate email error
    if (error instanceof Error && error.message.includes('duplicate key value')) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT - UPDATE user
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { fullName, email, phone, userType, isVerified } = req.body;

  // Validate required fields
  if (!fullName || !email) {
    return res.status(400).json({ error: 'Full name and email are required' });
  }

  try {
    const result = await pool.query(
      `UPDATE users 
       SET full_name = $1, email = $2, phone = $3, user_type = $4, is_verified = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING 
         id,
         full_name as "fullName",
         email,
         phone,
         user_type as "userType",
         is_verified as "verified",
         created_at as "createdAt",
         updated_at as "updatedAt"`,
      [fullName, email, phone || null, userType || 'member', isVerified || false, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = result.rows[0];
    
    // Format response
    const formattedUser = {
      ...updatedUser,
      img: '/Portrait_Placeholder.png',
      firstName: updatedUser.fullName.split(' ')[0] || updatedUser.fullName,
      lastName: updatedUser.fullName.split(' ').slice(1).join(' ') || 'User'
    };

    res.json(formattedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    
    // Handle duplicate email error
    if (error instanceof Error && error.message.includes('duplicate key value')) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE - DELETE user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ 
      message: 'User deleted successfully',
      deletedUser: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;