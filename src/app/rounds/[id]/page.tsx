"use server";

import { getPlayersInGroupWithScores } from "@/app/repository/get.group.by.group.repository";
import { getGroupsByRoundId } from "@/app/repository/get.groups.by.round.repository";
import { getRounds, Round } from "@/app/repository/get.rounds.repository";
import { GroupSelectionComponent } from "@/components/group-selection";

export default async function Page({ params }: { params: { id: number } }) {
  // const groups = await getPlayersInGroupWithScores(params.id);
  const groups = await getGroupsByRoundId(params.id);
  const round = (await getRounds()).find((round) => (round.id = params.id));
  if (!round) throw new Error("NO ROUND FOUND");
  return <GroupSelectionComponent groups={groups} round={round} />;
}
