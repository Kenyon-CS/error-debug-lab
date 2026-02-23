import React, { useState } from 'react';
import { createPost } from '../api.js';

export default function AddPostPage({ onDone }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState('');

  async function submit(e) {
    e.preventDefault();
    try {
      setStatus('');
      await createPost({ title, body });
      setStatus('✅ Created');
      onDone?.();
    } catch (e) {
      setStatus('❌ ' + e.message);
    }
  }

  return (
    <div>
      <h2>Add Post</h2>
      <form onSubmit={submit} style={{ display: 'grid', gap: 10, maxWidth: 520 }}>
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%' }} />
        </label>
        <label>
          Body
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} style={{ width: '100%' }} />
        </label>
        <button type="submit">Create</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}
