"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "./ui/toaster";

const ADMIN_PASSWORD = "discimport"; // Hardcoded password

export function AdminLoginComponent() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      router.push("/admin/rounds");
    } else {
      toast({
        title: "Forkert adgangskode",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md h-screen flex items-center justify-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Admin Login
          </CardTitle>
        </CardHeader>
        <Toaster />
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Adgangskode</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Indtast adgangskode"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Log ind
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
