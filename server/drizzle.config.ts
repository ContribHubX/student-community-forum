import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
import { Config } from "drizzle-kit";
dotenv.config();

export default defineConfig({
  dialect: "mysql",
  schema: "./src/database/schema/index.ts",
  out: "./src/database/migrations",
  dbCredentials: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "",
  },
  verbose: true,
  strict: true,
}) satisfies Config;
