"use client";

import { useState, useEffect } from "react";

export function useUserLocation() {
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation이 지원되지 않습니다");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        setError(err.message);
        // 기본값: 서울 시청
        setLocation({ lat: 37.5665, lng: 126.978 });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return { location, error };
}
