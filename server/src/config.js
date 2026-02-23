import 'dotenv/config';

function requireEnv(name) {
  const val = process.env[name];
  if (!val) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return val;
}

export const config = {
  port: Number(process.env.PORT || 4111),

  db: {
    host: requireEnv('DB_HOST'),
    user: requireEnv('DB_USER'),

    // INTENTIONAL BUG (Bug 1):
    // .env.example uses DB_PASSWORD, but we are reading DB_PASS.
    password: requireEnv('DB_PASS'),

    database: requireEnv('DB_NAME'),
  },
};
