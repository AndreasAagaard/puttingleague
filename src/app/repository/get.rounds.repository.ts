import { DB } from "@/db/query"; // Ensure this imports your sqlite3 database instance

export interface Round {
  id: number;
  name: string;
  active: string;
  stations: number;
  stations_rounds: number;
  stations_putts: number;
}

export const getRounds = (): Promise<Round[]> => {
  const sql = `
    SELECT id, name, active, stations, stations_rounds, stations_putts
    FROM rounds
  `;

  return new Promise((resolve, reject) => {
    DB.all(sql, [], (err, rows) => {
      if (err) {
        console.error("Error fetching rounds:", err);
        return reject(err);
      }
      resolve(rows as Round[]);
    });
  });
};
