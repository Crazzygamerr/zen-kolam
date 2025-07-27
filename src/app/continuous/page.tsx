'use client';

import { KolamDisplay } from '@/components/KolamDisplay';
import { KolamPattern } from '@/types/kolam';
import { KolamGenerator } from '@/utils/kolamGenerator';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function ContinuousPage() {
	const [currentPattern, setCurrentPattern] = useState<KolamPattern | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [animationSpeed, setAnimationSpeed] = useState(3000); // Default 3 seconds per pattern
	const [patternSize, setPatternSize] = useState(5); // Default 5x5 pattern
	const [loopCount, setLoopCount] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);
	const [totalDotsGenerated, setTotalDotsGenerated] = useState(0);
	const [totalCurvesGenerated, setTotalCurvesGenerated] = useState(0);
	const [startTime, setStartTime] = useState<Date | null>(null);

	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const animationRef = useRef<NodeJS.Timeout | null>(null);

	// Generate a new random pattern
	const generateNewPattern = useCallback(() => {
		try {
			const newPattern = KolamGenerator.generateKolam1D(patternSize);
			setCurrentPattern(newPattern);
			setLoopCount(prev => prev + 1);
			setTotalDotsGenerated(prev => prev + newPattern.dots.length);
			setTotalCurvesGenerated(prev => prev + newPattern.curves.length);
		} catch (error) {
			console.error('Failed to generate pattern:', error);
			// Just set to null on error - the loading state will show
			setCurrentPattern(null);
		}
	}, [patternSize]);

	// Start/stop the continuous loop
	const togglePlayback = useCallback(() => {
		if (isPlaying) {
			setIsPlaying(false);
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
			if (animationRef.current) {
				clearTimeout(animationRef.current);
				animationRef.current = null;
			}
			setIsAnimating(false);
		} else {
			setIsPlaying(true);
			setStartTime(new Date());
			generateNewPattern(); // Start with a new pattern
		}
	}, [isPlaying, generateNewPattern]);

	// Handle the continuous loop logic
	useEffect(() => {
		if (!isPlaying || !currentPattern) return;

		// Start animation
		setIsAnimating(true);

		// Calculate timing: 80% for animation, 20% for pause
		const animationDuration = Math.floor(animationSpeed * 0.8);
		const pauseDuration = Math.floor(animationSpeed * 0.2);

		// Stop animation after it completes
		animationRef.current = setTimeout(() => {
			setIsAnimating(false);
		}, animationDuration);

		// Generate new pattern after full cycle
		timeoutRef.current = setTimeout(() => {
			if (isPlaying) {
				generateNewPattern();
			}
		}, animationSpeed);

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			if (animationRef.current) {
				clearTimeout(animationRef.current);
			}
		};
	}, [currentPattern, isPlaying, animationSpeed, generateNewPattern]);

	// Generate initial pattern on mount
	useEffect(() => {
		generateNewPattern();
	}, [generateNewPattern]);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			if (event.target instanceof HTMLElement && (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT')) {
				return; // Don't trigger shortcuts when typing in inputs
			}

			switch (event.key.toLowerCase()) {
				case ' ':
				case 'p':
					event.preventDefault();
					togglePlayback();
					break;
				case 'n':
					if (!isPlaying) {
						event.preventDefault();
						generateNewPattern();
					}
					break;
				case 'r':
					if (!isPlaying) {
						event.preventDefault();
						setLoopCount(0);
						setTotalDotsGenerated(0);
						setTotalCurvesGenerated(0);
						setStartTime(null);
					}
					break;
			}
		};

		window.addEventListener('keydown', handleKeyPress);
		return () => window.removeEventListener('keydown', handleKeyPress);
	}, [isPlaying, togglePlayback, generateNewPattern]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			if (animationRef.current) {
				clearTimeout(animationRef.current);
			}
		};
	}, []);

	return (
		<div className="kolam-editor bg-amber-100 text-amber-900 min-h-screen">
			<div className="max-w-6xl mx-auto p-8">
				{/* Navigation */}
				<div className="mb-6">
					<Link
						href="/"
						className="inline-flex items-center px-4 py-2 bg-amber-900 border-2 border-white text-amber-100 rounded-lg hover:bg-amber-800 transition-colors"
					>
						← Back to Editor
					</Link>
				</div>

				{/* Display Area */}
				<div className="kolam-display-area">
					{currentPattern ? (
						<div className="kolam-container relative flex justify-center items-center bg-amber-900 border-4 border-white p-8 rounded-2xl shadow-lg">
							<KolamDisplay
								pattern={currentPattern}
								animate={isAnimating}
								animationState={isAnimating ? 'playing' : 'stopped'}
								animationTiming={Math.floor(animationSpeed * 0.8)}
								className="kolam-main"
							/>

							{/* Status indicator overlaid on canvas */}
							<div className="absolute top-4 left-4">
								<div className={`px-3 py-2 rounded-lg text-sm font-medium backdrop-blur-sm border-2 ${isPlaying
									? 'bg-green-500/20 text-green-400 border-green-500/50'
									: 'bg-amber-700/50 text-amber-100 border-amber-500/50'
									}`}>
									<div className="flex items-center gap-2">
										<div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-amber-300'
											}`} />
										Loop #{loopCount}
										{startTime && isPlaying && (
											<span>• {Math.floor((Date.now() - startTime.getTime()) / 1000)}s</span>
										)}
									</div>
								</div>
							</div>

							{/* Pattern Info overlaid on canvas */}
							<div className="absolute top-4 right-4">
								<div className="bg-amber-900/90 border-2 border-white rounded-lg px-3 py-2 text-amber-100 text-sm backdrop-blur-sm">
									{currentPattern.dots.length} dots • {currentPattern.curves.length} curves
									{isAnimating && <span className="text-green-400 ml-2">• Animating</span>}
								</div>
							</div>
						</div>
					) : (
						<div className="no-pattern text-center py-12 bg-amber-900 border-2 border-white rounded-2xl">
							<p className="text-amber-100 text-lg">
								Generating your first kolam...
							</p>
						</div>
					)}
				</div>

				{/* Controls */}
				<div className="bg-amber-900 border-4 border-white rounded-2xl p-6 mt-8">
					<h2 className="text-xl font-semibold mb-4 text-amber-100 flex items-center">
						<span className="mr-2">🔄</span>
						Continuous Mode Settings
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
						{/* Pattern Size Parameter */}
						<div className="parameter-group">
							<label htmlFor="patternSize" className="block text-sm font-medium text-amber-100 mb-2">
								Grid Size
							</label>
							<div className="flex items-center space-x-3">
								<input
									id="patternSize"
									type="range"
									min="3"
									max="8"
									value={patternSize}
									onChange={(e) => setPatternSize(parseInt(e.target.value))}
									disabled={isPlaying}
									className="flex-1"
									style={{ accentColor: '#f0c75e' }}
								/>
								<div className="bg-amber-700 px-3 py-1 rounded text-amber-100 min-w-[3rem] text-center">
									{patternSize}
								</div>
							</div>
							<div className="text-xs text-amber-100 mt-1">
								Creates a {patternSize}×{patternSize} pattern grid
							</div>
						</div>

						{/* Animation Speed Parameter */}
						<div className="parameter-group">
							<label htmlFor="animSpeed" className="block text-sm font-medium text-amber-100 mb-2">
								Cycle Duration
							</label>
							<div className="flex items-center space-x-3">
								<input
									id="animSpeed"
									type="range"
									min="1500"
									max="8000"
									step="500"
									value={animationSpeed}
									onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
									className="flex-1"
									style={{ accentColor: '#f0c75e' }}
								/>
								<div className="bg-amber-700 px-3 py-1 rounded text-amber-100 min-w-[4rem] text-center">
									{(animationSpeed / 1000).toFixed(1)}s
								</div>
							</div>
							<div className="text-xs text-amber-100 mt-1">
								Time per pattern cycle
							</div>
						</div>

						{/* Statistics */}
						<div className="parameter-group">
							<label className="block text-sm font-medium text-amber-100 mb-2">
								Statistics
							</label>
							<div className="bg-amber-700 px-3 py-2 rounded text-amber-100 text-sm space-y-1">
								<div>Patterns: {loopCount}</div>
								<div>Total Elements: {totalDotsGenerated + totalCurvesGenerated}</div>
								{startTime && isPlaying && (
									<div>Runtime: {Math.floor((Date.now() - startTime.getTime()) / 1000)}s</div>
								)}
							</div>
						</div>
					</div>

					{/* Control Buttons */}
					<div className="flex justify-center items-center gap-6">
						<button
							onClick={togglePlayback}
							className={`px-8 py-3 border-2 border-white text-white rounded-lg hover:opacity-90 transition-colors font-medium shadow-lg ${isPlaying ? 'bg-red-600' : 'bg-green-600'
								}`}
						>
							{isPlaying ? '⏸️ Pause Continuous' : '▶️ Start Continuous'}
						</button>

						<button
							onClick={generateNewPattern}
							disabled={isPlaying}
							className="px-6 py-3 bg-amber-900 border-2 border-white text-white rounded-lg hover:bg-amber-800 transition-colors font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
							style={{ backgroundColor: '#5ba293' }}
						>
							🎲 Generate New Pattern
						</button>

						{loopCount > 0 && !isPlaying && (
							<button
								onClick={() => {
									setLoopCount(0);
									setTotalDotsGenerated(0);
									setTotalCurvesGenerated(0);
									setStartTime(null);
								}}
								className="px-6 py-3 bg-amber-900 border-2 border-white text-white rounded-lg hover:bg-amber-800 transition-colors font-medium shadow-lg"
								style={{ backgroundColor: '#dc2626' }}
							>
								🔄 Reset Stats
							</button>
						)}
					</div>

					{/* Keyboard Shortcuts Info */}
					<div className="mt-6 pt-4 border-t border-amber-700">
						<div className="text-center text-amber-100 text-sm">
							<strong>Keyboard Shortcuts:</strong> Space/P = Play/Pause • N = New Pattern • R = Reset Stats
						</div>
					</div>
				</div>
			</div>

			{/* Footer - Reuse from editor */}
			<footer className="p-6 text-white">
				<div className="max-w-6xl mx-auto flex justify-center items-center gap-6">
					<div className="flex gap-4">
						<a
							href="https://www.linkedin.com/in/rishi-balamurugan/"
							target="_blank"
							rel="noopener noreferrer"
							className="text-black hover:opacity-75 transition-opacity flex items-center gap-2"
							title="LinkedIn"
						>
							<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
								<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
							</svg>
							<span className="text-sm">LinkedIn</span>
						</a>
						<a
							href="https://github.com/crazzygamerr/zen-kolam"
							target="_blank"
							rel="noopener noreferrer"
							className="text-black hover:opacity-75 transition-opacity flex items-center gap-2"
							title="GitHub"
						>
							<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
								<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
							</svg>
							<span className="text-sm">GitHub</span>
						</a>
					</div>
				</div>
			</footer>
		</div>
	);
}
