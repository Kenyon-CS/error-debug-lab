import React, { useState } from 'react';
import PostsPage from './pages/PostsPage.jsx';
import AddPostPage from './pages/AddPostPage.jsx';

export default function App() {
  const [route, setRoute] = useState(window.location.pathname);

  function navigate(path) {
    window.history.pushState({}, '', path);
    setRoute(path);
  }

  window.onpopstate = () => setRoute(window.location.pathname);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', margin: 24 }}>
      <h1>Debug Lab</h1>
      <nav style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Posts</a>
        <a href="/add" onClick={(e) => { e.preventDefault(); navigate('/add'); }}>Add Post</a>
      </nav>

      {route === '/add' ? <AddPostPage onDone={() => navigate('/')} /> : <PostsPage />}
      <hr />
      <p style={{ opacity: 0.7 }}>
        API health: <a href="/api/health" target="_blank" rel="noreferrer">/api/health</a>
      </p>
    </div>
  );
}
