import { DB } from "@/db/query"; // Ensure this imports your sqlite3 database instance

export interface Player {
  id: number;
  name: string;
  roundId: number;
}

export const getPlayersByRoundId = (roundId: number): Promise<Player[]> => {
  const sql = `
    SELECT id, name, round_id as roundId
    FROM players
    WHERE round_id = ?
  `;

  return new Promise((resolve, reject) => {
    DB.all(sql, [roundId], (err, rows) => {
      if (err) {
        console.error("Error fetching players by roundId:", err);
        return reject(err);
      }
      resolve(rows as Player[]);
    });
  });
};
