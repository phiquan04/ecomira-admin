import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Function để test kết nối
export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    console.log('✅ Kết nối PostgreSQL thành công!');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Lỗi kết nối PostgreSQL:', error);
    return false;
  }
};

export default pool;