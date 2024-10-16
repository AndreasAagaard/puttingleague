import { getPlayersWithScoresByRound } from "@/app/repository/get.players.with.score.repository";
import { LeaderboardComponent } from "@/components/leaderboard";

export default async function Page({ params }: { params: { round: string } }) {
  const roundId = parseInt(params.round);
  const players = await getPlayersWithScoresByRound(roundId);
  return <LeaderboardComponent playersWithScores={players} />;
}
