"use server";
import { DB } from "@/db/query";

export const deleteRoundById = (roundId: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM rounds WHERE id = ?";

    DB.run(sql, [roundId], function (err) {
      if (err) {
        console.error("Error deleting player:", err);
        reject(err);
      } else if (this.changes === 0) {
        reject(new Error("No player found with the given ID"));
      } else {
        resolve();
      }
    });
  });
};
