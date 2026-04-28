import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import { Icon } from "leaflet";
import { EventDataResponse, EventLocations } from "@/app/_lib/types";
import PopupInfo from "@/app/_components/PopupInfo";
import Sidebar from "@/app/_components/Sidebar";
import { useEffect, useState } from "react";
import GeoLocateButton from "@/app/_components/GeoLocateButton";
import { useUserGeolocation } from "@/app/_hooks/useGeolocation";
import MapPlaceholder from "@/app/_components/MapPlaceholder";

const DEFAULT_CENTER: [number, number, (number | undefined)?] = [
  40.714396456665675, -73.97297652049365,
];

function Map() {
  const [eventsData, setEventsData] = useState<EventDataResponse[]>([]);
  const { userPosition, loading, getPosition } = useUserGeolocation();

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsData = await fetch("/api/events/");

      setEventsData(await eventsData.json());
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

  eventsData.forEach((eventData) => {

    const eventIndex = eventLocations.findIndex(
      (event) =>
        event.latitude === eventData.latitude &&
        event.longitude === eventData.longitude,
    );

    if (eventIndex === -1) {
      eventLocations.push({
        latitude: eventData.latitude,
        longitude: eventData.longitude,
        events: [
          {
            title: eventData.title,
            description: eventData.description,
            link: eventData.link,
          },
        ],
      });
    } else {
      eventLocations[eventIndex].events.push({
        title: eventData.title,
        description: eventData.description,
        link: eventData.link,
      });
    }
  });

  const noLocationEvents = eventLocations.find((event) => {
    return event.latitude ===  0 && event.longitude === 0
  })

  return (
    <div className="relative min-h-screen">
      <Sidebar noLocationEvents={noLocationEvents} />
      <div className="relative w-full min-h-screen">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={13}
          scrollWheelZoom={true}
          placeholder={<MapPlaceholder />}
          className="z-0 min-h-screen h-full"
          zoomControl={false}
        >
          <ZoomControl position="topright"/>
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
      </div>
    </div>
  );
}

export default Map;
