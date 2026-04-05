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

  const articles = $(eventList).find("article");

  const eventsObj = articles.map((_, article) => {
    return {
      title: $(article)
        .find("h3")
        .text()
        .replace(/^\d+\.\s*/, ""),
      summary: $(article).find("[data-testid='summary_testID']").text(),
      link: $(article).find("a:has(h3)").attr("href")
        ? `https://${domain}${$(article).find("a:has(h3)").attr("href")}`
        : null,
    };
  }).get();

  const response = {
    from: "TimeOut",
    events: eventsObj
  };
  return [{ sucess: true }, { status: 200 }, { content: response }];
}

async function addEvents(eventsObject) {
  const rows = eventsObject.content.events.map((event, i) => {
    return {
      id: i + 1,
      title: event.title,
      description: event.summary,
      link: event.link,
      source: eventsObject.content.from
    };
  });

  const { error: upsertEventsError } = await supabase
    .from("events")
    .upsert(rows, {onConflict: "id"})

  if (upsertEventsError) {
    throw new Error(JSON.stringify(upsertEventsError));
  }

  const lastValidRowId = rows[rows.length - 1].id;

  console.info("Removing old events...");
  const { data: staleEvents, error: getStaleEventsError } = await supabase
    .from("events")
    .select()
    .gt("id", lastValidRowId);

  if (getStaleEventsError) {
    throw new Error(JSON.stringify(getStaleEventsError));
  }

  if (staleEvents.length) {
    const staleIds = staleEvents.map((event) => event.id);

    const { error: deleteError } = await supabase
      .from("events")
      .delete()
      .in("id", staleIds);

    if (deleteError) {
      throw new Error(JSON.stringify(deleteError));
    }
  }
}

async function postFetchEventsActions() {
  const { error: upsertTimestampError } = await supabase
    .from("events_retrieved_timestamp")
    .upsert({
      id: 1,
      retrieved_at: new Date().toISOString(),
      source: "TimeOut",
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

async function main() {
  console.info("Running...");

  if (await isStale()) {
    try {
      const response = await fetchEvents();

      const content = response.find((el) => el["content"]);

      if (content) {
        await addEvents(content);
        await postFetchEventsActions();
        console.info("Database updated");
      } else {
        console.warn("Unable to retrieve any events from TimeOut.");
      }

      return 0;
    } catch (err) {
      console.error(err);
      return 1;
    }
  } else {
    console.info(
      `Events were retrieved recently. Next fetch will be in ${REFRESH_PERIOD} days.`,
    );
    return 1;
  }
}

// Execute only if file is called directly from CLI and not imported
// Using template literals `` will replace double backslashes with a single one
if (fileURLToPath(import.meta.url) === `${process.argv[1]}`) {
  await main();
} else {
  throw new Error("Importing this module is not allowed");
}
