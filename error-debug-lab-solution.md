# Error Debug Lab — Solution (Instructor Key)

This document walks through the **intended fix order** and gives the **exact code edits** to make the project work end‑to‑end.

---

## Quick sanity check (starting point)

From the repo root:

```bash
npm run install:all

# DB (example uses debug_lab)
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS debug_lab;"
mysql -u root -p debug_lab < db/schema.sql

cp server/.env.example server/.env
# edit server/.env:
#   PORT=4111 (or your assigned port)
#   DB_HOST=...
#   DB_USER=...
#   DB_PASSWORD=...
#   DB_NAME=debug_lab

npm run build
npm start
```

---

# Bug 1 — Env var mismatch (server fails fast)

### Symptom
Server exits immediately with something like:

- `Missing required env var: DB_PASS`

### Cause
`server/src/config.js` reads `DB_PASS`, but the `.env.example` provides `DB_PASSWORD`.

### Fix (edit `server/src/config.js`)

```diff
diff --git a/server/src/config.js b/server/src/config.js
--- a/server/src/config.js
+++ b/server/src/config.js
@@ -16,7 +16,7 @@ export const config = {
     user: requireEnv('DB_USER'),

     // INTENTIONAL BUG (Bug 1):
     // .env.example uses DB_PASSWORD, but we are reading DB_PASS.
-    password: requireEnv('DB_PASS'),
+    password: requireEnv('DB_PASSWORD'),

     database: requireEnv('DB_NAME'),
   },
 };
```

Re-run:

```bash
npm start
```

---

# Bug 2 — SQL column typo (API returns 500)

### Symptom
The page loads, but the UI shows an API error.
Server logs show a SQL error (unknown column).

### Cause
`server/src/db.js` selects `titel` instead of `title`.

### Fix (edit `server/src/db.js`)

```diff
diff --git a/server/src/db.js b/server/src/db.js
--- a/server/src/db.js
+++ b/server/src/db.js
@@ -28,7 +28,7 @@ export async function getPosts() {
   const p = getPool();

   // INTENTIONAL BUG (Bug 2):
   // column name is `title` in db/schema.sql, but we request `titel` here.
-  const [rows] = await p.query('SELECT id, titel, body, created_at FROM posts ORDER BY id DESC');
+  const [rows] = await p.query('SELECT id, title, body, created_at FROM posts ORDER BY id DESC');
   return rows;
 }
```

Re-run:

```bash
npm start
```

Test API quickly:

```bash
curl http://localhost:YOUR_PORT/api/posts
```

You should now get JSON like:

```json
{ "posts": [ ... ] }
```

---

# Bug 3 — Wrong API route (404)

### Symptom
Server is healthy, `/api/posts` works in the browser, but the UI still reports **404 Not Found**.

### Cause
Client fetches `/api/post` (singular), but server route is `/api/posts`.

### Fix (edit `client/src/api.js`)

```diff
diff --git a/client/src/api.js b/client/src/api.js
--- a/client/src/api.js
+++ b/client/src/api.js
@@ -1,7 +1,7 @@
 export async function fetchPosts() {
   // INTENTIONAL BUG (Bug 3):
   // Server route is /api/posts, but we request /api/post (404).
-  const res = await fetch('/api/post');
+  const res = await fetch('/api/posts');
   if (!res.ok) {
     const txt = await res.text();
     throw new Error(`Request failed: ${res.status} ${txt}`);
   }
   return res.json();
 }
```

Now rebuild + restart (because React is served as a built bundle):

```bash
npm run build
npm start
```

---

# Bug 4 — React render crash (posts is null / unexpected shape)

### Symptom
UI crashes during rendering with an error like:

- `Cannot read properties of null (reading 'map')`

### Cause
`posts` starts as `null`, but the UI calls `posts.map(...)` immediately.

### Fix option A (recommended): treat `posts` as an array and show loading state

Edit `client/src/pages/PostsPage.jsx`:

```diff
diff --git a/client/src/pages/PostsPage.jsx b/client/src/pages/PostsPage.jsx
--- a/client/src/pages/PostsPage.jsx
+++ b/client/src/pages/PostsPage.jsx
@@ -3,7 +3,7 @@ import { fetchPosts } from '../api.js';

 export default function PostsPage() {
-  const [posts, setPosts] = useState(null);
+  const [posts, setPosts] = useState([]);
   const [error, setError] = useState('');

   useEffect(() => {
@@ -10,7 +10,7 @@ export default function PostsPage() {
       try {
         setError('');
         const data = await fetchPosts();
-        setPosts(data.posts);
+        setPosts(Array.isArray(data.posts) ? data.posts : []);
       } catch (e) {
         setError(e.message);
       }
     })();
   }, []);
@@ -22,18 +22,27 @@ export default function PostsPage() {
     );
   }

-  // INTENTIONAL BUG (Bug 4):
-  // If `posts` is still null, this will throw.
-  // Also if the API shape changes, this will throw.
+  // If the list is empty, show a friendly message.
   return (
     <div>
       <h2>Posts</h2>
+      {posts.length === 0 ? (
+        <p>No posts yet.</p>
+      ) : null}
       <ul>
         {posts.map((p) => (
           <li key={p.id}>
-            <strong>{p.title.toUpperCase()}</strong>
+            <strong>{String(p.title ?? '').toUpperCase()}</strong>
             <div style={{ opacity: 0.8 }}>{p.body}</div>
           </li>
         ))}
       </ul>
     </div>
   );
 }
```

Rebuild + restart:

```bash
npm run build
npm start
```

---

# Bug 5 — Error Boundary not wired (resilient UI)

### Symptom
If a render error happens, the UI is ugly / unhelpful.
There is an `ErrorBoundary` component, but it isn’t actually used.

### Fix (edit `client/src/main.jsx`)

Wrap `<App/>` in `<ErrorBoundary>`:

```diff
diff --git a/client/src/main.jsx b/client/src/main.jsx
--- a/client/src/main.jsx
+++ b/client/src/main.jsx
@@ -4,9 +4,11 @@ import App from './App.jsx';
 import ErrorBoundary from './components/ErrorBoundary.jsx';

 ReactDOM.createRoot(document.getElementById('root')).render(
   <React.StrictMode>
     {/* Bug 5: wire up ErrorBoundary properly (it exists, but is not used correctly yet). */}
-    <App />
+    <ErrorBoundary>
+      <App />
+    </ErrorBoundary>
   </React.StrictMode>
 );
```

Rebuild + restart:

```bash
npm run build
npm start
```

---

## Final “working” checks

1) Home page shows seeded posts from the DB.
2) Add a post:
- go to **Add Post**
- submit a new post
- return home and see it listed
3) Verify API health:

```bash
curl http://localhost:YOUR_PORT/api/health
```

Should return JSON like:

```json
{ "ok": true, "posts_count": 4 }
```

---

## What each bug teaches (1 sentence each)

- **Bug 1:** configuration mismatches should fail fast and loudly.
- **Bug 2:** the DB is a contract; code must match schema.
- **Bug 3:** client/server routes are contracts too.
- **Bug 4:** treat API responses as untrusted and handle null/shape issues defensively.
- **Bug 5:** error boundaries prevent a single render failure from nuking the whole UI.
