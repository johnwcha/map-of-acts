import { useEffect, useRef, useState } from 'react';
import { Marker, useMap } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import { getCurveControlPoint, getQuadraticBezierPoint, getQuadraticBezierTangent, MapPoint } from '../../utils/mapCurves';

interface AnimatedArrowProps {
    stops: [number, number][];  // Ordered list of [lat, lng] for each stop
    color?: string;
    isPlaying: boolean;
    onStopReached?: (stopIndex: number) => void;
    onComplete?: () => void;
}

const STEP_DURATION = 2000;   // ms to travel between stops
const PAUSE_DURATION = 800;   // ms to pause at each stop

/** Compute heading angle (degrees) from a direction vector */
function bearingFromVector(vector: MapPoint): number {
    const dLng = vector[1];
    const dLat = vector[0];
    return (Math.atan2(dLng, dLat) * 180) / Math.PI;
}

const createArrowIcon = (rotation: number, color: string) =>
    new DivIcon({
        className: '',
        html: `<div style="transform:rotate(${rotation}deg);width:36px;height:36px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4));">
      <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="18" r="16" fill="${color}" stroke="white" stroke-width="2.5" opacity="0.95"/>
        <polygon points="18,8 26,26 18,21 10,26" fill="white"/>
      </svg>
    </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
    });

const AnimatedArrow = ({ stops, color = '#1152d4', isPlaying, onStopReached, onComplete }: AnimatedArrowProps) => {
    const map = useMap();
    const [pos, setPos] = useState<[number, number]>(stops[0] ?? [0, 0]);
    const [angle, setAngle] = useState(0);
    const rafRef = useRef<number | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const segRef = useRef(0);   // current segment index (0 = stop[0]→stop[1])
    const progressRef = useRef(0);
    const stopsKeyRef = useRef('');

    const cancel = () => {
        if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
        if (timerRef.current != null) clearTimeout(timerRef.current);
        rafRef.current = null;
        timerRef.current = null;
    };

    const resetPlaybackState = () => {
        segRef.current = 0;
        progressRef.current = 0;
        setPos(stops[0] ?? [0, 0]);

        if (stops.length >= 2) {
            const from = stops[0] as MapPoint;
            const to = stops[1] as MapPoint;
            const control = getCurveControlPoint(from, to);
            const tangent = getQuadraticBezierTangent(from, control, to, 0.01);
            setAngle(bearingFromVector(tangent));
        } else {
            setAngle(0);
        }
    };

    const animateSegment = (seg: number, startTs: number, ts: number) => {
        if (seg >= stops.length - 1) {
            setPos(stops[stops.length - 1]);
            onStopReached?.(stops.length - 1);
            onComplete?.();
            return;
        }
        const from = stops[seg] as MapPoint;
        const to = stops[seg + 1] as MapPoint;
        const control = getCurveControlPoint(from, to);

        // On the very first frame of a new segment, fit the map to the full curve
        if (ts === startTs && seg === segRef.current) {
            map.fitBounds(
                [from, control, to],
                { padding: [80, 80], animate: true, duration: 0.8, maxZoom: 10 }
            );
        }

        const elapsed = ts - startTs;
        const t = Math.min(elapsed / STEP_DURATION, 1);
        progressRef.current = t;
        const current = getQuadraticBezierPoint(from, control, to, t);
        const tangent = getQuadraticBezierTangent(from, control, to, Math.min(t + 0.001, 1));
        setPos(current);
        setAngle(bearingFromVector(tangent));

        if (t < 1) {
            rafRef.current = requestAnimationFrame((nextTs) => animateSegment(seg, startTs, nextTs));
        } else {
            const nextSegment = seg + 1;

            onStopReached?.(nextSegment);
            segRef.current = nextSegment;
            progressRef.current = 0;

            if (nextSegment >= stops.length - 1) {
                onComplete?.();
                return;
            }

            // Arrived at next stop — pause then continue
            timerRef.current = setTimeout(() => {
                rafRef.current = requestAnimationFrame((nextTs) => {
                    animateSegment(segRef.current, nextTs, nextTs);
                });
            }, PAUSE_DURATION);
        }
    };

    useEffect(() => {
        cancel();
        const nextStopsKey = stops.join(',');
        const stopsChanged = stopsKeyRef.current !== nextStopsKey;
        if (stopsChanged) {
            stopsKeyRef.current = nextStopsKey;
            resetPlaybackState();
        }

        if (!isPlaying || stops.length < 2) return;

        if (segRef.current >= stops.length - 1) {
            resetPlaybackState();
        }

        rafRef.current = requestAnimationFrame((ts) => {
            const resumedProgress = progressRef.current;
            animateSegment(segRef.current, ts - resumedProgress * STEP_DURATION, ts);
        });

        return cancel;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlaying, stops.join(',')]);

    if (!isPlaying) return null;

    return (
        <Marker
            position={pos}
            icon={createArrowIcon(angle, color)}
            zIndexOffset={2000}
        />
    );
};

export default AnimatedArrow;
