"use server";
import { connectToDatabase } from "../../db/query";

export const deleteRoundById = async (roundId: number): Promise<void> => {
  const db = await connectToDatabase();
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM rounds WHERE id = ?";

    db.run(sql, [roundId], function (err) {
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
