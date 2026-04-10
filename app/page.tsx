// TODO: Build out scrapers to add to the event database and fetch from there
"use client"

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/app/_components/Map"), {ssr: false})

export default function Home() {

  return (
    <>
      <Map/>
    </>
  )
}
