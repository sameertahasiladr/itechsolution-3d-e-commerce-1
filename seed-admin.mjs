
import "dotenv/config";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true },
});

const rl = createInterface({ input: stdin, output: stdout });

try {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing from .env");
  }

  const username = (await rl.question("Enter admin username: ")).trim();
  const password = await rl.question("Enter a new admin password: ");

  if (!username || password.length < 12) {
    throw new Error("Username is required; password must be at least 12 characters.");
  }

  const hash = await bcrypt.hash(password, 12);
  const now = new Date().toISOString();

  await pool.query(
    `INSERT INTO admin_users (username, password, created_at, updated_at)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (username)
     DO UPDATE SET password = EXCLUDED.password,
                   updated_at = EXCLUDED.updated_at`,
    [username, hash, now, now]
  );

  console.log(`Admin account "${username}" seeded successfully.`);
} catch (error) {
  console.error("Admin seeding failed:", error.message);
  process.exitCode = 1;
} finally {
  rl.close();
  await pool.end();
}
