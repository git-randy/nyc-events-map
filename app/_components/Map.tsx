"use client";

import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react"
import { geocodeAddress } from "@/app/_lib/geocode";

type MapProps = {
  duration: string;
}

function Map({duration}: MapProps) {

  const [data, setData] = useState(null)

  useEffect(() => {
    async function getGeo() {
      const geo = await geocodeAddress("one world trade")
      console.log(geo)
      setData(geo)
    }

    getGeo()
  }, [duration])

  return (
    <MapContainer
      center={[40.70527, -74.00789]}
      zoom={13}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[40.70527, -74.00789]}>
        <Popup>
          Your current location
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default Map;
