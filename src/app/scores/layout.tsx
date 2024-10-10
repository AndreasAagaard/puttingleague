"use client";
import { CardData } from "@/app/repository/getcarddata.repository";
import { MobileOptimizedFlexScoreInputComponent } from "@/components/mobile-optimized-flex-score-input";
import { useSearchParams } from "next/navigation";

interface ScoresTemplateProps {
  data: CardData;
  test: string;
}
function ScoresTemplate({ data, test }: ScoresTemplateProps) {
  const searchParams = useSearchParams();
  const cardId = searchParams.get("card");

  if (!cardId) {
    return <div>Card not found</div>;
  }
  return (
    <MobileOptimizedFlexScoreInputComponent
      playerNames={
        data?.playerNames ?? ["Player 1", "Player 2", "Player 3", "Player 4"]
      }
      stations={data?.stations ?? 5}
      puttsPerStation={data?.puttsPerStation ?? { rounds: 3, putts: 5 }}
    />
  );
}

export default ScoresTemplate;
