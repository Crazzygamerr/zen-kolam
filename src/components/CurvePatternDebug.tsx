'use client';

import { KOLAM_CURVE_PATTERNS } from '@/data/kolamPatterns';
import { KolamCurvePattern } from '@/types/kolam';
import React from 'react';

interface CurvePatternDebugProps {
	pattern: KolamCurvePattern;
	size?: number;
}

const CurvePatternDebug: React.FC<CurvePatternDebugProps> = ({ pattern, size = 80 }) => {
	const padding = 20;
	const viewBoxSize = size + 2 * padding;
	const scale = size / 2; // Scale factor to make patterns visible

	// Create SVG path from curve points
	const pathData = pattern.points.length > 1
		? `M ${pattern.points.map(p => `${p.x * scale + viewBoxSize / 2} ${-p.y * scale + viewBoxSize / 2}`).join(' L ')}`
		: '';

	return (
		<div className="flex flex-col items-center p-2 border rounded bg-white shadow-sm">
			<div className="text-xs font-semibold mb-1 text-gray-700">Pattern {pattern.id}</div>
			<svg
				width={viewBoxSize}
				height={viewBoxSize}
				viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
				className="border border-gray-200"
			>
				{/* Grid lines for reference */}
				<defs>
					<pattern id={`grid-${pattern.id}`} width="10" height="10" patternUnits="userSpaceOnUse">
						<path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f0f0f0" strokeWidth="0.5" />
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill={`url(#grid-${pattern.id})`} />

				{/* Center dot */}
				<circle
					cx={viewBoxSize / 2}
					cy={viewBoxSize / 2}
					r="2"
					fill="#666"
					opacity="0.5"
				/>

				{/* Curve path */}
				{pathData && (
					<path
						d={pathData}
						stroke="#e11d48"
						strokeWidth="2"
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				)}

				{/* Connection indicators */}
				{pattern.hasDownConnection && (
					<circle
						cx={viewBoxSize / 2}
						cy={viewBoxSize / 2 + size / 4}
						r="3"
						fill="#10b981"
						opacity="0.7"
					/>
				)}

				{pattern.hasRightConnection && (
					<circle
						cx={viewBoxSize / 2 + size / 4}
						cy={viewBoxSize / 2}
						r="3"
						fill="#3b82f6"
						opacity="0.7"
					/>
				)}

				{/* Start and end points */}
				{pattern.points.length > 0 && (
					<>
						<circle
							cx={pattern.points[0].x * scale + viewBoxSize / 2}
							cy={-pattern.points[0].y * scale + viewBoxSize / 2}
							r="2"
							fill="#059669"
						/>
						{pattern.points.length > 1 && (
							<circle
								cx={pattern.points[pattern.points.length - 1].x * scale + viewBoxSize / 2}
								cy={-pattern.points[pattern.points.length - 1].y * scale + viewBoxSize / 2}
								r="2"
								fill="#dc2626"
							/>
						)}
					</>
				)}
			</svg>

			{/* Connection info */}
			<div className="text-xs mt-1 text-center">
				<div className="flex gap-1 justify-center">
					{pattern.hasDownConnection && (
						<span className="px-1 py-0.5 bg-green-100 text-green-700 rounded text-[10px]">↓</span>
					)}
					{pattern.hasRightConnection && (
						<span className="px-1 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px]">→</span>
					)}
					{!pattern.hasDownConnection && !pattern.hasRightConnection && (
						<span className="px-1 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px]">·</span>
					)}
				</div>
			</div>
		</div>
	);
};

export const CurvePatternDebugGrid: React.FC = () => {
	return (
		<div className="curve-pattern-debug p-6 bg-gray-50 rounded-lg">
			<h3 className="text-lg font-semibold mb-4 text-gray-800">Debug: 16 Curve Patterns</h3>
			<div className="grid grid-cols-4 gap-4 md:grid-cols-8">
				{KOLAM_CURVE_PATTERNS.map(pattern => (
					<CurvePatternDebug key={pattern.id} pattern={pattern} />
				))}
			</div>

			<div className="mt-4 text-sm text-gray-600">
				<div className="flex flex-wrap gap-4 items-center">
					<div className="flex items-center gap-1">
						<div className="w-3 h-3 rounded-full bg-green-500"></div>
						<span>Start Point</span>
					</div>
					<div className="flex items-center gap-1">
						<div className="w-3 h-3 rounded-full bg-red-600"></div>
						<span>End Point</span>
					</div>
					<div className="flex items-center gap-1">
						<div className="w-3 h-3 rounded-full bg-green-100 border border-green-500"></div>
						<span>Down Connection</span>
					</div>
					<div className="flex items-center gap-1">
						<div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-500"></div>
						<span>Right Connection</span>
					</div>
				</div>
			</div>
		</div>
	);
};
