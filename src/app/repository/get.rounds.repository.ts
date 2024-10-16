import { connectToDatabase } from "@/db/query";

export interface Round {
  id: number;
  name: string;
  active: string;
  stations: number;
  stations_rounds: number;
  stations_putts: number;
  dateCreated: string;
}

export const getRounds = async (): Promise<Round[]> => {
  const db = await connectToDatabase();
  const sql = `
    SELECT id, name, active, stations, stations_rounds, stations_putts, dateCreated
    FROM rounds
  `;

  return new Promise((resolve, reject) => {
    db.all(sql, [], (err, rows: Round[]) => {
      if (err) {
        console.error("Error fetching rounds:", err);
        return reject(err);
      }
      const sortedRounds = rows.sort((a, b) => {
        if (a.active === "Active" && b.active !== "Active") return -1;

        if (a.active !== "Active" && b.active === "Active") return 1;

        return (
          new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()
        );
      });
      resolve(sortedRounds);
    });
  });
};
