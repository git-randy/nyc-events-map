import * as cheerio from "cheerio";
import { fileURLToPath } from "url";
import supabase from "./lib/supabase.mjs";

const REFRESH_PERIOD = 2;

async function fetchEvents() {
  const domain = "www.timeout.com";
  const url = `https://${domain}/newyork/things-to-do/things-to-do-in-new-york-this-week`;

  console.info("Fetching events...");
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return [{ success: false }, { status: res.status }];
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  // Get list with only the events listed.
  const eventList = $("body").find("[data-zone-name='large_list']").first();

  const headers = $(eventList).find("div >* h3");
  const summaries = $(eventList).find("div >* [data-testid='summary_testID']");
  const links = $(eventList).find("div >* a:has(h3)");

  const eventTitles = headers
    .map((_, el) => {
      // Remove all non alphanumeric characters except for spaces
      return $(el).text();
    })
    .get();

  const eventSummaries = summaries
    .map((_, el) => {
      return $(el).text();
    })
    .get();

  const eventLinks = links
    .map((_, el) => {
      return `https://${domain}/${$(el).attr("href")}`;
    })
    .get();

  const response = {
    from: "TimeOut",
    events: eventTitles.map((title, i) => ({
      title,
      summary: eventSummaries[i] ?? "", // Fallback if list is shorter
      link: eventLinks[i] ?? "",
    })),
  };
  return [{ sucess: true }, { status: 200 }, { content: response }];
}

async function addEvents(eventsObject) {
  const rows = eventsObject.content.events.map((event) => {
    return {
      title: event.title,
      description: event.summary,
      link: event.link,
    };
  });

  const { error: upsertEventsError } = await supabase
    .from("events")
    .upsert(rows);

  if (upsertEventsError) {
    throw new Error(JSON.stringify(upsertEventsError));
  }

  const { error: upsertTimestampError } = await supabase
    .from("events_retrieved_timestamp")
    .upsert({
      retrieved_at: new Date().toISOString(),
      source: eventsObject.content.from,
      events_window: 7,
    });

  if (upsertTimestampError) {
    throw new Error(JSON.stringify(upsertTimestampError));
  }
}

async function isStale() {
  const { error, data } = await supabase
    .from("events_retrieved_timestamp")
    .select("retrieved_at")
    .limit(1)
    .single();

  if (error) {
    throw new Error(JSON.stringify(error));
  }

  const nycTime = new Date(data.retrieved_at).toLocaleString("en-US", {
    timeZone: "America/New_York",
  });
  console.info(`Events was last fetched at ${nycTime}`);

  const staleDate = new Date();

  staleDate.setDate(staleDate.getDate() - REFRESH_PERIOD);
  return new Date(data.retrieved_at) <= staleDate;
}

// Execute only if file is called directly from CLI and not imported
// Using template literals `` will replace double backslashes with a single one
if (fileURLToPath(import.meta.url) === `${process.argv[1]}`) {
  console.info("Running...");

  if (await isStale()) {
    const response = await fetchEvents();

    const content = response.find((el) => el["content"]);

    if (content) {
      await addEvents(content);
    } else {
      console.warn("Unable to retrieve any events from TimeOut.");
    }
  } else {
    console.info(
      `Events were retrieved recently. Next fetch will be in ${REFRESH_PERIOD} days.`,
    );
  }
} else {
  throw new Error("Importing this module is not allowed");
}
