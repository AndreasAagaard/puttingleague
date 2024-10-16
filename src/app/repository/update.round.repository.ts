"use server";
import { connectToDatabase } from "../../db/query";

export const updateRoundStatus = async (
  roundId: number,
  isActive: boolean,
): Promise<void> => {
  const db = await connectToDatabase();
  const sql = `
    UPDATE rounds
    SET active = ?
    WHERE id = ?
  `;
  const active = isActive ? "Active" : "Inactive";
  return new Promise((resolve, reject) => {
    db.run(sql, [active, roundId], function (err) {
      if (err) {
        console.error("Error updating round status:", err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
