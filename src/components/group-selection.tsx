"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Round } from "@/app/repository/get.rounds.repository";
import { Player } from "@/app/repository/get.players.by.round.repository";
import { Trophy } from "lucide-react";

export interface Group {
  id: number;
  card: number;
  players: Player[];
  roundId: number;
}

export interface GroupSelectionProps {
  groups: Group[];
  round: Round;
}

export function GroupSelectionComponent({
  groups,
  round,
}: GroupSelectionProps) {
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);

  const handleGroupSelect = (cardNumber: number) => {
    setSelectedGroup(cardNumber);
  };

  const handleConfirm = () => {
    if (selectedGroup !== null) {
      router.push(`/rounds/${round.id}/${selectedGroup}`);
    }
  };

  const navigateToLeaderboard = () => {
    router.push(`/rounds/${round.id}/leaderboard`);
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <div className="flex justify-around items-center mb-4 ml-3">
        <h1 className="text-2xl font-bold">Vælg gruppe</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={navigateToLeaderboard}
          className="flex items-center"
        >
          <Trophy className="mr-2 h-4 w-4" />
          Scores
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-240px)]">
        <div className="space-y-4">
          {groups.length > 0 ? (
            groups.map((group) => (
              <Card
                key={group.card}
                className={`cursor-pointer transition-colors ${
                  selectedGroup === group.card ? "border-primary" : ""
                }`}
                onClick={() => handleGroupSelect(group.card)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Gruppe {group.card}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside">
                    {group.players.map((player, index) => (
                      <li key={index} className="text-sm">
                        {player.name}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center">Ingen grupper fundet</p>
          )}
        </div>
      </ScrollArea>
      <Button
        className="w-full mt-4"
        onClick={handleConfirm}
        disabled={selectedGroup === null}
      >
        Fortsæt
      </Button>
    </div>
  );
}
