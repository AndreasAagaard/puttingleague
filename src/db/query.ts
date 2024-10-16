"use server";
import { Database } from "sqlite3";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const dbPath = process.env.DATABASE_PATH;
if (!dbPath) throw new Error("DATABASE_PATH environment variable not set");

console.log(`DATABASE_PATH: ${dbPath}`);
console.log(`Attempting to connect to database at: ${dbPath}`);

export const connectToDatabase = (): Promise<Database> => {
  return new Promise((resolve, reject) => {
    const db = new Database(dbPath, (err) => {
      if (err) {
        console.error("Could not connect to database", err);
        reject(err);
      } else {
        console.log("Connected to database");
        resolve(db);
      }
    });
  });
};
