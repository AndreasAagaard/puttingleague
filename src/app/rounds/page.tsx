"use server";
import { RoundsOverviewComponent } from "@/components/rounds-overview";
import { getRounds } from "../repository/get.rounds.repository";

export default async function Page() {
  const rounds = await getRounds();
  return <RoundsOverviewComponent rounds={rounds} />;
}
