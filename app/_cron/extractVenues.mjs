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
  "- The location can be a venue, neighborhood, or street address.",
  "- Only extract the FIRST location mentioned.",
  "- Do NOT return descriptions.",
  "- Each event is numbered.",
  "- If no specific location exists, return 'undefined'.",
  "- If a cross street is mentioned such as 52nd Street and 8th Avenue, return that",
  "",
  "OUTPUT FORMAT:",
  "- Return venues in the same order as the input.",
  "- Separate each venue using the pipe symbol: |",
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
    .map((event, i) => `${i + 1}. ${event.title}: ${event.description.slice(0, 400)}`)
    .join("\n\n");

  const googleAI = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_API_KEY,
  });

  const model = googleAI("gemini-2.5-flash-lite");

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

    const { error } = await supabase
      .from("events")
      .upsert(updatedVenues, { onConflict: "id" });

    if (error) {
      console.error(
        "Something went wrong with updating venues in the database",
      );
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

async function main() {

  try {
    await getVenues();
    return 0
  } catch (err) {
    console.error(err)
    return 1
  }

}

if (fileURLToPath(import.meta.url) === `${process.argv[1]}`) {
  await main();
} else {
  throw new Error("Importing this module is not allowed");
}