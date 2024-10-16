"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
  className?: string;
}

export function BackButtonComponent({ className = "" }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`absolute top-4 left-4${className}`}
      onClick={() => router.back()}
      aria-label="Go back"
    >
      <ChevronLeft className="h-6 w-6" />
    </Button>
  );
}
