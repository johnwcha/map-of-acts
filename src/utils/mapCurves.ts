export type MapPoint = [number, number];

const DEFAULT_SAMPLES_PER_SEGMENT = 24;

export function getCurveControlPoint(from: MapPoint, to: MapPoint): MapPoint {
  const midLat = (from[0] + to[0]) / 2;
  const midLng = (from[1] + to[1]) / 2;
  const deltaLat = to[0] - from[0];
  const deltaLng = to[1] - from[1];
  const length = Math.hypot(deltaLat, deltaLng) || 1;
  const perpendicular: MapPoint = [-deltaLng / length, deltaLat / length];
  const curveDirection = deltaLng >= 0 ? 1 : -1;
  const curveAmount = length < 1.5
    ? length * 0.025
    : Math.min(length * 0.08, 0.32);

  return [
    midLat + perpendicular[0] * curveAmount * curveDirection,
    midLng + perpendicular[1] * curveAmount * curveDirection,
  ];
}

export function getQuadraticBezierPoint(from: MapPoint, control: MapPoint, to: MapPoint, t: number): MapPoint {
  const oneMinusT = 1 - t;
  return [
    oneMinusT * oneMinusT * from[0] + 2 * oneMinusT * t * control[0] + t * t * to[0],
    oneMinusT * oneMinusT * from[1] + 2 * oneMinusT * t * control[1] + t * t * to[1],
  ];
}

export function getQuadraticBezierTangent(from: MapPoint, control: MapPoint, to: MapPoint, t: number): MapPoint {
  return [
    2 * (1 - t) * (control[0] - from[0]) + 2 * t * (to[0] - control[0]),
    2 * (1 - t) * (control[1] - from[1]) + 2 * t * (to[1] - control[1]),
  ];
}

export function sampleCurvedPath(points: MapPoint[], samplesPerSegment = DEFAULT_SAMPLES_PER_SEGMENT): MapPoint[] {
  if (points.length < 2) return points;

  const sampled: MapPoint[] = [];

  for (let index = 0; index < points.length - 1; index += 1) {
    const from = points[index];
    const to = points[index + 1];
    const control = getCurveControlPoint(from, to);

    for (let step = 0; step <= samplesPerSegment; step += 1) {
      if (index > 0 && step === 0) continue;
      sampled.push(getQuadraticBezierPoint(from, control, to, step / samplesPerSegment));
    }
  }

  return sampled;
}
