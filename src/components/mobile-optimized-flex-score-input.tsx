"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { updateScore } from "@/app/repository/update.score.repository";
import { useParams, useRouter } from "next/navigation";

export interface Scores {
  station: number;
  makes: { attempt: number; putts: number }[];
}

export interface PlayerWithScores {
  id: number;
  name: string;
  scores: Scores[];
}

export interface RoundSettings {
  stations: number;
  puttsPerStation: { rounds: number; putts: number };
}

interface ScoreInputProps {
  existingPlayers: PlayerWithScores[];
  settings: RoundSettings;
}

export function MobileOptimizedFlexScoreInputComponent({
  existingPlayers,
  settings,
}: ScoreInputProps) {
  const router = useRouter();
  const params = useParams<{ round: string; group: string }>();
  const [players, setPlayers] = useState<PlayerWithScores[]>(
    existingPlayers.map((player) => ({
      name: player.name,
      id: player.id,
      scores: player.scores,
    })),
  );
  const [currentStation, setCurrentStation] = useState(1);

  const updateScoreAsync = async (
    playerIndex: number,
    roundIndex: number,
    score: number,
  ) => {
    const newPlayers = [...players];
    const playerScores = newPlayers[playerIndex].scores;
    const stationScores = playerScores.find(
      (s) => s.station === currentStation,
    );

    if (stationScores) {
      stationScores.makes[roundIndex].putts = score;
    }

    setPlayers(newPlayers);

    try {
      await updateScore({
        player_id: newPlayers[playerIndex].id,
        station_number: currentStation,
        attempt: roundIndex,
        score: score,
      });
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  const calculateTotalScore = (player: PlayerWithScores) => {
    return player.scores.reduce((sum, station) => {
      return (
        sum + station.makes.reduce((sum, attempt) => sum + attempt.putts, 0)
      );
    }, 0);
  };

  const navigateStation = (direction: "prev" | "next") => {
    if (direction === "prev" && currentStation > 1) {
      setCurrentStation(currentStation - 1);
    } else if (direction === "next" && currentStation < settings.stations) {
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
            disabled={currentStation === settings.stations}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {players.map((player, playerIndex) => (
            <Card key={playerIndex} className="p-3 mt-2">
              <div key={playerIndex} className="mb-4">
                <Label className="font-semibold mb-2 block">
                  {player.name}
                </Label>
                <div className="grid grid-cols-3 pl-8 pr-4">
                  {Array.from({ length: settings.puttsPerStation.rounds }).map(
                    (_, roundIndex) => {
                      const stationScores = player.scores.find(
                        (s) => s.station === currentStation,
                      );
                      const roundScore =
                        stationScores?.makes[roundIndex]?.putts || 0;

                      return (
                        <div
                          key={roundIndex}
                          className="flex flex-col items-center ml-8 "
                        >
                          <Label
                            htmlFor={`player-${playerIndex}-round-${roundIndex}`}
                            className="text-sm mb-4"
                          >
                            {roundIndex + 1}. Forsøg
                          </Label>
                          <Input
                            id={`player-${playerIndex}-round-${roundIndex}`}
                            type="number"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            min="0"
                            max={settings.puttsPerStation.putts}
                            value={roundScore}
                            onChange={(e) =>
                              updateScoreAsync(
                                playerIndex,
                                roundIndex,
                                parseInt(e.target.value) || 0,
                              )
                            }
                            className="w-12 h-12 text-center p-0"
                          />
                        </div>
                      );
                    },
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
                      {player.scores.map((station, stationIndex) => (
                        <div
                          key={stationIndex}
                          className="flex-1 min-w-[5rem] text-center bg-secondary rounded-md p-1"
                        >
                          <div className="font-thin italic opacity-75">
                            Station {station.station}
                          </div>
                          <div className="p-1 font-semibold">
                            {station.makes.reduce(
                              (sum, attempt) => sum + attempt.putts,
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
                      {calculateTotalScore(player)} /{" "}
                      {settings.stations *
                        settings.puttsPerStation.rounds *
                        settings.puttsPerStation.putts}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Button
        className="w-full mt-4"
        onClick={() => router.push(`/rounds/${params.round}/leaderboard`)}
      >
        Afslut score
      </Button>
    </div>
  );
}
