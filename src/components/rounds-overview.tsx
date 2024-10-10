"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Round } from "@/app/repository/get.rounds.repository";
import Link from "next/link";
import { CircleArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

interface RoundsOverviewProps {
  rounds: Round[];
}

export function RoundsOverviewComponent({ rounds }: RoundsOverviewProps) {
  const [isFormerRoundsOpen, setIsFormerRoundsOpen] = useState(false);
  const activeRounds = rounds.filter(round => round.active === "Active");
  const formerRounds = rounds.filter(round => round.active !== "Active");

  const RoundCard = ({ round }: { round: Round }) => (
    <Link href={`/rounds/${round.id}`}>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{round.name}</CardTitle>
            <Badge
              variant={round.active === "Active" ? "default" : "secondary"}
            >
              {round.active === "Active" ? "Aktiv" : "Inaktiv"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <dt className="font-medium">Stationer:</dt>
              <dd>{round.stations}</dd>
            </div>
            <div>
              <dt className="font-medium">Runder pr. station:</dt>
              <dd>{round.stations_rounds}</dd>
            </div>
            <div>
              <dt className="font-medium">Putts pr. runde:</dt>
              <dd>{round.stations_putts}</dd>
            </div>
            <div>
              <dt className="font-medium">Total putts:</dt>
              <dd>
                {round.stations * round.stations_rounds * round.stations_putts}
              </dd>
            </div>
          </dl>
        </CardContent>
        <CircleArrowRight
          className="absolute right-4 top-32 w-6 h-6 text-gray-500"
          color="black"
        />
      </Card>
    </Link>
  );

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Vælg runde</h1>
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Aktive runder</h2>
            {activeRounds.length > 0 ? (
              <div className="space-y-4">
                {activeRounds.map((round) => (
                  <RoundCard key={round.id} round={round} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Ingen aktive runder fundet</p>
            )}
          </div>
          <Collapsible
            open={isFormerRoundsOpen}
            onOpenChange={setIsFormerRoundsOpen}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Tidligere runder</h2>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  {isFormerRoundsOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  <span className="sr-only">Toggle former rounds</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2">
              {formerRounds.length > 0 ? (
                <div className="space-y-4">
                  {formerRounds.map((round) => (
                    <RoundCard key={round.id} round={round} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Ingen tidligere runder fundet</p>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
    </div>
  );
}