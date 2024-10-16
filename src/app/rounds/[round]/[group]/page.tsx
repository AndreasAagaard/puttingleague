"use server";
import { getPlayersInGroupWithScores } from "@/app/repository/get.group.by.group.repository";
import { getRounds } from "@/app/repository/get.rounds.repository";
import { MobileOptimizedFlexScoreInputComponent } from "@/components/mobile-optimized-flex-score-input";

async function Page({ params }: { params: { round: string; group: string } }) {
  const roundId = parseInt(params.round);
  const groupId = parseInt(params.group);
  const playersWithScores = await getPlayersInGroupWithScores(groupId, roundId);
  if (playersWithScores.length === 0) {
    return <div>Data ikke fundet</div>;
  }
  const rounds = await getRounds();
  const round = rounds.find((r) => r.id === roundId);
  if (!round) {
    return <div>Data ikke fundet</div>;
  }
  const roundSettings = {
    stations: round.stations,
    puttsPerStation: {
      rounds: round.stations_rounds,
      putts: round.stations_putts,
    },
  };
  return (
    <MobileOptimizedFlexScoreInputComponent
      existingPlayers={playersWithScores}
      settings={roundSettings}
    />
  );
}

export default Page;
