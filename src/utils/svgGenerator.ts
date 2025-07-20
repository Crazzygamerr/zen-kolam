import { CurvePoint, KolamPattern, Point } from '@/types/kolam';

export interface SVGOptions {
	background?: string;
	brush?: string;
	padding?: number;
}

export function generateKolamSVG(pattern: KolamPattern, options: SVGOptions = {}): string {
	const {
		background = '#fef3c7',
		brush = '#92400e',
		padding = 40,
	} = options;

	const { dots, curves } = pattern;

	// Generate SVG path from curve points
	const generateSVGPath = (curvePoints?: CurvePoint[]): string => {
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
	};

	// Calculate SVG dimensions based on pattern
	const allPoints: Point[] = [];

	// Add curve points
	curves.forEach(curve => {
		if (curve.curvePoints && curve.curvePoints.length > 0) {
			allPoints.push(...curve.curvePoints);
		} else {
			// Fallback to start/end points if no curve points
			allPoints.push(curve.start, curve.end);
		}
	});

	// Add dot points
	dots.forEach(dot => {
		allPoints.push(dot.center);
	});

	const maxX = Math.max(...allPoints.map((p: Point) => p.x));
	const maxY = Math.max(...allPoints.map((p: Point) => p.y));
	const minX = Math.min(...allPoints.map((p: Point) => p.x));
	const minY = Math.min(...allPoints.map((p: Point) => p.y));

	const width = maxX - minX + (padding * 2);
	const height = maxY - minY + (padding * 2);
	const offsetX = -minX + padding;
	const offsetY = -minY + padding;

	// Generate SVG content
	let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="background-color: ${background};">
	<defs>
		<style>
			.kolam-curve {
				fill: none;
				stroke: ${brush};
				stroke-width: 3;
				stroke-linecap: round;
				stroke-linejoin: round;
			}
			.kolam-dot {
				fill: ${brush};
			}
		</style>
	</defs>
	<g transform="translate(${offsetX}, ${offsetY})">`;

	// Add dots
	dots.forEach(dot => {
		svgContent += `
		<circle class="kolam-dot" cx="${dot.center.x}" cy="${dot.center.y}" r="4"/>`;
	});

	// Add curves
	curves.forEach((curve) => {
		if (curve.curvePoints && curve.curvePoints.length > 1) {
			// Render as smooth SVG path
			const pathData = generateSVGPath(curve.curvePoints);
			svgContent += `
		<path class="kolam-curve" d="${pathData}"/>`;
		} else {
			// Handle simple lines (fallback)
			svgContent += `
		<line class="kolam-curve" x1="${curve.start.x}" y1="${curve.start.y}" x2="${curve.end.x}" y2="${curve.end.y}"/>`;
		}
	});

	svgContent += `
	</g>
</svg>`;

	return svgContent;
}
