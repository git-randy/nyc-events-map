import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import { EventDataResponse, EventLocations } from "@/app/_lib/types";
import PopupInfo from "@/app/_components/PopupInfo";
import { useEffect, useState } from "react";
import GeoLocateButton from "@/app/_components/GeoLocateButton";
import { useUserGeolocation } from "@/app/_hooks/useGeolocation";

const TEST_CURRENT_LOCATION: [number, number, (number | undefined)?] = [
  40.7056782231889, -74.00858544781083,
];

function MapPlaceholder() {
  return (
    <p>
      Map of New York City
      <noscript>You need to enable JavaScript to see this map.</noscript>
    </p>
  );
}

function Map() {
  const [data, setData] = useState<EventDataResponse[]>([]);
  const { userPosition, loading, error, getPosition } = useUserGeolocation();

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await fetch("/api/events/");

      setData(await data.json());
    };

    fetchEvents();
  }, []);

  const eventMarker = new Icon({
    iconUrl: "/event_marker_icon.png",
    iconSize: [30, 30],
    iconAnchor: [12, 30], // Offset from geolocation
    popupAnchor: [4, -25], // Location relative to the iconAnchor
  });

  const userMarker = new Icon({
    iconUrl: "/user_marker_icon.png",
    iconSize: [34, 34],
    iconAnchor: [12, 30],
    popupAnchor: [4, -25],
  });

  const eventLocations: EventLocations[] = [];

  data.forEach((entry) => {
    const eventIndex = eventLocations.findIndex(
      (event) =>
        event.latitude === entry.latitude &&
        event.longitude === entry.longitude,
    );

    if (eventIndex === -1) {
      eventLocations.push({
        latitude: entry.latitude,
        longitude: entry.longitude,
        events: [
          {
            title: entry.title,
            description: entry.description,
            link: entry.link,
          },
        ],
      });
    } else {
      eventLocations[eventIndex].events.push({
        title: entry.title,
        description: entry.description,
        link: entry.link,
      });
    }
  });

  return (
    <MapContainer
      center={TEST_CURRENT_LOCATION}
      zoom={13}
      scrollWheelZoom={true}
      placeholder={<MapPlaceholder />}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {userPosition && (
        <Marker
          position={[userPosition.lat, userPosition.lng]}
          icon={userMarker}
        >
          <Popup>Your current location</Popup>
        </Marker>
      )}
      {eventLocations
        .filter((locale) => locale.latitude !== 0 && locale.longitude !== 0)
        .map((locale) => (
          <Marker
            key={locale.longitude + locale.latitude}
            position={[locale.latitude, locale.longitude]}
            icon={eventMarker}
          >
            <Popup>
              <PopupInfo eventList={locale.events} />
            </Popup>
          </Marker>
        ))}
      {!userPosition && (
        <GeoLocateButton onClick={getPosition} loading={loading} />
      )}
    </MapContainer>
  );
}

export default Map;
