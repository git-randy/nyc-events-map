import supabase from "./lib/supabase.mjs";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { fileURLToPath } from "url";

const CONTEXT = [
  "You are an information extraction system.",
  "",
  "TASK:",
  "Extract the location where each event takes place.",
  "",
  "RULES:",
  "- The location can be a venue, district, neighborhood, or street address.",
  "- Only extract the FIRST location mentioned.",
  "- Do NOT return descriptions.",
  "- Each event is separated by a | symbol.",
  "- If a location does not exist, return 'undefined'.",
  "- If a cross street is mentioned such as 52nd Street and 8th Avenue, that is one location.",
  "",
  "LOCATION EXAMPLES:",
  "- Public library, midtown",
  "",
  "OUTPUT FORMAT:",
  "- Return venues in the same order as the input.",
  "- Separate each location using |.",
  "- Do NOT include numbering.",
  "- Do NOT include explanations.",
].join(" ");

async function getVenues() {
  const { data, error } = await supabase
    .from("events")
    .select("title, description")
    .order("id", { ascending: true });

  if (error) {
    throw new Error(error);
  }

  const prompt = data
    .map(
      (event, i) =>
        `${i + 1}. ${event.title}: ${event.description.slice(0, 400)}`,
    )
    .join(" | ");

  const googleAI = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_API_KEY,
  });

  const model = googleAI("gemini-2.5-flash-lite");

  console.info("Extracting venues...");

  try {
    const { text } = await generateText({
      model,
      messages: [
        { role: "system", content: CONTEXT },
        { role: "user", content: prompt },
      ],
    });

    const venues = text.split("|").map((str) => str.trim());

    const updatedVenues = venues.map((venue, i) => {
      return { id: i + 1, venue };
    });

    console.info("Updaing database...");
    const { error } = await supabase
      .from("events")
      .upsert(updatedVenues, { onConflict: "id" });

    if (error) {
      console.error(
        `Something went wrong updating venues in the database. ${error}`,
      );
      throw new Error(
        `Something went wrong updating venues in the database. ${error}`,
      );
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

async function main() {
  try {
    await getVenues();
    console.info("Done");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

if (fileURLToPath(import.meta.url) === `${process.argv[1]}`) {
  await main();
} else {
  throw new Error("Importing this module is not allowed");
}
