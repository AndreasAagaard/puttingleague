"use server";

import { getGroupsByRoundId } from "@/app/repository/get.groups.by.round.repository";
import { GroupSelectionComponent } from "@/components/group-selection";

export default async function Page({ params }: { params: { id: number } }) {
  const groups = await getGroupsByRoundId(params.id);
  console.log(groups);
  return <GroupSelectionComponent groups={groups} />;
}
