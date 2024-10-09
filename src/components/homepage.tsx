"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HomepageComponent() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Velkommen til Putting League
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">
            Velkommen til vores Putting League app! Her kan du holde styr på
            dine scores, se dine fremskridt og konkurrere med andre spillere.
            Uanset om du er nybegynder eller erfaren, er dette stedet for at
            forbedre dine putting-færdigheder og have det sjovt med andre disc
            golf-entusiaster.
          </p>
          <p className="text-center">
            Vælg 'Administrer' for at opsætte nye runder eller 'Se Scorekort'
            for at deltage i en aktiv runde. God fornøjelse!
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        <Button
          onClick={() => router.push("/admin")}
          className="w-full text-lg py-6"
        >
          Administrer
        </Button>
        <Button
          onClick={() => router.push("/rounds")}
          className="w-full text-lg py-6"
          variant="secondary"
        >
          Se Scorekort
        </Button>
      </div>
    </div>
  );
}
