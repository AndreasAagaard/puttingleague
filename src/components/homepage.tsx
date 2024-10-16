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
          <p className="text-center mb-4 mt-4">
            Vælg <b>Administrer</b> for at opsætte nye runder
          </p>
          <p className="text-center mb-4">
            Vælg <b>Deltag i runde</b> for at deltage i en aktiv runde
          </p>
          <p className="text-center mb-4">God fornøjelse!</p>
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
          Deltag i runde
        </Button>
      </div>
    </div>
  );
}
