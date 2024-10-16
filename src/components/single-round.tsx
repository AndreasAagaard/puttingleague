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
import { Player } from "@/app/repository/get.players.by.round.repository";
import { deletePlayerById } from "@/app/repository/delete.player.repository";
import { generateGroups } from "@/app/repository/generate.cards.by.round.repository";
import { Group } from "./group-selection";
import { deleteGroupsByRoundId } from "@/app/repository/delete.groups.by.round.repository";

interface SingleRoundProps {
  existingRound: Round;
  existingPlayers: Player[];
  existingGroups: Group[];
}

export function SingleRoundComponent({
  existingRound,
  existingPlayers,
  existingGroups,
}: SingleRoundProps) {
  const [players, setPlayers] = useState<Player[]>(existingPlayers);
  const [groups, setGroups] = useState<Group[]>(existingGroups);
  const [round, setRound] = useState<Round>(existingRound);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [cardSize, setCardSize] = useState(4);
  const [groupsGenerated] = useState(groups.length > 0);

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

  const generateGroupsOnRound = async () => {
    await generateGroups(round.id, cardSize);
    window.location.reload();
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">{round.name}</h1>
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <Badge
              variant={round.active === "Active" ? "default" : "secondary"}
            >
              {round.active === "Active" ? "Aktiv" : "Inaktiv"}
            </Badge>
            <Button
              size={"sm"}
              onClick={() => {
                updateRoundStatus(round.id, round.active !== "Active");
                setRound({
                  ...round,
                  active: round.active === "Active" ? "Inactive" : "Active",
                });
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

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Spillere</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!groupsGenerated && (
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
            )}
            <ScrollArea className="min-h-[200px]">
              <ul className="space-y-2">
                {players.map((player, index) => (
                  <li key={index} className="bg-secondary p-2 rounded-md">
                    <div className="flex justify-between items-center">
                      {player.name}
                      {!groupsGenerated && (
                        <Button
                          onClick={() => {
                            deletePlayerById(player.id);
                            setPlayers(
                              players.filter((p) => p.id !== player.id),
                            );
                          }}
                          size={"sm"}
                          variant={"destructive"}
                        >
                          <XIcon className="h-4 w-4" color="black" />
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Grupper</CardTitle>
            {groupsGenerated && (
              <Button
                onClick={() => {
                  deleteGroupsByRoundId(groups[0].roundId);
                  setGroups([]);
                  window.location.reload();
                }}
                size={"sm"}
                variant={"destructive"}
              >
                <XIcon className="h-4 w-4" color="black" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {groupsGenerated ? (
            <ScrollArea className="min-h-[300px]">
              <ul className="space-y-2">
                {groups.map((group, index) => (
                  <li key={index} className="bg-secondary p-2 rounded-md">
                    <div className="flex flex-col">
                      <b>Gruppe {group.card}</b>
                      <ul className="space-y-1 mt-1">
                        {group.players.map((player, playerIndex) => (
                          <li key={playerIndex}>{player.name}</li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="font-extralight text-sm opacity-50">
                  Antal spillere pr. gruppe:
                </label>
                <div className="flex m-0 gap-2">
                  <Input
                    placeholder="Antal spillere pr. gruppe"
                    type="number"
                    value={cardSize}
                    max={players.length}
                    min={1}
                    onChange={(e) => setCardSize(parseInt(e.target.value))}
                  />
                  <Button onClick={generateGroupsOnRound}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Generer grupper
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
