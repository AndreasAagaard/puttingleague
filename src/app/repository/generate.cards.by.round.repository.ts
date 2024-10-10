"use server";
import { DB } from "@/db/query";
import { getPlayersByRoundId, Player } from "./get.players.by.round.repository";

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
  return new Promise((resolve, reject) => {
    const insertGroup = DB.prepare(
      "INSERT INTO groups (player_id, 'group') VALUES (?, ?)",
    );
    DB.serialize(() => {
      assignments.forEach(({ player_id, group }) => {
        insertGroup.run(player_id, group, (err) => {
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
