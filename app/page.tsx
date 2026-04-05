// TODO: Build out scrapers to add to the event database and fetch from there

import Map from "@/app/_components/Map"
import { getEvents } from "@/app/_lib/data-service";

export default async function Home() {
  const events = await getEvents();

  return (
    <>
      <Map events={events} />
    </>
  )
}
