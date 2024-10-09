"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleArrowRight, PlusCircle, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  insertRound,
  RoundInsert,
} from "@/app/repository/insert.round.repository";
import { Round } from "@/app/repository/get.rounds.repository";
import Link from "next/link";
import { deleteRoundById } from "@/app/repository/delete.round.repository";

interface AdminRoundsProps {
  initialRounds: Round[];
}

export function AdminRoundsComponent({ initialRounds }: AdminRoundsProps) {
  const router = useRouter();
  const [rounds, setRounds] = useState<Round[]>(initialRounds);
  const [newRound, setNewRound] = useState<RoundInsert>({
    name: "",
    stations: 5,
    stations_rounds: 3,
    stations_putts: 5,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRound((prev) => ({
      ...prev,
      [name]: name === "name" ? value : Math.max(1, parseInt(value) || 0),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const inserted: { id: number } = await insertRound(newRound);
    setRounds([
      ...rounds,
      {
        id: rounds.length + 1,
        active: "Active",
        ...newRound,
      },
    ]);
    router.push(`/admin/rounds/${inserted.id}`);
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Overblik</h1>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overblik over runder</TabsTrigger>
          <TabsTrigger value="create">Lav ny runde</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-4">
              {rounds.map((round, index) => (
                <Link href={`/admin/rounds/${round.id}`} key={index}>
                  <Card key={index}>
                    <CardHeader className="pb-4">
                      <div className="grid grid-flow-col justify-between items-center">
                        <Link href={`rounds/${round.id}`}>
                          <CardTitle className="text-lg">
                            <div className="flex items-center gap-2">
                              {round.name}
                            </div>
                          </CardTitle>
                        </Link>
                        <div className="flex flex-row items-start gap-4">
                          <Badge
                            variant={
                              round.active === "Active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {round.active === "Active" ? "Aktiv" : "Inaktiv"}
                          </Badge>
                          <Button
                            onClick={() => {
                              deleteRoundById(round.id);
                              setRounds(
                                rounds.filter((r) => r.id !== round.id),
                              );
                            }}
                            size={"sm"}
                            variant={"destructive"}
                          >
                            <XIcon className="h-4 w-4" color="black" />
                          </Button>
                        </div>
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
                          <dt className="font-medium">Total antal putts:</dt>
                          <dd>
                            {round.stations *
                              round.stations_rounds *
                              round.stations_putts}
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                    <CircleArrowRight
                      className="absolute right-4 top-32 mt-4 w-6 h-6 text-gray-500"
                      color="black"
                    />
                  </Card>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Lav ny runde</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Runde Navn</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newRound.name}
                    onChange={handleInputChange}
                    placeholder="Indsæt runde navn"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stations">Antal stationer</Label>
                  <Input
                    id="stations"
                    name="stations"
                    type="number"
                    min="1"
                    value={newRound.stations}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stations_rounds">Runder pr. station</Label>
                  <Input
                    id="stations_rounds"
                    name="stations_rounds"
                    type="number"
                    min="1"
                    value={newRound.stations_rounds}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stations_putts">Putts pr. runde</Label>
                  <Input
                    id="stations_putts"
                    name="stations_putts"
                    type="number"
                    min="1"
                    value={newRound.stations_putts}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Opret runde
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
