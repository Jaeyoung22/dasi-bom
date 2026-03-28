"use client";

import { useState, useEffect, useCallback } from "react";

export function useUserLocation() {
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = useCallback((pos: GeolocationPosition) => {
    setLocation({
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
    });
  }, []);

  const handleError = useCallback((err: GeolocationPositionError) => {
    setError(err.message);
    // 기본값: 서울 시청
    setLocation({ lat: 37.5665, lng: 126.978 });
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      // 다음 틱에서 setState 호출
      const id = setTimeout(() => {
        setError("Geolocation이 지원되지 않습니다");
      }, 0);
      return () => clearTimeout(id);
    }

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
    });
  }, [handleSuccess, handleError]);

  return { location, error };
}
