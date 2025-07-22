'use client';

import { KolamPattern } from '@/types/kolam';
import { KolamExporter } from '@/utils/kolamExporter';
import { KolamGenerator } from '@/utils/kolamGenerator';
import { durationToSpeed, generateEmbedURL, speedToDuration, updateURL, useKolamURLParams } from '@/utils/urlParams';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { KolamDisplay } from './KolamDisplay';

export const KolamEditor: React.FC = () => {
	const [currentPattern, setCurrentPattern] = useState<KolamPattern | null>(null);
	const [isExporting, setIsExporting] = useState(false);
	const [showDownloadMenu, setShowDownloadMenu] = useState(false);
	const [animationState, setAnimationState] = useState<'stopped' | 'playing' | 'paused'>('stopped');
	const kolamRef = useRef<HTMLDivElement>(null);

	// Get URL parameters
	const urlParams = useKolamURLParams();
	const [size, setSize] = useState(urlParams.size);
	const [animationSpeed, setAnimationSpeed] = useState(durationToSpeed(urlParams.duration));
	const [animationDuration, setAnimationDuration] = useState(urlParams.duration);
	const [initialAutoAnimate, setInitialAutoAnimate] = useState(urlParams.initialAutoAnimate);

	// Update URL when parameters change
	useEffect(() => {
		updateURL({ size, duration: animationDuration, initialAutoAnimate });
	}, [size, animationDuration, initialAutoAnimate]);

	// Update duration when speed changes
	useEffect(() => {
		const newDuration = speedToDuration(animationSpeed);
		setAnimationDuration(newDuration);
	}, [animationSpeed]);

	// Close download menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (showDownloadMenu && !(event.target as Element).closest('.download-menu')) {
				setShowDownloadMenu(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [showDownloadMenu]);

	// Handle animation end detection
	useEffect(() => {
		if (animationState === 'playing' && currentPattern) {
			const timer = setTimeout(() => {
				setAnimationState('stopped');
			}, animationDuration);

			return () => clearTimeout(timer);
		}
	}, [animationState, currentPattern, animationDuration]);

	// Convert animation speed (1-10) to total animation duration - kept for UI display
	const getAnimationTiming = (speed: number) => {
		return speedToDuration(speed);
	};

	const generatePattern = useCallback(() => {
		console.log('🎯 Generating kolam pattern');

		try {
			console.log('📏 Generating Kolam...');
			const pattern = KolamGenerator.generateKolam1D(size);

			console.log('✅ Pattern generated successfully:', pattern);
			setCurrentPattern(pattern);
			setAnimationState('stopped'); // Reset animation when generating new pattern
			
			// Start animation after a brief delay if auto-animate is enabled
			if (initialAutoAnimate) {
				setTimeout(() => {
					setAnimationState('playing');
				}, 100);
			}
		} catch (error) {
			console.error('❌ Error generating pattern:', error);
			const errorMessage = error instanceof Error ? error.message : String(error);
			alert(`Error generating pattern: ${errorMessage}`);
		}
	}, [size, initialAutoAnimate]);

	// Generate initial pattern on component mount
	useEffect(() => {
		generatePattern();
	}, [generatePattern]);

	const exportPattern = async (format: 'svg' | 'png' | 'gif') => {
		if (!currentPattern || !kolamRef.current) return;

		setIsExporting(true);

		try {
			switch (format) {
				case 'svg':
					await KolamExporter.downloadSVG(currentPattern);
					break;
				case 'png':
					await KolamExporter.downloadPNG(kolamRef.current, currentPattern.name);
					break;
				case 'gif':
					await KolamExporter.downloadAnimatedGIF(
						kolamRef.current,
						currentPattern,
						currentPattern.name,
						{ format: 'gif', frameCount: 30, delay: animationDuration }
					);
					break;
			}
		} catch (error) {
			console.error('Export failed:', error);
			alert('Export failed. Please try again.');
		} finally {
			setIsExporting(false);
		}
	};

	const getEmbedCode = async () => {
		if (!currentPattern) return;

		try {
			const embedURL = generateEmbedURL({
				size,
				background: '#7b3306', // Default amber-900 background
				brush: '#ffffff', // Default white brush
			});

			const embedCode = `<img src="${embedURL}" alt="Kolam Pattern" style="max-width: 100%; height: auto;" />`;

			await navigator.clipboard.writeText(embedCode);
			alert('Embed code copied to clipboard! This will display the kolam as an SVG image.');
		} catch (error) {
			console.error('Failed to generate embed code:', error);
			alert('Failed to copy embed code. Please try again.');
		}
	};

	const copyRawSVG = async () => {
		if (!currentPattern) return;

		try {
			const svgContent = await KolamExporter.exportAsSVG(currentPattern);
			await navigator.clipboard.writeText(svgContent);
			alert('Raw SVG code copied to clipboard! You can paste this directly into HTML or image editing software.');
		} catch (error) {
			console.error('Failed to copy raw SVG:', error);
			alert('Failed to copy raw SVG. Please try again.');
		}
	}; return (
		<div className="kolam-editor bg-amber-100 text-amber-900 min-h-screen">
			{/* Header */}
			<header className="p-6 text-white" style={{ backgroundColor: '#5ba293' }}>
				<div className="max-w-6xl mx-auto">
					<h1 className="text-4xl font-bold text-center tracking-wide">
						Zen Kolam Generator
					</h1>
					<p className="text-center mt-2 text-lg opacity-90">
						Generate beautiful traditional South Indian geometric patterns
					</p>
				</div>
			</header>

			<div className="max-w-6xl mx-auto p-8">
				{/* Display Area */}
				<div className="kolam-display-area">
					{currentPattern ? (
						<div
							ref={kolamRef}
							className="kolam-container relative flex justify-center items-center bg-amber-900 border-4 border-white p-8 rounded-2xl shadow-lg"
						>
							<KolamDisplay
								pattern={currentPattern}
								animate={animationState === 'playing'}
								animationState={animationState}
								animationTiming={getAnimationTiming(animationSpeed)}
								className="kolam-main"
							/>

							{/* Save button overlaid on canvas */}
							{currentPattern && (
								<div className="absolute top-4 right-4">
									<div className="relative download-menu">
										<button
											onClick={() => setShowDownloadMenu(!showDownloadMenu)}
											disabled={isExporting}
											className="p-3 bg-amber-900/90 border-2 text-white rounded-lg hover:bg-amber-800/90 transition-colors disabled:opacity-50 shadow-lg backdrop-blur-sm"
											style={{ borderColor: '#ffffff', backgroundColor: '#f0c75e' }}
											title="Download Options"
										>
											{isExporting ? '⏳' : '💾'}
										</button>

										{showDownloadMenu && (
											<div className="absolute right-0 mt-2 bg-amber-900 border-2 border-white rounded-lg shadow-lg py-1 z-10 min-w-[200px]">
												<button
													onClick={() => { exportPattern('svg'); setShowDownloadMenu(false); }}
													className="w-full text-left px-4 py-2 text-amber-100 hover:bg-amber-800 transition-colors"
												>
													📄 Download SVG
												</button>
												<button
													onClick={() => { exportPattern('png'); setShowDownloadMenu(false); }}
													className="w-full text-left px-4 py-2 text-amber-100 hover:bg-amber-800 transition-colors"
												>
													🖼️ Download PNG
												</button>
												<hr className="my-1 border-white" />
												<button
													onClick={() => { getEmbedCode(); setShowDownloadMenu(false); }}
													className="w-full text-left px-4 py-2 text-amber-100 hover:bg-amber-800 transition-colors"
												>
													📋 Copy Embed Code
												</button>
												<button
													onClick={() => { copyRawSVG(); setShowDownloadMenu(false); }}
													className="w-full text-left px-4 py-2 text-amber-100 hover:bg-amber-800 transition-colors"
												>
													📄 Copy Raw SVG
												</button>
											</div>
										)}
									</div>
								</div>
							)}
						</div>
					) : (
						<div className="no-pattern text-center py-12 bg-amber-900 border-2 border-white rounded-2xl">
							<p className="text-amber-100 text-lg">
								Loading your first kolam...
							</p>
						</div>
					)}
				</div>

				{/* Controls */}
				<div className="bg-amber-900 border-4 border-white rounded-2xl p-6 mt-8">
					<h2 className="text-xl font-semibold mb-4 text-amber-100 flex items-center">
						<span className="mr-2">⚙️</span>
						Kolam Parameters
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
						{/* Size Parameter */}
						<div className="parameter-group">
							<label htmlFor="size" className="block text-sm font-medium text-amber-100 mb-2">
								Grid Size
							</label>
							<div className="flex items-center space-x-3">
								<input
									id="size"
									type="range"
									min="3"
									max="15"
									value={size}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSize(parseInt(e.target.value))}
									className="flex-1"
									style={{ accentColor: '#f0c75e' }}
								/>
								<div className="bg-amber-700 px-3 py-1 rounded text-amber-100 min-w-[3rem] text-center">
									{size}
								</div>
							</div>
							<div className="text-xs text-amber-100 mt-1">
								Creates a {size}x{size} pattern grid
							</div>
						</div>

						{/* Animation Speed Parameter */}
						<div className="parameter-group">
							<label htmlFor="animationSpeed" className="block text-sm font-medium text-amber-100 mb-2">
								Animation Duration
							</label>
							<div className="flex items-center space-x-3">
								<input
									id="animationSpeed"
									type="range"
									min="1"
									max="10"
									value={animationSpeed}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnimationSpeed(parseInt(e.target.value))}
									className="flex-1"
									style={{ accentColor: '#f0c75e' }}
								/>
								<div className="bg-amber-700 px-3 py-1 rounded text-amber-100 min-w-[3rem] text-center">
									{animationSpeed}
								</div>
							</div>
							<div className="text-xs text-amber-100 mt-1">
								Total: {(animationDuration / 1000).toFixed(1)}s
							</div>
						</div>

						{/* Auto-animate Parameter */}
						{/* <div className="parameter-group">
							<label htmlFor="autoAnimate" className="block text-sm font-medium text-amber-100 mb-2">
								Auto-animate
							</label>
							<div className="flex items-center space-x-3">
								<label className="flex items-center cursor-pointer">
									<input
										id="autoAnimate"
										type="checkbox"
										checked={initialAutoAnimate}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInitialAutoAnimate(e.target.checked)}
										className="sr-only"
									/>
									<div className={`relative w-12 h-6 rounded-full transition-colors ${initialAutoAnimate ? 'bg-amber-400' : 'bg-amber-700'}`}>
										<div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${initialAutoAnimate ? 'translate-x-6' : 'translate-x-0'}`}></div>
									</div>
									<span className="ml-3 text-amber-100 font-medium">
										{initialAutoAnimate ? 'On' : 'Off'}
									</span>
								</label>
							</div>
							<div className="text-xs text-amber-100 mt-1">
								Auto-play animation on generate
							</div>
						</div> */}
					</div>

					{/* Controls */}
					<div className="flex justify-center items-center gap-6">
						{currentPattern && (
							<button
								onClick={() => {
									if (animationState === 'playing') {
										setAnimationState('stopped');
									} else {
										setAnimationState('playing');
									}
								}}
								className="px-6 py-3 bg-amber-900 border-2 border-white text-white rounded-lg hover:bg-amber-800 transition-colors font-medium shadow-lg flex items-center gap-2"
								style={{ backgroundColor: animationState === 'playing' ? '#f0c75e' : undefined, color: animationState === 'playing' ? '#92400e' : undefined }}
								title={animationState === 'playing' ? 'Stop Animation' : 'Play Animation'}
							>
								{animationState === 'playing' ? '⏹️' : '▶️'}
								{animationState === 'playing' ? 'Stop Animation' : 'Play Animation'}
							</button>
						)}

						<button
							onClick={() => generatePattern()}
							className="px-8 py-3 border-2 border-white text-white rounded-lg hover:opacity-90 transition-colors font-medium shadow-lg"
							style={{ backgroundColor: '#5ba293' }}
						>
							Generate Kolam
						</button>
					</div>
				</div>
			</div>

			{/* Footer */}
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
};
