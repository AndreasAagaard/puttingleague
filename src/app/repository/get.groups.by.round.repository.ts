import { Group } from "@/components/group-selection";
import { DB } from "@/db/query"; // Ensure this imports your sqlite3 database instance

interface Player {
  id: number;
  name: string;
  card: number;
  roundId: number;
}

export const getGroupsByRoundId = (roundId: number): Promise<Group[]> => {
  const sql = `
    SELECT players.id, name, groups.'group' as "card", players.round_id as "roundId"
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
      if (!acc[player.card]) {
        acc[player.card] = {
          id: player.id,
          card: player.card,
          roundId: player.roundId,
          players: [],
        };
      }
      acc[player.card].players.push(player);
      return acc;
    },
    {} as Record<number, Group>,
  );

  return Object.values(groupsMap);
};
