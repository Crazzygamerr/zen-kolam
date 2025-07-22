import { CurvePoint } from '@/types/kolam';

/**
 * Generate SVG path string from curve points using quadratic Bezier curves
 * @param curvePoints Array of curve points to convert to SVG path
 * @returns SVG path string (e.g., "M 10 10 Q 15 5 20 10")
 */
export function generateSVGPath(curvePoints?: CurvePoint[]): string {
	if (!curvePoints || curvePoints.length === 0) return '';

	let path = `M ${curvePoints[0].x} ${curvePoints[0].y}`;

	for (let i = 1; i < curvePoints.length; i++) {
		const point = curvePoints[i];
		const prevPoint = curvePoints[i - 1];

		// Use quadratic Bezier curves for smooth lines
		if (point.controlX !== undefined && point.controlY !== undefined) {
			path += ` Q ${point.controlX} ${point.controlY} ${point.x} ${point.y}`;
		} else {
			// Create smooth curves using the midpoint as control
			const controlX = (prevPoint.x + point.x) / 2;
			const controlY = (prevPoint.y + point.y) / 2;
			path += ` Q ${controlX} ${controlY} ${point.x} ${point.y}`;
		}
	}

	return path;
}
