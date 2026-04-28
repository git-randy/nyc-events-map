import { useState } from "react";

const COOKIE_NAME = "userPosition";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const cookie = document.cookie.split("; ").find((crumb) => crumb.startsWith(`${name}=`))

  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

function setCookie(name: string, value: string, maxAgeSeconds = COOKIE_MAX_AGE_SECONDS) {
  if (typeof document === "undefined") return;

  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAgeSeconds}; path=/; sameSite=Lax`;
}

export function useUserGeolocation(defaultPosition = null) {
  const [loading, setLoading] = useState<boolean>(false);
  const [userPosition, setUserPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(() => {
    if (typeof window === "undefined") {
      return defaultPosition;
    }

    const cookieValue = getCookie(COOKIE_NAME);
    if (!cookieValue) {
      return defaultPosition;
    }

    try {
      return JSON.parse(cookieValue);
    } catch {
      return defaultPosition;
    }
  });
  const [error, setError] = useState<string | null>(null);

  function getPosition() {
    if (!navigator.geolocation) {
      return setError("Your browser does not support geolocation");
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setUserPosition(newPosition);
        setCookie(COOKIE_NAME, JSON.stringify(newPosition));
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      },
    );
  }

  return { loading, userPosition, error, getPosition };
}
