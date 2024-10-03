"use server";
import { getCardData } from "@/app/repository/getcarddata.repository";
import ScoresTemplate from "./layout";

async function Page() {
  const data = await getCardData();
  console.log("Server-side data:", data);
  return <ScoresTemplate data={data} test="dinmor" />;
}

export default Page;
