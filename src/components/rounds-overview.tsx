"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Round } from "@/app/repository/get.rounds.repository";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CircleArrowRight } from "lucide-react";

interface RoundsOverviewProps {
  rounds: Round[];
}

export function RoundsOverviewComponent({ rounds }: RoundsOverviewProps) {
  const router = useRouter();
  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Vælg runde</h1>
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="space-y-4">
          {rounds
            ? rounds.map((round, index) => (
                <Link href={`/rounds/${round.id}`} key={round.id}>
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{round.name}</CardTitle>
                        <Badge
                          variant={
                            round.active === "Active" ? "default" : "secondary"
                          }
                        >
                          {round.active === "Active" ? "Aktiv" : "Inaktiv"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <dl className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <dt className="font-medium">Stations:</dt>
                          <dd>{round.stations}</dd>
                        </div>
                        <div>
                          <dt className="font-medium">Rounds per Station:</dt>
                          <dd>{round.stations_rounds}</dd>
                        </div>
                        <div>
                          <dt className="font-medium">Putts per Round:</dt>
                          <dd>{round.stations_putts}</dd>
                        </div>
                        <div>
                          <dt className="font-medium">Total Putts:</dt>
                          <dd>
                            {round.stations *
                              round.stations_rounds *
                              round.stations_putts}
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
              ))
            : "Ingen runder fundet"}
        </div>
      </ScrollArea>
    </div>
  );
}
