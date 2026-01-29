"use client"

import Filters from "@/app/_components/Filters"
import dynamic from "next/dynamic"
import { useSearchParams } from "next/navigation";

const Map = dynamic(() => import("@/app/_components/Map"), {ssr: false})

export default function Home() {

  const searchParams = useSearchParams();
  const activeFilter = searchParams.get("filter") ?? "this-week"

  return (
    <>
      <Filters/>
      <Map duration={activeFilter}/>
    </>
  )
}
