import pkg from 'pg'; // ES module import for pg
const { Pool } = pkg;

// Detect if we're using Cloud SQL Proxy via TCP or socket
// For local Windows testing, use TCP (127.0.0.1)
const isWindows = process.platform === 'win32';
const defaultHost = isWindows ? '127.0.0.1' : `/cloudsql/sweng861-socialmediapc:us-central1:social-media-db`;

// Create a new PostgreSQL pool
const pool = new Pool({
  user: process.env.DB_USER || 'social_user',
  password: process.env.DB_PASSWORD || 'PApaloco0119!!',
  database: process.env.DB_NAME || 'social_media_db',
  host: process.env.DB_HOST || defaultHost,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  // optional SSL (uncomment if your DB requires it)
  // ssl: { rejectUnauthorized: false },
});

// Log connection status
pool.on('connect', () => {
  console.log('Connected to PostgreSQL successfully');
});

pool.on('error', (err) => {
  console.error('Unexpected error on PostgreSQL client', err);
});

export default pool;
