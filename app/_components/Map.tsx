"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import { GetEventsData } from "@/app/_data/EventTypes";


const TEST_NYC_MIDTOWN: [number, number, (number | undefined)?] = [
  40.7551169, -73.98478,
];

type MapProps = {
  duration: string;
};

function Map({ duration }: MapProps) {
  // const [data, setData] = useState<NYCTimeoutResponse | null>(null);

  // useEffect(() => {
  //   // async function getGeo() {

  //   //   const content = await fetch("/api/events")

  //   //   const { data } = (await content.json()) as GetEventsData

  //   //   const prompt = data
  //   //     .map((event, i) => `${i + 1}. ${event.description.slice(0, 400)}`)
  //   //     .join("\n\n");

  //   //   console.log(prompt);

  //   //   const res = await fetch("/api/ai/extractLocation", {
  //   //     method: "POST",
  //   //     headers: { "Content-Type": "application/json" },
  //   //     body: JSON.stringify({ prompt }),
  //   //   });

  //   //   const { text: locations } = await res.json();


  //   // }

  //   getGeo();
  // }, [duration]);

  return (
    <MapContainer center={TEST_NYC_MIDTOWN} zoom={13} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <Marker position={TEST_NYC_MIDTOWN}>
        <Popup>Your current location</Popup>
      </Marker>
    </MapContainer>
  );
}

export default Map;
