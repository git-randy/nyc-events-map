"use server";

import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { address: string } },
) {
  const { address } = await params;

  if(!address) {
    return NextResponse.json(
      { error: "An address is required"},
      { status: 500 }
    )
  }

  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");

  url.searchParams.set("address", address);

  if (process.env.API_KEY) {
    url.searchParams.set("key", process.env.API_KEY);
  } else {
    return NextResponse.json({ error: "Missing API key" }, { status: 401 });
  }

  console.info(`Fetching ${url.toString()}`)

  const res = await fetch(url.toString(), { cache: "no-store" });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch geocode data" },
      { status: res.status },
    );
  }

  const data = await res.json()

  return NextResponse.json(data)
}
