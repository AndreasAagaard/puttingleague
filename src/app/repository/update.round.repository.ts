"use server";
import { DB } from "@/db/query";

export const updateRoundStatus = (
  roundId: number,
  isActive: boolean,
): Promise<void> => {
  const sql = `
    UPDATE rounds
    SET active = ?
    WHERE id = ?
  `;
  const active = isActive ? "Active" : "Inactive";
  return new Promise((resolve, reject) => {
    DB.run(sql, [active, roundId], function (err) {
      if (err) {
        console.error("Error updating round status:", err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
