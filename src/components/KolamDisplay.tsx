import { CurvePoint, KolamPattern } from '@/types/kolam';
import { generateSVGPath } from '@/utils/svgPathGenerator';
import React from 'react';

interface KolamDisplayProps {
	pattern: KolamPattern;
	animate?: boolean;
	animationState?: 'stopped' | 'playing' | 'paused';
	animationTiming?: number;
	className?: string;
}

export const KolamDisplay: React.FC<KolamDisplayProps> = ({
	pattern,
	animate = false,
	animationState = 'stopped',
	animationTiming = 150,
	className = '',
}) => {
	const { dimensions, dots, curves } = pattern;

	// Calculate path length for accurate stroke animation
	const calculatePathLength = (curvePoints?: CurvePoint[]): number => {
		if (!curvePoints || curvePoints.length < 2) return 100;

		let length = 0;
		for (let i = 1; i < curvePoints.length; i++) {
			const dx = curvePoints[i].x - curvePoints[i - 1].x;
			const dy = curvePoints[i].y - curvePoints[i - 1].y;
			length += Math.sqrt(dx * dx + dy * dy);
		}
		return Math.max(length, 50);
	};

	// Calculate line length for simple lines
	const calculateLineLength = (x1: number, y1: number, x2: number, y2: number): number => {
		const dx = x2 - x1;
		const dy = y2 - y1;
		return Math.sqrt(dx * dx + dy * dy);
	};

	return (
		<div className={`kolam-container ${className}`}>
			<svg
				width={dimensions.width}
				height={dimensions.height}
				viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
				className="kolam-svg"
				style={{
					maxWidth: '100%',
					height: 'auto',
					'--animation-duration': `${animationTiming}ms`
				} as React.CSSProperties}
			>
				{/* Render dots */}
				{dots.map((dot, index) => (
					<circle
						key={dot.id}
						cx={dot.center.x}
						cy={dot.center.y}
						r={dot.radius || 3}
						fill={dot.filled ? (dot.color || 'white') : 'none'}
						stroke={dot.color || 'white'}
						strokeWidth={dot.filled ? 0 : 1}
						className={animate ? 'kolam-dot-animated' : 'kolam-dot'}
						style={
							animate
								? {
									animationDelay: `${(index / dots.length) * animationTiming * 0.9}ms`,
									animationDuration: `${animationTiming / dots.length}ms`,
									opacity: 0,
									animationPlayState: animationState === 'paused' ? 'paused' : 'running',
								}
								: animationState === 'stopped'
									? { opacity: 1 }
									: {}
						}
					/>
				))}

				{/* Render curves using SVG paths with stroke animation */}
				{curves.map((curve, index) => {
					// let curveDelay = animationTiming * (index / curves.length) * 0.25 // Delay based on curve index	
					const lineAnimTime = (animationTiming / curves.length) * 3 // Animation time for each curve
					const curveDelay = lineAnimTime * 0.33 * index;

					if (curve.curvePoints && curve.curvePoints.length > 1) {
						// Calculate path length for proper animation
						const pathLength = calculatePathLength(curve.curvePoints);

						// Render as smooth SVG path
						return (
							<path
								key={curve.id}
								d={generateSVGPath(curve.curvePoints)}
								stroke={curve.color || 'white'}
								strokeWidth={curve.strokeWidth || 2}
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								className={animate ? 'kolam-path-animated' : 'kolam-path'}
								style={
									animate
										? {
											animationDelay: `${curveDelay}ms`,
											animationDuration: `${lineAnimTime}ms`,
											strokeDasharray: `${pathLength}`,
											strokeDashoffset: `${pathLength}`,
											animationPlayState: animationState === 'paused' ? 'paused' : 'running',
										}
										: animationState === 'stopped'
											? { strokeDasharray: 'none', strokeDashoffset: '0', opacity: 1 }
											: {}
								}
							/>
						);
					} else {
						// Handle simple lines (fallback)
						const lineLength = calculateLineLength(curve.start.x, curve.start.y, curve.end.x, curve.end.y);

						return (
							<line
								key={curve.id}
								x1={curve.start.x}
								y1={curve.start.y}
								x2={curve.end.x}
								y2={curve.end.y}
								stroke={curve.color || 'white'}
								strokeWidth={curve.strokeWidth || 2}
								strokeLinecap="round"
								className={animate ? 'kolam-line-animated' : 'kolam-line'}
								style={
									animate
										? {
											animationDelay: `${curveDelay}ms`,
											animationDuration: `${lineAnimTime}ms`,
											strokeDasharray: `${lineLength}`,
											strokeDashoffset: `${lineLength}`,
											animationPlayState: animationState === 'paused' ? 'paused' : 'running',
										}
										: animationState === 'stopped'
											? { strokeDasharray: 'none', strokeDashoffset: '0', opacity: 1 }
											: { opacity: 0 }
								}
							/>
						);
					}
				})}
			</svg>

			{/* CSS for animations */}
			<style jsx>{`
        .kolam-dot-animated {
          animation: fadeIn ease-in-out forwards;
        }

        .kolam-line-animated,
        .kolam-path-animated {
          animation: drawPath ease-in-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes drawPath {
          to {
            stroke-dashoffset: 0;
          }
        }

        .kolam-svg {
          filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1));
        }
        
        .kolam-path,
        .kolam-line {
          transition: stroke-width 0.2s ease;
        }
        
        .kolam-path:hover,
        .kolam-line:hover {
          stroke-width: 3;
        }
      `}</style>
		</div>
	);
};
