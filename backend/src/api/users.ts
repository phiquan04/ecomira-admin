import express from 'express';
import pool from '../db/db';
import bcrypt from 'bcrypt';

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

// POST - CREATE user
router.post('/', async (req, res) => {
  const { fullName, email, phone, userType, isVerified, password } = req.body;

  // Validate required fields
  if (!fullName || !email) {
    return res.status(400).json({ error: 'Full name and email are required' });
  }

  try {
    // Generate a default password hash if no password provided
    let passwordHash = '';
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    } else {
      // Create a random password hash for users created without password
      const randomPassword = Math.random().toString(36).slice(-8);
      passwordHash = await bcrypt.hash(randomPassword, 10);
    }

    const result = await pool.query(
      `INSERT INTO users (full_name, email, phone, password_hash, user_type, is_verified, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
       RETURNING 
         id,
         full_name as "fullName",
         email,
         phone,
         user_type as "userType",
         is_verified as "verified",
         created_at as "createdAt",
         updated_at as "updatedAt"`,
      [fullName, email, phone || null, passwordHash, userType || 'customer', isVerified || false]
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
  const { fullName, email, phone, userType, isVerified, password } = req.body;

  // Validate required fields
  if (!fullName || !email) {
    return res.status(400).json({ error: 'Full name and email are required' });
  }

  try {
    let query: string;
    let params: any[];

    // If password is provided, update it too
    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      query = `
        UPDATE users 
        SET full_name = $1, email = $2, phone = $3, user_type = $4, is_verified = $5, 
            password_hash = $6, updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING 
          id,
          full_name as "fullName",
          email,
          phone,
          user_type as "userType",
          is_verified as "verified",
          created_at as "createdAt",
          updated_at as "updatedAt"
      `;
      params = [fullName, email, phone || null, userType || 'customer', isVerified || false, passwordHash, id];
    } else {
      query = `
        UPDATE users 
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
          updated_at as "updatedAt"
      `;
      params = [fullName, email, phone || null, userType || 'customer', isVerified || false, id];
    }

    const result = await pool.query(query, params);

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

// PATCH - PARTIAL UPDATE user (optional, for specific fields)
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { fullName, email, phone, userType, isVerified, password } = req.body;

  try {
    // Build dynamic update query based on provided fields
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (fullName !== undefined) {
      updateFields.push(`full_name = $${paramCount}`);
      values.push(fullName);
      paramCount++;
    }

    if (email !== undefined) {
      updateFields.push(`email = $${paramCount}`);
      values.push(email);
      paramCount++;
    }

    if (phone !== undefined) {
      updateFields.push(`phone = $${paramCount}`);
      values.push(phone);
      paramCount++;
    }

    if (userType !== undefined) {
      updateFields.push(`user_type = $${paramCount}`);
      values.push(userType);
      paramCount++;
    }

    if (isVerified !== undefined) {
      updateFields.push(`is_verified = $${paramCount}`);
      values.push(isVerified);
      paramCount++;
    }

    if (password !== undefined) {
      const passwordHash = await bcrypt.hash(password, 10);
      updateFields.push(`password_hash = $${paramCount}`);
      values.push(passwordHash);
      paramCount++;
    }

    // Always update the updated_at timestamp
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

    if (updateFields.length === 1) { // Only updated_at was added
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);

    const query = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING 
        id,
        full_name as "fullName",
        email,
        phone,
        user_type as "userType",
        is_verified as "verified",
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;

    const result = await pool.query(query, values);

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
    const result = await pool.query(
      `DELETE FROM users 
       WHERE id = $1 
       RETURNING 
         id,
         full_name as "fullName",
         email,
         phone,
         user_type as "userType",
         is_verified as "verified",
         created_at as "createdAt",
         updated_at as "updatedAt"`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const deletedUser = result.rows[0];
    
    // Format response
    const formattedUser = {
      ...deletedUser,
      img: '/Portrait_Placeholder.png',
      firstName: deletedUser.fullName.split(' ')[0] || deletedUser.fullName,
      lastName: deletedUser.fullName.split(' ').slice(1).join(' ') || 'User'
    };

    res.status(200).json({ 
      message: 'User deleted successfully',
      deletedUser: formattedUser
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