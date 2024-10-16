"use server";

import { connectToDatabase } from "../../db/query";

export const deleteGroupsByRoundId = async (roundId: number): Promise<void> => {
  const db = await connectToDatabase();
  return new Promise((resolve, reject) => {
    const sql = `
      DELETE FROM groups
      WHERE player_id IN (
        SELECT id FROM players WHERE round_id = ?
      )
    `;

    db.run(sql, [roundId], function (err) {
      if (err) {
        console.error("Error deleting groups:", err);
        return reject(err);
      }

      resolve();
    });
  });
};
