'use client';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { KolamDisplay } from '@/components/KolamDisplay';
import { KolamPattern } from '@/types/kolam';
import { KolamGenerator } from '@/utils/kolamGenerator';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function ContinuousPage() {
	const [currentPattern, setCurrentPattern] = useState<KolamPattern | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [animationSpeed, setAnimationSpeed] = useState(3000);
	const [patternSize, setPatternSize] = useState(5);
	const [isAnimating, setIsAnimating] = useState(false);

	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const animationRef = useRef<NodeJS.Timeout | null>(null);

	const generateNewPattern = useCallback(() => {
		try {
			const newPattern = KolamGenerator.generateKolam1D(patternSize);
			setCurrentPattern(newPattern);
		} catch (error) {
			console.error('Failed to generate pattern:', error);
			setCurrentPattern(null);
		}
	}, [patternSize]);

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
			generateNewPattern();
		}
	}, [isPlaying, generateNewPattern]);

	useEffect(() => {
		if (!isPlaying || !currentPattern) return;

		setIsAnimating(true);

		const animationDuration = Math.floor(animationSpeed * 0.8);

		animationRef.current = setTimeout(() => {
			setIsAnimating(false);
		}, animationDuration);

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
	}, [isPlaying, currentPattern, animationSpeed, generateNewPattern]);

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
			<Header 
				title="Zen Kolam" 
				subtitle="Continuous Animation" 
				showBackButton={true} 
			/>
			<div className="max-w-6xl mx-auto p-8">
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

							<div className="absolute top-4 left-4">
								<div className={`px-3 py-2 rounded-lg text-sm font-medium backdrop-blur-sm border-2 ${isPlaying
									? 'bg-green-600/90 text-green-100 border-green-400/50'
									: 'bg-amber-700/50 text-amber-100 border-amber-500/50'
									}`}>
									<div className="flex items-center gap-2">
										<div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-amber-300'
											}`} />
										{isPlaying ? 'Playing' : 'Paused'}
									</div>
								</div>
							</div>

							<div className="absolute top-4 right-4">
								<div className="bg-amber-900/90 border-2 border-white rounded-lg px-3 py-2 text-amber-100 text-sm backdrop-blur-sm">
									{currentPattern.dots.length} dots • {currentPattern.curves.length} curves
									{isAnimating && <span className="text-green-400 ml-2">• Animating</span>}
								</div>
							</div>
						</div>
					) : (
						<div className="kolam-container flex justify-center items-center bg-amber-900 border-4 border-white p-8 rounded-2xl shadow-lg h-96">
							<div className="text-amber-100 text-lg">
								<div className="w-8 h-8 border-2 border-amber-100 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
								Generating pattern...
							</div>
						</div>
					)}
				</div>

				<div className="controls-area">
					<div className="controls-container bg-amber-900 border-4 border-white p-6 rounded-2xl shadow-lg">
						<div className="parameters-grid grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
							<div className="parameter-group">
								<label className="block text-sm font-medium text-amber-100 mb-2">
									Animation Speed (seconds per pattern)
								</label>
								<div className="flex items-center gap-3">
									<input
										type="range"
										min="1"
										max="10"
										step="0.5"
										value={animationSpeed / 1000}
										onChange={(e) => setAnimationSpeed(parseFloat(e.target.value) * 1000)}
										disabled={isPlaying}
										className="flex-1 disabled:opacity-50"
									/>
									<span className="text-amber-100 text-sm w-12">
										{(animationSpeed / 1000).toFixed(1)}s
									</span>
								</div>
							</div>

							<div className="parameter-group">
								<label className="block text-sm font-medium text-amber-100 mb-2">
									Pattern Size (grid dimensions)
								</label>
								<div className="flex items-center gap-3">
									<select
										value={patternSize}
										onChange={(e) => setPatternSize(parseInt(e.target.value))}
										disabled={isPlaying}
										className="px-3 py-2 border-2 border-white rounded bg-amber-700 text-amber-100 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										<option value={3}>3×3</option>
										<option value={4}>4×4</option>
										<option value={5}>5×5</option>
										<option value={6}>6×6</option>
										<option value={7}>7×7</option>
									</select>
								</div>
							</div>
						</div>

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
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
}
