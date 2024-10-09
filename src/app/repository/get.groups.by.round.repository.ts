import { Group } from "@/components/group-selection";
import { DB } from "@/db/query"; // Ensure this imports your sqlite3 database instance

interface Player {
  id: number;
  name: string;
  groupId: number;
}

export const getGroupsByRoundId = (roundId: number): Promise<Group[]> => {
  const sql = `
    SELECT players.id, name, groups.id as groupId
    FROM players
    LEFT JOIN groups ON players.id = groups.player_id
    WHERE round_id = ? AND groups.id IS NOT NULL
  `;

  return new Promise((resolve, reject) => {
    DB.all(sql, [roundId], (err, rows) => {
      if (err) {
        console.error("Error fetching players by roundId:", err);
        return reject(err);
      }
      resolve(mapPlayersToGroups(rows as Player[]));
    });
  });
};

const mapPlayersToGroups = (players: Player[]): Group[] => {
  const groupsMap = players.reduce(
    (acc, player) => {
      if (!acc[player.groupId]) {
        acc[player.groupId] = { card: player.groupId, players: [] };
      }
      acc[player.groupId].players.push(player);
      return acc;
    },
    {} as Record<number, Group>,
  );

  return Object.values(groupsMap);
};
