import { Request, Response } from 'express';
import pool from '../db/db';

// Thống kê người bán
export const getSellerStats = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT 
        COALESCE(SUM(oi.subtotal), 0) as totalrevenue,
        COUNT(DISTINCT o.id) as totalorders
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      JOIN users u ON oi.seller_id = u.id
      WHERE u.user_type = 'seller'
      AND o.status != 'cancelled'
    `;
    
    const result = await pool.query(query);
    res.json({
      totalRevenue: parseFloat(result.rows[0].totalrevenue) || 0,
      totalOrders: parseInt(result.rows[0].totalorders) || 0
    });
  } catch (error) {
    console.error('Error fetching seller stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Thống kê người mua
export const getBuyerStats = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT 
        COUNT(DISTINCT o.id) as totalorders,
        COALESCE(SUM(o.total_amount), 0) as totalspent
      FROM orders o
      JOIN users u ON o.customer_id = u.id
      WHERE u.user_type = 'customer'
      AND o.status != 'cancelled'
    `;
    
    const result = await pool.query(query);
    res.json({
      totalOrders: parseInt(result.rows[0].totalorders) || 0,
      totalSpent: parseFloat(result.rows[0].totalspent) || 0
    });
  } catch (error) {
    console.error('Error fetching buyer stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Xu hướng đăng ký tài khoản
export const getUserRegistrations = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT 
        DATE(created_at) as date,
        user_type,
        COUNT(*) as count
      FROM users 
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(created_at), user_type
      ORDER BY date
    `;
    
    const result = await pool.query(query);
    
    // Chuyển đổi dữ liệu thành format phù hợp cho chart
    const formattedData = result.rows.reduce((acc: any, row) => {
      const existingDate = acc.find((item: any) => item.name === row.date);
      
      if (existingDate) {
        existingDate[row.user_type] = parseInt(row.count);
      } else {
        const newItem: any = {
          name: row.date,
          customer: 0,
          seller: 0
        };
        newItem[row.user_type] = parseInt(row.count);
        acc.push(newItem);
      }
      
      return acc;
    }, []);
    
    res.json({
      chartData: formattedData
    });
  } catch (error) {
    console.error('Error fetching user registrations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Xu hướng đăng ký sản phẩm
export const getProductRegistrations = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM products 
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date
    `;
    
    const result = await pool.query(query);
    
    const chartData = result.rows.map(row => ({
      name: row.date,
      count: parseInt(row.count)
    }));

    res.json({
      chartData: chartData,
      dataKey: 'count'
    });
  } catch (error) {
    console.error('Error fetching product registrations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};