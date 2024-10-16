"use server";
import { getPlayersByRoundId, Player } from "./get.players.by.round.repository";
import { insertScore, Score } from "./insert.score.repository";
import { getRounds } from "./get.rounds.repository";
import { connectToDatabase } from "@/db/query";

export const generateGroups = async (
  roundId: number,
  amount: number,
): Promise<void> => {
  try {
    const players: Player[] = await getPlayersByRoundId(roundId);

    shuffleArray(players);

    const numGroups = Math.ceil(players.length / amount);

    const assignments = players.map((player, index) => ({
      player_id: player.id,
      group: (index % numGroups) + 1,
    }));

    await insertGroups(assignments);
    const roundSettings = (await getRounds()).find(
      (round) => round.id === roundId,
    );
    if (!roundSettings) throw new Error("Round settings not found");
    assignments.forEach(async ({ player_id }) => {
      await insertEmptyScores(
        player_id,
        roundSettings.stations,
        roundSettings.stations_rounds,
      );
    });
  } catch (error) {
    console.error("Error generating groups:", error);
    throw error;
  }
};

const shuffleArray = (array: unknown[]): void => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const insertGroups = async (
  assignments: { player_id: number; group: number }[],
): Promise<void> => {
  const db = await connectToDatabase();
  return new Promise((resolve, reject) => {
    const insertGroup = db.prepare(
      "INSERT INTO groups (player_id, 'group') VALUES (?, ?)",
    );
    db.serialize(() => {
      assignments.forEach(({ player_id, group }) => {
        insertGroup.run(player_id, group, (err: unknown) => {
          if (err) {
            return reject(err);
          }
        });
      });
      insertGroup.finalize();
      resolve();
    });
  });
};

const insertEmptyScores = async (
  player_id: number,
  stations: number,
  attempt: number,
): Promise<void> => {
  for (let i = 0; i < stations; i++) {
    for (let j = 0; j < attempt; j++) {
      const score: Score = {
        station_number: i + 1,
        score: 0,
        player_id: player_id,
        attempt: j + 1,
      };
      await insertScore(score);
    }
  }
};
