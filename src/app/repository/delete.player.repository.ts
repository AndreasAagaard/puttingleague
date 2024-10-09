"use server";
import { DB } from "@/db/query";

export const deletePlayerById = (playerId: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM players WHERE id = ?";

    DB.run(sql, [playerId], function (err) {
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
