"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

interface HomeButtonProps {
  className?: string;
}

export function HomeButtonComponent({ className = "" }: HomeButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`absolute top-4 left-4 ${className}`}
      onClick={() => router.push("/")}
      aria-label="Go to home page"
    >
      <Home className="h-6 w-6" />
    </Button>
  );
}
