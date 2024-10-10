"use server";

import { DB } from "@/db/query";

interface Score {
  station: number;
  makes: { attempt: number; putts: number };
}

interface PlayerWithScores {
  player_id: number;
  name: string;
  scores: Score[] | "NO SCORES";
}

export const getPlayersInGroupWithScores = (
  groupId: number,
): Promise<PlayerWithScores[]> => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        p.id AS player_id,
        p.name,
        s.station_number AS station,
        s.attempt,
        s.score AS putts
      FROM groups g
      JOIN players p ON g.player_id = p.id
      LEFT JOIN scores s ON p.id = s.player_id
      WHERE g.group = ?
      ORDER BY p.id, s.station_number, s.attempt
    `;

    DB.all(sql, [groupId], (err, rows) => {
      if (err) {
        console.error("Error fetching players with scores:", err);
        return reject(err);
      }

      // Map rows to PlayerWithScores format
      const playersMap = new Map<number, PlayerWithScores>();

      rows.forEach((row) => {
        if (!playersMap.has(row.player_id)) {
          playersMap.set(row.player_id, {
            player_id: row.player_id,
            name: row.name,
            scores: [], // Initialize with an empty array
          });
        }

        const player = playersMap.get(row.player_id);

        if (row.station !== null) {
          // Ensure score data is present
          (player.scores as Score[]).push({
            station: row.station,
            makes: { attempt: row.attempt, putts: row.putts },
          });
        }
      });

      // Convert map to array and set scores to "NO SCORES" if scores list is empty
      const playersWithScores: PlayerWithScores[] = Array.from(
        playersMap.values(),
      ).map((player) => ({
        ...player,
        scores:
          (player.scores as Score[]).length > 0 ? player.scores : "NO SCORES",
      }));

      resolve(playersWithScores);
    });
  });
};
