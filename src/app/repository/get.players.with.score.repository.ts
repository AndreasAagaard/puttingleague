"use server";

import {
  PlayerWithScores,
  Scores,
} from "@/components/mobile-optimized-flex-score-input";
import { connectToDatabase } from "@/db/query";

// Define a type that represents the structure of a row returned by the SQL query
interface PlayerRow {
  player_id: number;
  name: string;
  station: number | null;
  attempt: number | null;
  putts: number | null;
}

export const getPlayersWithScoresByRound = async (
  roundId: number,
): Promise<PlayerWithScores[]> => {
  const db = await connectToDatabase();
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        p.id AS player_id,
        p.name,
        s.station_number AS station,
        s.attempt,
        s.score AS putts
      FROM players p
      LEFT JOIN scores s ON p.id = s.player_id
      WHERE p.round_id = ?
      ORDER BY p.id, s.station_number, s.attempt
    `;

    // Type the rows as PlayerRow[]
    db.all(sql, [roundId], (err, rows: PlayerRow[]) => {
      if (err) {
        console.error("Error fetching players with scores:", err);
        return reject(err);
      }

      const playersMap = new Map<number, PlayerWithScores>();

      rows.forEach((row) => {
        if (!playersMap.has(row.player_id)) {
          playersMap.set(row.player_id, {
            id: row.player_id,
            name: row.name,
            scores: [],
          });
        }

        const player = playersMap.get(row.player_id);

        if (row.station !== null) {
          if (player?.scores.some((score) => score.station === row.station)) {
            const station = player?.scores.find(
              (score) => score.station === row.station,
            );
            if (station) {
              station.makes.push({
                attempt: row.attempt || 0,
                putts: row.putts || 0,
              });
            }
          } else {
            (player?.scores as Scores[]).push({
              station: row.station,
              makes: [{ attempt: row.attempt || 0, putts: row.putts || 0 }],
            });
          }
        }
      });

      const playersWithScores: PlayerWithScores[] = Array.from(
        playersMap.values(),
      ).map((player) => ({
        ...player,
        scores: (player.scores as Scores[]).length > 0 ? player.scores : [],
      }));

      resolve(playersWithScores);
    });
  });
};
