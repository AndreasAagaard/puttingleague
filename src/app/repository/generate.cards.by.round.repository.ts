// src/repositories/groupRepository.ts
import { DB } from "@/db/query";
import { getPlayersByRoundId, Player } from "./get.players.by.round.repository";

export const generateGroups = async (
  roundId: number,
  amount: number,
): Promise<void> => {
  try {
    const players: Player[] = await getPlayersByRoundId(roundId);

    shuffleArray(players);

    const groups: Player[][] = [];
    for (let i = 0; i < players.length; i += amount) {
      groups.push(players.slice(i, i + amount));
    }

    await insertGroups(roundId, groups);
  } catch (error) {
    console.error("Error generating groups:", error);
    throw error;
  }
};

const shuffleArray = (array: any[]): void => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const insertGroups = async (
  roundId: number,
  groups: Player[][],
): Promise<void> => {
  return new Promise((resolve, reject) => {
    DB.serialize(() => {
      const insertGroup = DB.prepare(
        "INSERT INTO groups (card, player_id, group) VALUES (?, ?)",
      );

      groups.forEach((group, index) => {
        insertGroup.run(index + 1, roundId, function (err) {
          if (err) {
            return reject(err);
          }

          const groupId = this.lastID;
          group.forEach((player) => {
            insertGroupPlayer.run(groupId, player.id, (err) => {
              if (err) {
                return reject(err);
              }
            });
          });
        });
      });

      insertGroup.finalize();
      insertGroupPlayer.finalize();
      resolve();
    });
  });
};
