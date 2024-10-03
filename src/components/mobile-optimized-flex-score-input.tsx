"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Player {
  name: string;
  scores: number[][];
}

interface ScoreInputProps {
  playerNames: string[];
  stations: number;
  puttsPerStation: { rounds: number; putts: number };
}

export function MobileOptimizedFlexScoreInputComponent({
  playerNames,
  stations,
  puttsPerStation,
}: ScoreInputProps) {
  const [players, setPlayers] = useState<Player[]>(
    playerNames.map((name) => ({
      name,
      scores: Array(stations)
        .fill([])
        .map(() => Array(puttsPerStation.rounds).fill(0)),
    })),
  );
  const [currentStation, setCurrentStation] = useState(1);

  const updateScore = (
    playerIndex: number,
    roundIndex: number,
    score: number,
  ) => {
    const newPlayers = [...players];
    newPlayers[playerIndex].scores[currentStation - 1][roundIndex] = score;
    setPlayers(newPlayers);
  };

  const calculateTotalScore = (scores: number[][]) => {
    return scores.reduce(
      (stationSum, station) =>
        stationSum + station.reduce((roundSum, round) => roundSum + round, 0),
      0,
    );
  };

  const navigateStation = (direction: "prev" | "next") => {
    if (direction === "prev" && currentStation > 1) {
      setCurrentStation(currentStation - 1);
    } else if (direction === "next" && currentStation < stations) {
      setCurrentStation(currentStation + 1);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Putting League</h1>
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => navigateStation("prev")}
            disabled={currentStation === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <CardTitle>Station {currentStation}</CardTitle>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => navigateStation("next")}
            disabled={currentStation === stations}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {players.map((player, playerIndex) => (
            <Card className="p-3 mt-2">
              <div key={playerIndex} className="mb-4">
                <Label className="font-semibold mb-2 block">
                  {player.name}
                </Label>
                <div className="grid grid-cols-3 pl-8 pr-8">
                  {Array.from({ length: puttsPerStation.rounds }).map(
                    (_, roundIndex) => (
                      <div
                        key={roundIndex}
                        className="flex flex-row items-center"
                      >
                        <Label
                          htmlFor={`player-${playerIndex}-round-${roundIndex}`}
                          className="text-sm mb-4"
                        ></Label>
                        <Input
                          id={`player-${playerIndex}-round-${roundIndex}`}
                          type="number"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          min="0"
                          max={puttsPerStation.putts}
                          value={
                            players[playerIndex].scores[currentStation - 1][
                              roundIndex
                            ] >= puttsPerStation.putts
                              ? puttsPerStation.putts
                              : players[playerIndex].scores[currentStation - 1][
                                  roundIndex
                                ]
                          }
                          onChange={(e) =>
                            updateScore(
                              playerIndex,
                              roundIndex,
                              parseInt(e.target.value) || 0,
                            )
                          }
                          className="w-12 h-12 text-center p-0"
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>
      <Tabs defaultValue="scores" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scores">Scores</TabsTrigger>
          <TabsTrigger value="totals">Totals</TabsTrigger>
        </TabsList>
        <TabsContent value="scores">
          <Card>
            <CardHeader>
              <CardTitle>All Stations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {players.map((player, playerIndex) => (
                  <div key={playerIndex}>
                    <h3 className="font-semibold mb-2">{player.name}</h3>
                    <div className="flex flex-wrap gap-3 text-sm">
                      {player.scores.map((stationScores, stationIndex) => (
                        <div
                          key={stationIndex}
                          className="flex-1 min-w-[5rem] text-center bg-secondary rounded-md p-1"
                        >
                          <div className="font-thin italic opacity-75">
                            Hul {stationIndex + 1}
                          </div>
                          <div className="p-1 font-semibold">
                            {stationScores.reduce(
                              (sum, score) => sum + score,
                              0,
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="totals">
          <Card>
            <CardHeader>
              <CardTitle>Total Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {players.map((player, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span>{player.name}:</span>
                    <span className="font-bold">
                      {calculateTotalScore(player.scores)} /{" "}
                      {stations *
                        puttsPerStation.rounds *
                        puttsPerStation.putts}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Button className="w-full mt-4" onClick={() => console.log(players)}>
        Submit Scores
      </Button>
    </div>
  );
}
