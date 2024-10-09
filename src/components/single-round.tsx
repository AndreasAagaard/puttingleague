"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, XIcon } from "lucide-react";
import { Round } from "@/app/repository/get.rounds.repository";
import { insertPlayer } from "@/app/repository/insert.player.repository";
import { updateRoundStatus } from "@/app/repository/update.round.repository";
import { useRouter } from "next/navigation";
import { Player } from "@/app/repository/get.players.by.round.repository";
import { deletePlayerById } from "@/app/repository/delete.player.repository";

interface SingleRoundProps {
  round: Round;
  existingPlayers: Player[];
}

export function SingleRoundComponent({
  round,
  existingPlayers,
}: SingleRoundProps) {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>(existingPlayers);
  const [newPlayerName, setNewPlayerName] = useState("");

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers(
        [
          ...players,
          {
            name: newPlayerName.trim(),
            id: players.length + 1,
            roundId: round.id,
          },
        ].sort((a, b) => a.name.localeCompare(b.name)),
      );
      setNewPlayerName("");
      insertPlayer({ name: newPlayerName.trim(), round_id: round.id });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">{round.name}</CardTitle>
            <Badge
              variant={round.active === "Active" ? "default" : "secondary"}
            >
              {round.active === "Active" ? "Aktiv" : "Inaktiv"}
            </Badge>
            <Button
              size={"sm"}
              onClick={() => {
                updateRoundStatus(round.id, round.active !== "Active");
                router.refresh();
              }}
              variant={"secondary"}
            >
              <b>{round.active === "Active" ? "Deaktiver" : "Aktiver"} </b>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <dt className="font-medium">Antal stationer:</dt>
              <dd>{round.stations}</dd>
            </div>
            <div>
              <dt className="font-medium">Runder pr. station:</dt>
              <dd>{round.stations_rounds}</dd>
            </div>
            <div>
              <dt className="font-medium">Putts pr. gang på station:</dt>
              <dd>{round.stations_putts}</dd>
            </div>
            <div>
              <dt className="font-medium">Total mængde putts:</dt>
              <dd>
                {round.stations * round.stations_rounds * round.stations_putts}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spillere</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Navn på spiller"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
              />
              <Button onClick={addPlayer}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Tilføj
              </Button>
            </div>
            <ScrollArea className="h-[200px]">
              <ul className="space-y-2">
                {players.map((player, index) => (
                  <li key={index} className="bg-secondary p-2 rounded-md">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "5px 10px",
                      }}
                    >
                      {player.name}
                      <Button
                        onClick={() => {
                          deletePlayerById(player.id);
                          setPlayers(players.filter((p) => p.id !== player.id));
                        }}
                        size={"sm"}
                        variant={"destructive"}
                      >
                        <XIcon className="h-4 w-4" color="black" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
