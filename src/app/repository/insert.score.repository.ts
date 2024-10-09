"use server";
import { DB } from "@/db/query";

export interface Score {
  station_number: number;
  score: number;
  player_id: number;
  attempt: number;
}

export const insertScore = (score: Score): Promise<void> => {
  const sql = `
    INSERT INTO scores (station_number, score, player_id, attempt)
    VALUES (?, ?, ?, ?)
  `;

  const params = [
    score.station_number,
    score.score,
    score.player_id,
    score.attempt,
  ];

  return new Promise((resolve, reject) => {
    DB.run(sql, params, function (err) {
      if (err) {
        console.error("Error inserting score:", err);
        return reject(err);
      }
      resolve();
    });
  });
};
