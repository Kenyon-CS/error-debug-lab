import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../api.js';

export default function PostsPage() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setError('');
        const data = await fetchPosts();
        setPosts(data.posts);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []);

  if (error) {
    return (
      <div style={{ padding: 12, border: '1px solid #ccc' }}>
        <h2>Could not load posts</h2>
        <p style={{ color: 'crimson' }}>{error}</p>
      </div>
    );
  }

  // INTENTIONAL BUG (Bug 4):
  // If `posts` is still null, this will throw.
  // Also if the API shape changes, this will throw.
  return (
    <div>
      <h2>Posts</h2>
      <ul>
        {posts.map((p) => (
          <li key={p.id}>
            <strong>{p.title.toUpperCase()}</strong>
            <div style={{ opacity: 0.8 }}>{p.body}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
