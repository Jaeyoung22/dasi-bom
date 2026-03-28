/**
 * Haversine formula로 두 좌표 사이의 거리 계산 (미터 단위)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // 지구 반지름 (미터)
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * 거리를 사람이 읽기 쉬운 문자열로 변환
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

/**
 * 인증 가능 거리 (100m)
 */
export const VERIFICATION_RADIUS = 100;

/**
 * 인증 가능 여부 확인
 */
export function isWithinVerificationRange(
  userLat: number,
  userLon: number,
  statueLat: number,
  statueLon: number
): boolean {
  return (
    calculateDistance(userLat, userLon, statueLat, statueLon) <=
    VERIFICATION_RADIUS
  );
}
