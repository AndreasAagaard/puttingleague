import { connectToDatabase } from "../../db/query"; // Ensure this imports your sqlite3 database instance

export interface Player {
  id: number;
  name: string;
  roundId: number;
}

export const getPlayersByRoundId = async (
  roundId: number,
): Promise<Player[]> => {
  const db = await connectToDatabase();
  const sql = `
    SELECT id, name, round_id as roundId
    FROM players
    WHERE round_id = ?
  `;

  return new Promise((resolve, reject) => {
    db.all(sql, [roundId], (err, rows) => {
      if (err) {
        console.error("Error fetching players by roundId:", err);
        return reject(err);
      }
      resolve(rows as Player[]);
    });
  });
};
