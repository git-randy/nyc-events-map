"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import { geocodeAddress } from "@/app/_lib/geocode";

type MapProps = {
  duration: string;
};

function Map({ duration }: MapProps) {
  const [data, setData] = useState<unknown>(null);

  useEffect(() => {
    async function getGeo() {
      const geo = await fetch("api/ai/extractLocation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({link: "https://www.timeout.com/newyork/things-to-do/things-to-do-in-new-york-this-week"})
      });
      const {text} = await geo.json();
      setData(text);
    }

    getGeo();
  }, [duration]);

  console.log("AI Answer: ")
  console.log(data);

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
