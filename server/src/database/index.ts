import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

// Create the pool connection
export const poolConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Initialize drizzle with the connection pool
export const database = drizzle(poolConnection, {
  schema,
  mode: "default",
});

// Function to check the database connection and query using Drizzle ORM
const checkDatabaseConnection = async () => {
  try {
    // const rows = await database.select().from(ThreadTable);

    // Log the result
    console.log("Database connection successful");
    // console.log('Threads retrieved:', rows);
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

checkDatabaseConnection();
