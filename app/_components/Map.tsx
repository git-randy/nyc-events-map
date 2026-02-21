"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import { geocodeAddress } from "@/app/_lib/geocode";
import { NYCTimeoutResponse } from "@/app/_utilities/EventTypes";
import { chunk } from "@/app/_utilities/helpers";

// TODO: Build out scrapers to add to the event database and fetch from there

type MapProps = {
  duration: string;
};

function Map({ duration }: MapProps) {
  const [data, setData] = useState<NYCTimeoutResponse | null>(null);

  useEffect(() => {
    async function getGeo() {
      const events = await fetch("/api/timeoutThisWeek")
      const {content} = (await events.json()) as {content: NYCTimeoutResponse};

      const prompt = content.events.map((event, i) => `${i + 1}. ${event.summary.slice(0, 350)}`).join("\n\n")

      const res = await fetch("/api/ai/extractLocation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({prompt})
      });

      const {text} = await res.json()
      const locations = text.split("|")
      console.log(locations)

      content.events.forEach((event, i) =>
        event.locations = locations[i].split(",")
      )

      console.log(content)
    }

    getGeo();
  }, [duration]);

  return (
    <MapContainer
      center={[40.70527, -74.00789]}
      zoom={13}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <Marker position={[40.70527, -74.00789]}>
        <Popup>Your current location</Popup>
      </Marker>
    </MapContainer>
  );
}

export default Map;
