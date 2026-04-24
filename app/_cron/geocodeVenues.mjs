import supabase from "./lib/supabase.mjs";
import { fileURLToPath } from "url";

async function geocodeVenues() {
  const { data: venues, error } = await supabase
    .from("events")
    .select("id, venue, latitude, longitude")
    .order("id", { ascending: true });

  if (error) {
    throw new Error(error);
  }

  const cityNames = ["nyc", "new york", "new york city", "ny"];
  // Add nyc to location
  const updatedVenues = venues.map((entry) => {
    if (cityNames.some((name) => entry.venue.toLowerCase().includes(name))) {
      return entry;
    } else {
      return entry.venue === "undefined"
        ? { ...entry, venue: "null island" } // Default address if venue is not found
        : { ...entry, venue: `${entry.venue} ${cityNames[0]}` };
    }
  });

  const venuesWithCoordinates = await getLatLng(updatedVenues);

  await updateDatabase(venuesWithCoordinates)

}

async function getLatLng(events) {
  const results = [];
  const apiKey = process.env.OPENCAGEDDATA_API_KEY;

  const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  for (const event of events) {
    const encodedLocation = encodeURIComponent(event.venue);

    const res = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodedLocation}&key=${apiKey}`,
    );

    const data = await res.json();

    if (data.status.code === 200) {
      results.push({
        ...event,
        latitude: data.results[0].geometry.lat,
        longitude: data.results[0].geometry.lng,
      });
    } else {
      throw new Error(`Status code: ${data.status.code}. ${data.status.message}`)
    }

    await delay(1400) //Free trial accounts are limited to one request per second

  }

  return results
}

async function updateDatabase(rows) {
    const { error } = await supabase
    .from("events")
    .upsert(rows, {onConflict: "id"})

    if (error) {
      throw new Error(JSON.stringify(error))
    }
}

async function main() {

  try {
    console.info("Geocoding venues...")
    await geocodeVenues();
    console.info("Done")
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}


if (fileURLToPath(import.meta.url) === `${process.argv[1]}`) {
  await main();
} else {
  throw new Error("Importing this module is not allowed");
}

