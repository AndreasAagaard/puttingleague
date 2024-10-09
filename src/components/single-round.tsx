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
import { generateGroups } from "@/app/repository/generate.cards.by.round.repository";
import { Group } from "./group-selection";
import { deleteGroupsByRoundId } from "@/app/repository/delete.groups.by.round.repository";

interface SingleRoundProps {
  round: Round;
  existingPlayers: Player[];
  existingGroups: Group[];
}

export function SingleRoundComponent({
  round,
  existingPlayers,
  existingGroups,
}: SingleRoundProps) {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>(existingPlayers);
  const [groups, setGroups] = useState<Group[]>(existingGroups);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [cardSize, setCardSize] = useState(4);
  const [groupsGenerated] = useState(groups.length > 0);
  // make useEffect to set bool if groups are generated
  // if groups are generated, show button to delete groups

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
    router.refresh();
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

      <Card className="mb-6">
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
            <ScrollArea className="max-h-[500px] min-h-[200px]">
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
                      {groupsGenerated ? null : (
                        <Button
                          onClick={() => {
                            deletePlayerById(player.id);
                            setPlayers(
                              players.filter((p) => p.id !== player.id),
                            );
                            router.refresh();
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
            {groupsGenerated ? (
              <Button
                onClick={() => {
                  deleteGroupsByRoundId(groups[0].roundId);
                  setGroups([]);
                  router.refresh();
                }}
                size={"sm"}
                variant={"destructive"}
              >
                <XIcon className="h-4 w-4" color="black" />
              </Button>
            ) : null}
          </div>
        </CardHeader>
        <CardContent>
          {groupsGenerated ? (
            <div className="space-y-4">
              <ScrollArea className="max-h-[500px] min-h-[200px]">
                <ul className="space-y-2">
                  {groups.map((group, index) => (
                    <li key={index} className="bg-secondary p-2 rounded-md">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "5px 10px",
                        }}
                      >
                        <div>
                          <b>Gruppe {group.card}</b>
                          <ul className="space-y-2">
                            {group.players.map((player, index) => (
                              <li key={index}>{player.name}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Antal spillere pr. gruppe"
                  type="number"
                  value={cardSize}
                  onChange={(e) => setCardSize(parseInt(e.target.value))}
                />
                <Button onClick={generateGroupsOnRound}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Generer grupper
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
