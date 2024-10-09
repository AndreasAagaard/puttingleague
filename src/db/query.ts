import { Database } from "sqlite3";
import dotenv from "dotenv";

dotenv.config();

// Use the DATABASE_PATH environment variable with a fallback
const dbPath = process.env.DATABASE_PATH;
if (!dbPath) throw new Error("DATABASE_PATH environment variable not set");

console.log(`Attempting to connect to database at: ${dbPath}`);

export const DB = new Database(dbPath, (err) => {
  if (err) {
    console.error("Could not connect to database", err);
  } else {
    console.log("Connected to database");
  }
});
