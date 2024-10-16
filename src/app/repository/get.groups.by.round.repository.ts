import { Group } from "@/components/group-selection";
import { connectToDatabase } from "@/db/query";

interface Player {
  id: number;
  name: string;
  card: number;
  roundId: number;
}

export const getGroupsByRoundId = async (roundId: number): Promise<Group[]> => {
  const db = await connectToDatabase();
  const sql = `
    SELECT players.id, name, groups.'group' as "card", players.round_id as "roundId"
    FROM players
    LEFT JOIN groups ON players.id = groups.player_id
    WHERE round_id = ? AND groups.id IS NOT NULL
  `;

  return new Promise((resolve, reject) => {
    db.all(sql, [roundId], (err, rows) => {
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
