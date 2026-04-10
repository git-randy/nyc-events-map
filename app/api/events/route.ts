import { getEvents } from "@/app/_lib/data-service";
import { NextResponse } from "next/server";

export async function GET() {

  try {
    const data = await getEvents()
    return NextResponse.json(data, {status: 200})
  } catch (err) {
    console.error(err)
    return NextResponse.json({error: "Failed to fetch events"}, {status: 500})
  }

}