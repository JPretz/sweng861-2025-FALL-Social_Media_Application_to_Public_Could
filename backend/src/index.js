import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from './db.js'; // ES module import

const app = express();

// JWT secret (store in env variable for production)
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const TEST_JWT = '8Ins8S3ILw7adb5gXFCXlcqWCvEw5Tyw'; // provided token

// DEBUG: log all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(helmet());
app.use(express.json());
app.use(cors());

// ---------------------------
// Routes
// ---------------------------

// Root route
app.get('/', (req, res) => res.send('Backend is running!'));

// Health check
app.get('/api/ping', (req, res) => res.json({ ok: true, ts: Date.now() }));

// Test database connectivity
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ now: result.rows[0].now });
  } catch (err) {
    console.error('DB test error:', err);
    res.status(500).json({ error: 'Database connection failed', details: err.message });
  }
});

// JWT authentication middleware (with optional fixed token)
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  // Optional: accept the provided fixed JWT token for testing
  if (token === TEST_JWT) {
    req.user = { user_id: 1, username: 'testuser' }; // mock user
    return next();
  }

  if (!token) return res.status(401).json({ message: 'Missing token' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// ---------------------------
// Application routes
// ---------------------------

// Posts route with GET instructions and POST
app.route('/api/posts')
  .get((req, res) => {
    res.json({
      message: 'Use POST /api/posts with JWT in Authorization header and JSON body: { "content": "..." }'
    });
  })
  .post(authenticateToken, async (req, res) => {
    const { content } = req.body || {};
    if (!content) return res.status(400).json({ error: 'Content is required' });

    const user_id = req.user.user_id;
    try {
      const result = await db.query(
        'INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING *',
        [user_id, content]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });

// Comments route
app.route('/api/comments')
  .get((req, res) => {
    res.json({
      message: 'Use POST /api/comments with JWT in Authorization header and JSON body: { "post_id": ..., "content": "..." }'
    });
  })
  .post(authenticateToken, async (req, res) => {
    const { post_id, content } = req.body || {};
    if (!post_id || !content) return res.status(400).json({ error: 'post_id and content are required' });

    const user_id = req.user.user_id;
    try {
      const result = await db.query(
        'INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
        [post_id, user_id, content]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });

// Likes route
app.route('/api/likes')
  .get((req, res) => {
    res.json({
      message: 'Use POST /api/likes with JWT in Authorization header and JSON body: { "post_id": ... }'
    });
  })
  .post(authenticateToken, async (req, res) => {
    const { post_id } = req.body || {};
    if (!post_id) return res.status(400).json({ error: 'post_id is required' });

    const user_id = req.user.user_id;
    try {
      const result = await db.query(
        'INSERT INTO likes (post_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
        [post_id, user_id]
      );
      res.json(result.rows[0] || { message: 'Already liked' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });

// Get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT posts.id, posts.content, posts.created_at, users.username
      FROM posts
      JOIN users ON posts.user_id = users.id
      ORDER BY posts.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get comments for a specific post
app.get('/api/comments/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    const result = await db.query(
      'SELECT comments.id, comments.content, comments.created_at, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE comments.post_id = $1 ORDER BY comments.created_at ASC',
      [postId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all likes for a post
app.get('/api/likes/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    const result = await db.query(
      'SELECT users.username FROM likes JOIN users ON likes.user_id = users.id WHERE likes.post_id = $1',
      [postId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Login route
app.route('/api/login')
  .get((req, res) => {
    res.json({
      message: 'Use POST /api/login with JSON body: { "username": "...", "password": "..." }'
    });
  })
  .post(async (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });

    try {
      const result = await db.query('SELECT * FROM users WHERE username=$1', [username]);

      if (result.rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const user = result.rows[0];
      const valid = await bcrypt.compare(password, user.password_hash);

      if (valid) {
        const token = jwt.sign({ user_id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ success: true, token });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });

// Catch-all 404 route
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.url} not found` });
});

// ---------------------------
// DEBUG: print all registered routes safely
// ---------------------------
setImmediate(() => {
  if (app._router && app._router.stack) {
    console.log('Registered routes:');
    app._router.stack.forEach((r) => {
      if (r.route && r.route.path) {
        console.log(Object.keys(r.route.methods), r.route.path);
      }
    });
  }
});

// Listen on environment variable PORT or default 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Backend running on ${PORT}`));
