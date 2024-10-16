"use server";

import { getRounds } from "@/app/repository/get.rounds.repository";
import { AdminRoundsComponent } from "@/components/admin-rounds";

export default async function Page() {
  const rounds = await getRounds();

  return <AdminRoundsComponent initialRounds={rounds} />;
}
