"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { insertRound } from "@/app/repository/insert.round.repository";
import { toast } from "@/hooks/use-toast";

interface RoundConfig {
  roundName: string;
  stations: number;
  roundsPerStation: number;
  puttsPerRound: number;
}

export function AdminPanelComponent() {
  const [roundConfig, setRoundConfig] = useState<RoundConfig>({
    roundName: "",
    stations: 5,
    roundsPerStation: 3,
    puttsPerRound: 5,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRoundConfig((prev) => ({
      ...prev,
      [name]: name === "roundName" ? value : Math.max(1, parseInt(value) || 0),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    insertRound({
      name: roundConfig.roundName,
      stations: roundConfig.stations,
      stations_rounds: roundConfig.roundsPerStation,
      stations_putts: roundConfig.puttsPerRound,
    });
    toast({
      title: "Round Configuration Saved",
      description: `${roundConfig.roundName} has been set up successfully.`,
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Tilføj ny runde
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roundName">Navn på runde</Label>
              <Input
                id="roundName"
                name="roundName"
                value={roundConfig.roundName}
                onChange={handleInputChange}
                placeholder="Runde navn"
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
                value={roundConfig.stations}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roundsPerStation">Runder pr. station</Label>
              <Input
                id="roundsPerStation"
                name="roundsPerStation"
                type="number"
                min="1"
                value={roundConfig.roundsPerStation}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="puttsPerRound">Putts pr. runde</Label>
              <Input
                id="puttsPerRound"
                name="puttsPerRound"
                type="number"
                min="1"
                value={roundConfig.puttsPerRound}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Gem Runde
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
