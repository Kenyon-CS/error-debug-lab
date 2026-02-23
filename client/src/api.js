export async function fetchPosts() {
  // INTENTIONAL BUG (Bug 3):
  // Server route is /api/posts, but we request /api/post (404).
  const res = await fetch('/api/posts');
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Request failed: ${res.status} ${txt}`);
  }
  return res.json();
}

export async function createPost({ title, body }) {
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || 'Failed to create post');
  }
  return data;
}
