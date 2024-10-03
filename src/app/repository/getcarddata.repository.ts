"use server";
export type CardData = {
  playerNames: string[];
  stations: number;
  puttsPerStation: { rounds: number; putts: number };
};

export const getCardData = async (): Promise<CardData> => {
  return Promise.resolve({
    playerNames: [
      "Player 1",
      "Player 2",
      "Player 3",
      "Player 4",
      "Anne",
      "Andreas",
    ],
    stations: 6,
    puttsPerStation: { rounds: 3, putts: 5 },
  });
};
