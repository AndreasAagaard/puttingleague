"use server";
import { DB } from "@/db/query";

export interface PlayerInsert {
  name: string;
  round_id: number;
}

export const insertPlayer = (player: PlayerInsert): Promise<void> => {
  const sql = `
    INSERT INTO players (name, round_id)
    VALUES (?, ?)
  `;

  const params = [player.name, player.round_id];

  return new Promise((resolve, reject) => {
    DB.run(sql, params, function (err) {
      if (err) {
        console.error("Error inserting player:", err);
        return reject(err);
      }
      resolve();
    });
  });
};
