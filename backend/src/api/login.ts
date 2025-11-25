import express, { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import  pool from '../db/db';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc' });
    }

    // Tìm user từ database
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const user = result.rows[0];

    // Kiểm tra mật khẩu
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    // Kiểm tra usertype (chỉ admin mới login được)
    if (user.usertype !== 'admin') {
      return res.status(403).json({ 
        message: `Tài khoản ${user.usertype} không có quyền truy cập admin panel`
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, usertype: user.usertype },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Trả về user info và token
    res.json({
      message: 'Đăng nhập thành công',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullname,
        usertype: user.usertype,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

export default router;