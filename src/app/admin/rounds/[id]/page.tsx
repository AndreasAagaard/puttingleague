"use server";

import { getGroupsByRoundId } from "@/app/repository/get.groups.by.round.repository";
import { getPlayersByRoundId } from "@/app/repository/get.players.by.round.repository";
import { getRounds } from "@/app/repository/get.rounds.repository";
import { SingleRoundComponent } from "@/components/single-round";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const rounds = await getRounds();
  const players = (await getPlayersByRoundId(id)).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  const groups = await getGroupsByRoundId(id);
  const round = rounds.find((round) => round.id === id);
  if (!round) return notFound();
  return (
    <SingleRoundComponent
      existingRound={round}
      existingPlayers={players}
      existingGroups={groups}
    />
  );
}
