"use server";
import { PlayerWithScores } from "@/components/mobile-optimized-flex-score-input";
import { connectToDatabase } from "@/db/query";

export const updatePlayersScores = async (
  playersWithScores: PlayerWithScores[],
): Promise<void> => {
  try {
    for (const player of playersWithScores) {
      for (const scoreEntry of player.scores) {
        for (const make of scoreEntry.makes) {
          await updateScore({
            player_id: player.id,
            station_number: scoreEntry.station,
            attempt: make.attempt,
            score: make.putts,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error updating player scores:", error);
    throw error;
  }
};

interface Score {
  station_number: number;
  score: number;
  player_id: number;
  attempt: number;
}

export const updateScore = async (score: Score): Promise<void> => {
  const db = await connectToDatabase();
  const sql = `
    UPDATE scores
    SET score = ?
    WHERE player_id = ? AND station_number = ? AND attempt = ?
  `;

  const params = [
    score.score,
    score.player_id,
    score.station_number,
    score.attempt,
  ];

  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Error updating score:", err);
        return reject(err);
      }
      resolve();
    });
  });
};
