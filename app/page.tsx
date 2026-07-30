import HomeClient from "@/components/HomeClient";
import { getPublishedEvents } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const events = await getPublishedEvents();
  return <HomeClient events={events} />;
}
