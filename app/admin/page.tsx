import { isAuthenticated } from "@/lib/auth";
import { getAllEvents } from "@/lib/db";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authenticated = await isAuthenticated();
  const events = authenticated ? await getAllEvents() : [];
  return <AdminClient authenticated={authenticated} initialEvents={events} />;
}
