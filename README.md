# Error Debug Lab (React + Express + MariaDB) — Student Setup

You will **clone this repo**, add your **assigned PORT** + **your existing MariaDB credentials**, then run **one SQL script that adds a single table** to your **already‑existing database**.

This project intentionally contains **several bugs**. Your job in class is to run it, observe failures, and fix them one at a time.

---

## What you need before you start

- Node.js 18+ (or 20+)
- MariaDB access (you already have this)
- A database you already use for class (you will **NOT** create a new database)

---

## 0) Clone the repo

```bash
git clone <REPLACE_WITH_REPO_URL>
cd error-debug-lab
```

---

## 1) Install dependencies (one command)

From the repo root:

```bash
npm run install:all
```

---

## 2) Configure the server (.env) — ONE PORT ONLY

Copy the example file:

```bash
cp server/.env.example server/.env
```

Edit `server/.env` and set:

- `PORT` to **your assigned port**
- DB fields to your existing MariaDB credentials
- `DB_NAME` to the name of your **existing database** (the one you already use)

Example:

```env
PORT=4117

DB_HOST=127.0.0.1
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_existing_database_name
```

Important:
- The system uses **only this one PORT**.
- The server serves both the API and the built React site.

---

## 3) Add the lab table to YOUR existing database

This lab uses a single table named `posts`.

Run this exact command (replace the placeholders with **your info**):

```bash
mysql -h "$DB_HOST" -u "$DB_USER" -p "$DB_NAME" < db/schema.sql
```

Notes:
- You will be prompted for your password (the `-p` flag).
- This script is safe to re-run because it uses `CREATE TABLE IF NOT EXISTS` and re-seeds only if the table is empty.

If you prefer a fully explicit version:

```bash
mysql -h 127.0.0.1 -u your_user -p your_existing_database_name < db/schema.sql
```

---

## 4) Build the client (required)

Because the server serves the built frontend, you must build once before running:

```bash
npm run build
```

---

## 5) Start the server

```bash
npm start
```

Now open:

- http://localhost:PORT

(Use the same PORT you set in `server/.env`.)

---

## If something breaks immediately…

That’s the point 🙂

This project contains **intentional bugs** in:
- env/config wiring
- SQL queries / schema agreement
- client ↔ server route contracts
- React rendering assumptions
- error-boundary resilience

Work through them in class.

---

## Useful commands

Rebuild the client after frontend changes:

```bash
npm run build
```

Restart server:

```bash
npm start
```

Quick API test:

```bash
curl http://localhost:PORT/api/health
curl http://localhost:PORT/api/posts
```

---

## Repo layout

- `client/` — React app (Vite)
- `server/` — Express server (serves API + static built client)
- `db/schema.sql` — creates the `posts` table and inserts a few rows

---

## How the server is used

- API routes: `/api/...`
- Static site: built files in `client/dist/`
- Single port: Express serves **both** the API and the site
