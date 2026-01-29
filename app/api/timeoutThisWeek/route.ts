"use server"

import { NextResponse } from "next/server"
import * as cheerio from "cheerio"
import { NYCTimeoutResponse } from "@/app/_utilities/EventTypes"

export async function GET(): Promise<NextResponse> {
  const url = "https://www.timeout.com/newyork/things-to-do/things-to-do-in-new-york-this-week"

  const res = await fetch(url, {
    headers: {
    "User-Agent": "Mozeilla/5.0",
    },
    cache: "no-store"
  })

  if(!res.ok) {
    return NextResponse.json({error: `HTTP ${res.status}`}, {status: 500})
  }

  const html = await res.text();
  const $ = cheerio.load(html)

  const eventList = $("body").find("[data-zone-name='large_list']").first()
  const headers = $(eventList).find("div >* h3")
  const summaries = $(eventList).find("div >* [data-testid='summary_testID']")

  const eventTitles = headers.map((_, el) => {
    // Remove all non alphanumeric characters except for spaces
    return $(el).text().split(".")[1].trim().replace(/[^a-zA-Z0-9 ]/g, "")
  }).get()

  const eventSummaries = summaries.map((_, el) => {
    return $(el).text()
  }).get()

  const response: NYCTimeoutResponse = {
    from: "Timeout",
    events: eventTitles.map((title, i) => ({
      title,
      summary: eventSummaries[i] ?? "", // Fallback if summary list is shorter
    })
    )
  }

  return NextResponse.json({content: response})
}