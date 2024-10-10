"use server";
import { getGroupsByRoundId } from "@/app/repository/get.groups.by.round.repository";
import { MobileOptimizedFlexScoreInputComponent } from "@/components/mobile-optimized-flex-score-input";

async function Page({ params }: { params: { groupId: number } }) {
  const data = await getGroupsByRoundId();
  return (
    <MobileOptimizedFlexScoreInputComponent
      existingPlayers={}
      stations={data?.stations ?? 5}
      puttsPerStation={data?.puttsPerStation ?? { rounds: 3, putts: 5 }}
    />
  );
}

export default Page;
