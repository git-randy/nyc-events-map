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
  // Create a custom icon for event markers
  const eventMarker = new Icon({
    iconUrl: "/event_marker_icon.png", // Place your custom marker image in the public folder
    iconSize: [30, 30], // Size of the icon
    iconAnchor: [12, 30], // Point of the icon which corresponds to marker's location
    popupAnchor: [4, -25], // Point from which the popup should open relative to the iconAnchor
  });

  const userMarker = new Icon({
    iconUrl: "/user_marker_icon.png", // Place your custom marker image in the public folder
    iconSize: [30, 30], // Size of the icon
    iconAnchor: [12, 30], // Point of the icon which corresponds to marker's location
    popupAnchor: [4, -25], // Point from which the popup should open relative to the iconAnchor
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
