"use server";
import { DB } from "@/db/query";

export interface RoundInsert {
  name: string;
  stations: number;
  stations_rounds: number;
  stations_putts: number;
}
export const insertRound = (round: RoundInsert): Promise<{ id: number }> => {
  const sql = `
    INSERT INTO rounds (name, stations, stations_rounds, stations_putts)
    VALUES (?, ?, ?, ?)
  `;

  const params = [
    round.name,
    round.stations,
    round.stations_rounds,
    round.stations_putts,
  ];

  return new Promise((resolve, reject) => {
    DB.run(sql, params, function (err) {
      if (err) {
        console.error("Error inserting round:", err);
        return reject(err);
      }
      resolve({ id: this.lastID });
    });
  });
};
