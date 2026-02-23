import mysql from 'mysql2/promise';
import { config } from './config.js';

let pool;

/**
 * Lazily create the pool.
 * If config is wrong, this will throw — which we want students to see early.
 */
export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      waitForConnections: true,
      connectionLimit: 5,
      namedPlaceholders: true,
    });
  }
  return pool;
}

export async function getPosts() {
  const p = getPool();

  // INTENTIONAL BUG (Bug 2):
  // column name is `title` in db/schema.sql, but we request `titel` here.
  const [rows] = await p.query('SELECT id, titel, body, created_at FROM posts ORDER BY id DESC');
  return rows;
}

export async function addPost({ title, body }) {
  const p = getPool();
  const [result] = await p.execute(
    'INSERT INTO posts (title, body) VALUES (?, ?)',
    [title, body]
  );
  return { id: result.insertId, title, body };
}
