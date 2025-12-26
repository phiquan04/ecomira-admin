import express from "express"
import pool from "../db/db"

const router = express.Router()

// GET User Statistics - Total users, sellers, customers count
router.get("/user-stats", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE user_type = 'seller') as total_sellers,
        COUNT(*) FILTER (WHERE user_type = 'customer') as total_customers
      FROM users
    `)

    const stats = result.rows[0]
    res.json({
      totalUsers: Number.parseInt(stats.total_users) || 0,
      totalSellers: Number.parseInt(stats.total_sellers) || 0,
      totalCustomers: Number.parseInt(stats.total_customers) || 0,
    })
  } catch (error) {
    console.error("Error fetching user stats:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// GET User Registration Trends - Weekly, Monthly, Yearly
router.get("/registration-trends", async (req, res) => {
  const { period = "weekly" } = req.query

  try {
    let query = ""

    if (period === "weekly") {
      query = `
        SELECT 
          TO_CHAR(date_trunc('week', created_at), 'DD/MM') as label,
          COUNT(*) FILTER (WHERE user_type = 'seller') as sellers,
          COUNT(*) FILTER (WHERE user_type = 'customer') as customers,
          COUNT(*) as total
        FROM users
        WHERE created_at >= NOW() - INTERVAL '12 weeks'
        GROUP BY date_trunc('week', created_at)
        ORDER BY date_trunc('week', created_at) ASC
      `
    } else if (period === "monthly") {
      query = `
        SELECT 
          TO_CHAR(date_trunc('month', created_at), 'Mon YYYY') as label,
          COUNT(*) FILTER (WHERE user_type = 'seller') as sellers,
          COUNT(*) FILTER (WHERE user_type = 'customer') as customers,
          COUNT(*) as total
        FROM users
        WHERE created_at >= NOW() - INTERVAL '12 months'
        GROUP BY date_trunc('month', created_at)
        ORDER BY date_trunc('month', created_at) ASC
      `
    } else if (period === "yearly") {
      query = `
        SELECT 
          TO_CHAR(date_trunc('year', created_at), 'YYYY') as label,
          COUNT(*) FILTER (WHERE user_type = 'seller') as sellers,
          COUNT(*) FILTER (WHERE user_type = 'customer') as customers,
          COUNT(*) as total
        FROM users
        WHERE created_at >= NOW() - INTERVAL '5 years'
        GROUP BY date_trunc('year', created_at)
        ORDER BY date_trunc('year', created_at) ASC
      `
    }

    const result = await pool.query(query)

    const data = result.rows.map((row) => ({
      label: row.label,
      sellers: Number.parseInt(row.sellers) || 0,
      customers: Number.parseInt(row.customers) || 0,
      total: Number.parseInt(row.total) || 0,
    }))

    res.json(data)
  } catch (error) {
    console.error("Error fetching registration trends:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// GET Top 10 Sellers by Revenue
// Thêm hoặc sửa các endpoints trong analytics.ts
// GET top 10 sellers by revenue
router.get('/top-sellers', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.full_name as "fullName",
        u.email,
        u.phone,
        u.is_verified as "verified",
        u.avatar,
        COALESCE(SUM(CASE WHEN o.status = 'delivered' THEN oi.subtotal ELSE 0 END), 0) as "totalRevenue",
        COUNT(DISTINCT CASE WHEN o.status = 'delivered' THEN oi.order_id END) as "deliveredOrders",
        COUNT(DISTINCT oi.order_id) as "totalOrders"
      FROM users u
      LEFT JOIN order_items oi ON u.id = oi.seller_id
      LEFT JOIN orders o ON oi.order_id = o.id
      WHERE u.user_type = 'seller'
        AND o.status != 'cancelled'  -- Loại trừ đơn hàng đã hủy
      GROUP BY u.id, u.full_name, u.email, u.phone, u.is_verified, u.avatar
      ORDER BY "totalRevenue" DESC
      LIMIT 10
    `);
    
    // Format the result
    const topSellers = result.rows.map((row, index) => ({
      rank: index + 1,
      id: row.id,
      fullName: row.fullName,
      email: row.email,
      phone: row.phone,
      verified: row.verified,
      totalRevenue: parseFloat(row.totalRevenue),
      totalOrders: parseInt(row.totalOrders),
      deliveredOrders: parseInt(row.deliveredOrders),
      img: row.avatar || '/Portrait_Placeholder.png'
    }));
    
    res.json(topSellers);
  } catch (error) {
    console.error('Error fetching top sellers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET top 10 customers by spending
router.get('/top-customers', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.full_name as "fullName",
        u.email,
        u.phone,
        u.is_verified as "verified",
        u.avatar,
        COALESCE(SUM(CASE WHEN o.status = 'delivered' THEN o.total_amount ELSE 0 END), 0) as "totalSpent",
        COUNT(DISTINCT CASE WHEN o.status = 'delivered' THEN o.id END) as "deliveredOrders",
        COUNT(DISTINCT o.id) as "totalOrders"
      FROM users u
      LEFT JOIN orders o ON u.id = o.customer_id
      WHERE u.user_type = 'customer'
        AND o.status != 'cancelled'  -- Loại trừ đơn hàng đã hủy
      GROUP BY u.id, u.full_name, u.email, u.phone, u.is_verified, u.avatar
      ORDER BY "totalSpent" DESC
      LIMIT 10
    `);
    
    // Format the result
    const topCustomers = result.rows.map((row, index) => ({
      rank: index + 1,
      id: row.id,
      fullName: row.fullName,
      email: row.email,
      phone: row.phone,
      verified: row.verified,
      totalSpent: parseFloat(row.totalSpent),
      totalOrders: parseInt(row.totalOrders),
      deliveredOrders: parseInt(row.deliveredOrders),
      img: row.avatar || '/Portrait_Placeholder.png'
    }));
    
    res.json(topCustomers);
  } catch (error) {
    console.error('Error fetching top customers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// GET REVENUE DATA
router.get("/revenue-data", async (req, res) => {
  try {
    const query = `
      SELECT 
        TO_CHAR(date_trunc('day', created_at), 'DD/MM') as label,
        COALESCE(SUM(total_amount), 0) as revenue
      FROM orders
      WHERE status = 'delivered' AND created_at >= NOW() - INTERVAL '30 days'
      GROUP BY date_trunc('day', created_at)
      ORDER BY date_trunc('day', created_at) ASC
    `

    const result = await pool.query(query)
    const data = result.rows.map((row) => ({
      label: row.label,
      revenue: Number.parseFloat(row.revenue) || 0,
    }))

    res.json(data)
  } catch (error) {
    console.error("Error fetching revenue data:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// GET ORDER STATISTICS
router.get("/order-stats", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_orders,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'delivered') as delivered,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled
      FROM orders
    `)

    const stats = result.rows[0]
    res.json({
      totalOrders: Number.parseInt(stats.total_orders) || 0,
      pending: Number.parseInt(stats.pending) || 0,
      delivered: Number.parseInt(stats.delivered) || 0,
      cancelled: Number.parseInt(stats.cancelled) || 0,
    })
  } catch (error) {
    console.error("Error fetching order stats:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// GET SELLER STATISTICS
router.get("/seller-stats", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_sellers,
        COUNT(*) FILTER (WHERE is_verified = true) as verified_sellers,
        COUNT(*) FILTER (WHERE is_verified = false) as unverified_sellers
      FROM users
      WHERE user_type = 'seller'
    `)

    const stats = result.rows[0]
    res.json({
      totalSellers: Number.parseInt(stats.total_sellers) || 0,
      verifiedSellers: Number.parseInt(stats.verified_sellers) || 0,
      unverifiedSellers: Number.parseInt(stats.unverified_sellers) || 0,
    })
  } catch (error) {
    console.error("Error fetching seller stats:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// GET BUYER STATISTICS
router.get("/buyer-stats", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_buyers,
        COUNT(*) FILTER (WHERE is_verified = true) as verified_buyers,
        COUNT(*) FILTER (WHERE is_verified = false) as unverified_buyers
      FROM users
      WHERE user_type = 'customer'
    `)

    const stats = result.rows[0]
    res.json({
      totalBuyers: Number.parseInt(stats.total_buyers) || 0,
      verifiedBuyers: Number.parseInt(stats.verified_buyers) || 0,
      unverifiedBuyers: Number.parseInt(stats.unverified_buyers) || 0,
    })
  } catch (error) {
    console.error("Error fetching buyer stats:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// GET USER REGISTRATIONS (alias for registration-trends)
router.get("/user-registrations", async (req, res) => {
  try {
    const query = `
      SELECT 
        TO_CHAR(date_trunc('week', created_at), 'DD/MM') as label,
        COUNT(*) FILTER (WHERE user_type = 'seller') as sellers,
        COUNT(*) FILTER (WHERE user_type = 'customer') as customers,
        COUNT(*) as total
      FROM users
      WHERE created_at >= NOW() - INTERVAL '12 weeks'
      GROUP BY date_trunc('week', created_at)
      ORDER BY date_trunc('week', created_at) ASC
    `

    const result = await pool.query(query)
    const data = result.rows.map((row) => ({
      label: row.label,
      sellers: Number.parseInt(row.sellers) || 0,
      customers: Number.parseInt(row.customers) || 0,
      total: Number.parseInt(row.total) || 0,
    }))

    res.json(data)
  } catch (error) {
    console.error("Error fetching user registrations:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// GET PRODUCT REGISTRATIONS
router.get("/product-registrations", async (req, res) => {
  try {
    const query = `
      SELECT 
        TO_CHAR(date_trunc('week', created_at), 'DD/MM') as label,
        COUNT(*) as total
      FROM products
      WHERE created_at >= NOW() - INTERVAL '12 weeks'
      GROUP BY date_trunc('week', created_at)
      ORDER BY date_trunc('week', created_at) ASC
    `

    const result = await pool.query(query)
    const data = result.rows.map((row) => ({
      label: row.label,
      total: Number.parseInt(row.total) || 0,
    }))

    res.json(data)
  } catch (error) {
    console.error("Error fetching product registrations:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router