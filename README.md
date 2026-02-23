# Error Handling / Debugging Lab (React + Express + MariaDB)

This repo is designed to be **cloned and run immediately**, and then fixed in class.
It contains **multiple intentional bugs** (different *types* of errors) that appear one after another as you fix them.

**Target setup time:** under 5 minutes.

---

## Prereqs

- Node 18+ and npm
- MariaDB or MySQL client tools (`mysql`)
- A MariaDB server you can connect to

---

## 0) Clone

```bash
git clone <THIS_REPO_URL>
cd error-debug-lab
```

---

## 1) Install dependencies

```bash
npm run install:all
```

---

## 2) Create & load the database (exact commands)

Choose a database name (we’ll use `debug_lab`).

### Create DB
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS debug_lab;"
```

### Create table + seed data
```bash
mysql -u root -p debug_lab < db/schema.sql
```

---

## 3) Create your `.env` (single port)

Copy the example and edit it.

```bash
cp server/.env.example server/.env
```

Edit **only** these values:

- `PORT` (one port only)
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME` (should be `debug_lab` if you used the commands above)

---

## 4) Build the client + start the server

The Express server serves both:
- the built React app
- the API under `/api`

```bash
npm run build
npm start
```

Then open:

- http://localhost:YOUR_PORT

---

# The Lab: staged bugs

You will hit these in order.

## Bug 1 — Configuration / Env var mismatch (server fails fast)
**Symptom:** server exits immediately and prints a message about a missing env var.

**Goal:** fix the server so it reads the correct env variable name.

- File: `server/src/config.js`
- Hint: compare what the server expects vs what `.env.example` provides.

---

## Bug 2 — Database query error (500 from API)
**Symptom:** app loads, but the UI shows an API error, and server logs show a SQL error.

**Goal:** fix the SQL query.

- File: `server/src/db.js`
- Hint: check column names vs `db/schema.sql`.

---

## Bug 3 — Wrong API route (404)
**Symptom:** API is healthy, but the UI still shows “Not Found”.

**Goal:** fix the client fetch URL.

- File: `client/src/api.js`

---

## Bug 4 — React rendering crash (component error)
**Symptom:** UI crashes while rendering the list.

**Goal:** handle unexpected data safely (and keep the UI alive).

- File: `client/src/pages/PostsPage.jsx`
- Hint: your app should not assume the API always returns the shape you *wish* it returned.

---

## Bug 5 — Error boundaries / user-friendly errors
**Symptom:** ugly crash UI or raw errors.

**Goal:** use a React Error Boundary and show a clean message to users.

- Files:
  - `client/src/components/ErrorBoundary.jsx`
  - `client/src/main.jsx`

---

## What “done” looks like

- Visiting `/` shows a list of posts from the DB.
- Adding a post works.
- If the API fails, the UI shows a friendly error message (not a stack trace).
- Server logs show errors with context (route + error).

---

## Instructor notes (optional)

There are multiple teachable points here:

- Errors propagate up the stack unless handled.
- Logging ≠ handling.
- Centralized server error middleware prevents crashes.
- The UI should treat API responses as untrusted input.

