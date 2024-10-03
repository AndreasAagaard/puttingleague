"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Player {
  name: string;
}

interface Group {
  card: number;
  players: Player[];
}

export interface GroupSelectionProps {
  groups: Group[];
}

export function GroupSelectionComponent({ groups }: GroupSelectionProps) {
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);

  const handleGroupSelect = (cardNumber: number) => {
    setSelectedGroup(cardNumber);
  };

  const handleConfirm = () => {
    if (selectedGroup !== null) {
      router.push(`/scores?card=${selectedGroup}`);
    }
  };
  console.log(groups);
  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Select Your Group</h1>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-4">
          {groups.map((group) => (
            <Card
              key={group.card}
              className={`cursor-pointer transition-colors ${
                selectedGroup === group.card ? "border-primary" : ""
              }`}
              onClick={() => handleGroupSelect(group.card)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Card {group.card}</CardTitle>
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
          ))}
        </div>
      </ScrollArea>
      <Button
        className="w-full mt-4"
        onClick={handleConfirm}
        disabled={selectedGroup === null}
      >
        Confirm Selection
      </Button>
    </div>
  );
}
