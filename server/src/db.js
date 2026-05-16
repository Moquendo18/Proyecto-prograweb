import pg from 'pg';

const pool = new pg.Pool({
  host: process.env.DB_HOST || '/tmp',
  port: parseInt(process.env.DB_PORT || '5433'),
  database: process.env.DB_NAME || 'tiktok_ulima',
  user: process.env.DB_USER || 'matias',
  password: process.env.DB_PASSWORD || '',
  max: 20,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  console.error('Pool error:', err);
});

export default {
  query: (text, params) => pool.query(text, params),
  pool,
};
