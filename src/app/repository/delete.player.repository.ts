"use server";
import { connectToDatabase } from "../../db/query";

export const deletePlayerById = async (playerId: number): Promise<void> => {
  const db = await connectToDatabase();
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      const deleteScoresSql = "DELETE FROM scores WHERE player_id = ?";
      db.run(deleteScoresSql, [playerId], function (err) {
        if (err) {
          console.error("Error deleting scores:", err);
          db.run("ROLLBACK");
          return reject(err);
        }
      });

      const deletePlayerSql = "DELETE FROM players WHERE id = ?";
      db.run(deletePlayerSql, [playerId], function (err) {
        if (err) {
          console.error("Error deleting player:", err);
          db.run("ROLLBACK");
          return reject(err);
        } else if (this.changes === 0) {
          db.run("ROLLBACK");
          return reject(new Error("No player found with the given ID"));
        } else {
          db.run("COMMIT", (commitErr) => {
            if (commitErr) {
              console.error("Error committing transaction:", commitErr);
              db.run("ROLLBACK");
              reject(commitErr);
            } else {
              resolve();
            }
          });
        }
      });
    });
  });
};
