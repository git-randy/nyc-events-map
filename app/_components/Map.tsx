"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { Event } from "@/app/_data/EventTypes";
import PopupContainer from "@/app/_components/PopupContainer";

const TEST_NYC_MIDTOWN: [number, number, (number | undefined)?] = [
  40.7056782231889, -74.00858544781083,
];

interface MapProps {
  events: Event[];
}

function Map({ events }: MapProps) {

  const eventMarker = new Icon({
    iconUrl: "/event_marker_icon.png",
    iconAnchor: [12, 30], // Offset from geoleocation
    popupAnchor: [4, -25], // Popup location relative to the iconAnchor
  });

  const userMarker = new Icon({
    iconUrl: "/user_marker_icon.png",
    iconSize: [30, 30],
    iconAnchor: [12, 30],
    popupAnchor: [4, -25],
  });

  return (
    <MapContainer center={TEST_NYC_MIDTOWN} zoom={13} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <Marker position={TEST_NYC_MIDTOWN} icon={userMarker}>
        <Popup>Your current location</Popup>
      </Marker>
      {events
        .filter((event) => event.latitude !== 0 && event.longitude !== 0)
        .map((event, index) => (
          <Marker
            key={index}
            position={[event.latitude!, event.longitude!]}
            icon={eventMarker}
          >
            <Popup>
              <PopupContainer
                title={event.title}
                link={event.link}
                description={event.description}
              />
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}

export default Map;
