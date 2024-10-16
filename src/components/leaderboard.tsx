"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlayerWithScores, Scores } from "./mobile-optimized-flex-score-input";

interface LeaderboardProps {
  playersWithScores: PlayerWithScores[];
}

export function LeaderboardComponent({ playersWithScores }: LeaderboardProps) {
  const calculateTotalScore = (scores: Scores[]): number => {
    return scores.reduce(
      (total, station) =>
        total +
        station.makes.reduce(
          (stationTotal, make) => stationTotal + make.putts,
          0,
        ),
      0,
    );
  };

  const sortedPlayers = [...playersWithScores].sort(
    (a, b) => calculateTotalScore(b.scores) - calculateTotalScore(a.scores),
  );

  const stationNumbers = Array.from(
    new Set(
      playersWithScores.flatMap((player) =>
        player.scores.map((score) => score.station),
      ),
    ),
  ).sort((a, b) => a - b);

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Leaderboard</h1>
      <Card className="w-full mt-3 max-w-4xl mx-auto">
        <CardHeader></CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-200px)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  {stationNumbers.map((station) => (
                    <TableHead key={station} className="text-center text-xs">
                      Station {station}
                    </TableHead>
                  ))}
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPlayers.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell>{player.name}</TableCell>
                    {stationNumbers.map((station) => {
                      const stationScore = player.scores.find(
                        (score) => score.station === station,
                      );
                      const totalPutts = stationScore
                        ? stationScore.makes.reduce(
                            (total, make) => total + make.putts,
                            0,
                          )
                        : 0;
                      return (
                        <TableCell key={station} className="text-center">
                          {totalPutts}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-right font-bold">
                      {calculateTotalScore(player.scores)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
