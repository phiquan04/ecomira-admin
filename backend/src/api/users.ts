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
    // First, get the current user data to preserve existing user_type if not provided
    const currentUser = await pool.query(
      'SELECT user_type FROM users WHERE id = $1',
      [id]
    );

    if (currentUser.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentUserType = currentUser.rows[0].user_type;

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
      // Use provided userType or fallback to current user_type
      params = [
        fullName, 
        email, 
        phone || null, 
        userType !== undefined ? userType : currentUserType, // Fix: preserve current user_type if not provided
        isVerified || false, 
        passwordHash, 
        id
      ];
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
      // Use provided userType or fallback to current user_type
      params = [
        fullName, 
        email, 
        phone || null, 
        userType !== undefined ? userType : currentUserType, // Fix: preserve current user_type if not provided
        isVerified || false, 
        id
      ];
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

// PATCH - PARTIAL UPDATE user
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { fullName, email, phone, userType, isVerified, password } = req.body;

  try {
    // First, get the current user data to preserve existing values if not provided
    const currentUser = await pool.query(
      'SELECT user_type FROM users WHERE id = $1',
      [id]
    );

    if (currentUser.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentUserType = currentUser.rows[0].user_type;

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
    } else {
      // If userType is not provided, preserve the current value
      updateFields.push(`user_type = $${paramCount}`);
      values.push(currentUserType);
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

// GET seller statistics by user ID
router.get('/:id/seller-stats', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Kiểm tra user có phải là seller không
    const userCheck = await pool.query(
      'SELECT user_type FROM users WHERE id = $1',
      [id]
    );
    
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (userCheck.rows[0].user_type !== 'seller') {
      return res.status(400).json({ error: 'User is not a seller' });
    }

    // Thống kê cho seller
    const statsQuery = `
      SELECT 
        COALESCE(SUM(oi.subtotal), 0) as totalrevenue,
        COUNT(DISTINCT o.id) as totalorders,
        COUNT(DISTINCT p.id) as totalproducts
      FROM users u
      LEFT JOIN products p ON u.id = p.seller_id
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.status != 'cancelled'
      WHERE u.id = $1
    `;
    
    const result = await pool.query(statsQuery, [id]);
    
    res.json({
      totalRevenue: parseFloat(result.rows[0].totalrevenue) || 0,
      totalOrders: parseInt(result.rows[0].totalorders) || 0,
      totalProducts: parseInt(result.rows[0].totalproducts) || 0
    });
  } catch (error) {
    console.error('Error fetching seller stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET customer statistics by user ID
router.get('/:id/customer-stats', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Kiểm tra user có phải là customer không
    const userCheck = await pool.query(
      'SELECT user_type FROM users WHERE id = $1',
      [id]
    );
    
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (userCheck.rows[0].user_type !== 'customer') {
      return res.status(400).json({ error: 'User is not a customer' });
    }

    // Thống kê cho customer
    const statsQuery = `
      SELECT 
        COUNT(DISTINCT o.id) as totalorders,
        COALESCE(SUM(o.total_amount), 0) as totalspent
      FROM orders o
      WHERE o.customer_id = $1
      AND o.status != 'cancelled'
    `;
    
    const result = await pool.query(statsQuery, [id]);
    
    res.json({
      totalOrders: parseInt(result.rows[0].totalorders) || 0,
      totalSpent: parseFloat(result.rows[0].totalspent) || 0
    });
  } catch (error) {
    console.error('Error fetching customer stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET seller revenue chart data by user ID
router.get('/:id/seller-revenue-chart', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Kiểm tra user có phải là seller không
    const userCheck = await pool.query(
      'SELECT user_type FROM users WHERE id = $1',
      [id]
    );
    
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (userCheck.rows[0].user_type !== 'seller') {
      return res.status(400).json({ error: 'User is not a seller' });
    }

    // Lấy dữ liệu doanh thu 6 tháng gần nhất
    const revenueQuery = `
      SELECT 
        TO_CHAR(date_trunc('month', o.created_at), 'Mon') as month,
        EXTRACT(MONTH FROM o.created_at) as month_num,
        COALESCE(SUM(oi.subtotal), 0) as revenue
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE oi.seller_id = $1
        AND o.status = 'delivered'
        AND o.created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '5 months')
      GROUP BY date_trunc('month', o.created_at), month_num
      ORDER BY month_num
    `;
    
    const result = await pool.query(revenueQuery, [id]);
    
    // Đảm bảo có đủ 6 tháng, nếu không có dữ liệu thì trả về 0
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth(); // 0-indexed
    const last6Months = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthName = months[monthIndex];
      last6Months.push(monthName);
    }
    
    const revenueData = last6Months.map(month => {
      const found = result.rows.find(row => row.month === month);
      return {
        month,
        revenue: found ? parseFloat(found.revenue) : 0
      };
    });
    
    res.json(revenueData);
  } catch (error) {
    console.error('Error fetching seller revenue chart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET customer activity chart data by user ID
router.get('/:id/customer-activity-chart', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Kiểm tra user có phải là customer không
    const userCheck = await pool.query(
      'SELECT user_type FROM users WHERE id = $1',
      [id]
    );
    
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (userCheck.rows[0].user_type !== 'customer') {
      return res.status(400).json({ error: 'User is not a customer' });
    }

    // Lấy dữ liệu số đơn hàng và tổng chi tiêu 6 tháng gần nhất
    const activityQuery = `
      SELECT 
        TO_CHAR(date_trunc('month', created_at), 'Mon') as month,
        EXTRACT(MONTH FROM created_at) as month_num,
        COUNT(*) as order_count,
        COALESCE(SUM(total_amount), 0) as total_spent
      FROM orders
      WHERE customer_id = $1
        AND status = 'delivered'
        AND created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '5 months')
      GROUP BY date_trunc('month', created_at), month_num
      ORDER BY month_num
    `;
    
    const result = await pool.query(activityQuery, [id]);
    
    // Đảm bảo có đủ 6 tháng, nếu không có dữ liệu thì trả về 0
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth(); // 0-indexed
    const last6Months = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthName = months[monthIndex];
      last6Months.push(monthName);
    }
    
    const activityData = last6Months.map(month => {
      const found = result.rows.find(row => row.month === month);
      return {
        month,
        orderCount: found ? parseInt(found.order_count) : 0,
        totalSpent: found ? parseFloat(found.total_spent) : 0
      };
    });
    
    res.json(activityData);
  } catch (error) {
    console.error('Error fetching customer activity chart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;