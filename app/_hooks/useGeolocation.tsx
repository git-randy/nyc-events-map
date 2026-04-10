import { useState } from "react";

export function useUserGeolocation(defaultPosition = null) {
  const [loading, setLoading] = useState<boolean>(false);
  const [userPosition, setUserPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(defaultPosition);
  const [error, setError] = useState<string | null>(null);

  function getPosition() {
    if (!navigator.geolocation) {
      return setError("Your browser does not support geolocation");
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false)
      },
    );
  }

  return {loading, userPosition, error, getPosition}
}
