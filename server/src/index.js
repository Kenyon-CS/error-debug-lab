import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import morgan from 'morgan';
import { config } from './config.js';
import { getPosts, addPost } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(morgan('dev'));
app.use(express.json());

// ---- API ----
app.get('/api/health', async (req, res, next) => {
  try {
    // touches DB pool creation to surface config errors quickly
    const posts = await getPosts();
    res.json({ ok: true, posts_count: posts.length });
  } catch (err) {
    next(err);
  }
});

app.get('/api/posts', async (req, res, next) => {
  try {
    const posts = await getPosts();
    res.json({ posts });
  } catch (err) {
    next(err);
  }
});

app.post('/api/posts', async (req, res, next) => {
  try {
    const { title, body } = req.body || {};
    if (!title || !body) {
      return res.status(400).json({ error: 'title and body are required' });
    }
    const post = await addPost({ title, body });
    res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
});

// ---- Serve built client ----
// This repo expects you to run `npm run build` from the root first.
const clientDist = path.join(__dirname, '..', '..', 'client', 'dist');
app.use(express.static(clientDist));

app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

// ---- Centralized error middleware ----
app.use((err, req, res, next) => {
  // Log (for developers)
  console.error('[SERVER ERROR]', {
    method: req.method,
    path: req.originalUrl,
    message: err?.message,
    code: err?.code,
  });

  // Respond (for users)
  res.status(500).json({
    error: 'Server error',
    message: 'Something went wrong on the server.',
  });
});

app.listen(config.port, () => {
  console.log(`Server listening on http://localhost:${config.port}`);
});
