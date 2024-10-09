"use server";

import { DB } from "@/db/query";

export const deleteGroupsByRoundId = (roundId: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    const sql = `
      DELETE FROM groups
      WHERE player_id IN (
        SELECT id FROM players WHERE round_id = ?
      )
    `;

    DB.run(sql, [roundId], function (err) {
      if (err) {
        console.error("Error deleting groups:", err);
        return reject(err);
      }
      console.log(
        `Deleted ${this.changes} groups associated with round ID ${roundId}.`,
      );
      resolve();
    });
  });
};
