"use server";

import { getGroupsByRoundId } from "@/app/repository/get.groups.by.round.repository";
import { getRounds } from "@/app/repository/get.rounds.repository";
import { GroupSelectionComponent } from "@/components/group-selection";

export default async function Page({ params }: { params: { round: number } }) {
  const groups = await getGroupsByRoundId(params.round);
  const round = (await getRounds()).find((round) => (round.id = params.round));
  if (!round) throw new Error("NO ROUND FOUND");
  return <GroupSelectionComponent groups={groups} round={round} />;
}
