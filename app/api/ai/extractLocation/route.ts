import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";

const CONTEXT = `
  Extract locations for the following event summaries and be sure it is geocode
  friendly. For example: "Union Square Park's North Plaza and Pavilion on
  17th Street between Broadway and Park Avenue South" should be "Union Square Park".
  If it is very broad, output "NYC". If it is a store output the location next to it if
  it is stated in the summary (e.g. "Macy's" should be "Macy's midtown Manhattan").
  Output each location separated by a "," if a summary lists more than one and separate
  these location(s) with a "|" as a delimitter between each summary. Exclude ordered
  numbers such as "1."
  `;

export async function POST(req: Request) {
  const { prompt } = await req.json();
  console.log(prompt)

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

    return NextResponse.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.log(message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}