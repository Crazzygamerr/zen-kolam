'use client';

import html2canvas from 'html2canvas-pro';
import { ExportOptions, KolamPattern } from '@/types/kolam';
import GIF from 'gif.js';

export class KolamExporter {
	static async exportAsSVG(pattern: KolamPattern): Promise<string> {
		const { dimensions, dots, curves } = pattern;

		let svgContent = `<svg width="${dimensions.width}" height="${dimensions.height}" viewBox="0 0 ${dimensions.width} ${dimensions.height}" xmlns="http://www.w3.org/2000/svg">`;

		// Add dots
		dots.forEach(dot => {
			svgContent += `<circle cx="${dot.center.x}" cy="${dot.center.y}" r="${dot.radius || 3}" fill="${dot.filled ? (dot.color || 'white') : 'none'}" stroke="${dot.color || 'white'}" stroke-width="${dot.filled ? 0 : 1}" />`;
		});

		// Add curves
		curves.forEach(curve => {
			if (curve.curvePoints && curve.curvePoints.length > 1) {
				// Generate SVG path for smooth curves
				let pathData = `M ${curve.curvePoints[0].x} ${curve.curvePoints[0].y}`;
				for (let i = 1; i < curve.curvePoints.length; i++) {
					const point = curve.curvePoints[i];
					const prevPoint = curve.curvePoints[i - 1];
					const controlX = (prevPoint.x + point.x) / 2;
					const controlY = (prevPoint.y + point.y) / 2;
					pathData += ` Q ${controlX} ${controlY} ${point.x} ${point.y}`;
				}
				svgContent += `<path d="${pathData}" stroke="${curve.color || 'white'}" stroke-width="${curve.strokeWidth || 2}" fill="none" stroke-linecap="round" stroke-linejoin="round" />`;
			} else {
				// Fallback to simple line
				svgContent += `<line x1="${curve.start.x}" y1="${curve.start.y}" x2="${curve.end.x}" y2="${curve.end.y}" stroke="${curve.color || 'white'}" stroke-width="${curve.strokeWidth || 2}" stroke-linecap="round" />`;
			}
		});

		svgContent += '</svg>';
		return svgContent;
	}

	static async downloadSVG(pattern: KolamPattern, filename?: string): Promise<void> {
		const svgContent = await this.exportAsSVG(pattern);
		const blob = new Blob([svgContent], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = filename || `${pattern.name}.svg`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	static async exportAsPNG(element: HTMLElement, options: ExportOptions = { format: 'png' }): Promise<string> {
		const canvas = await html2canvas(element, {
			backgroundColor: options.backgroundColor || '#ffffff',
			scale: options.scale || 2,
			useCORS: true,
		});

		return canvas.toDataURL('image/png');
	}

	static async downloadPNG(element: HTMLElement, filename: string, options: ExportOptions = { format: 'png' }): Promise<void> {
		const dataUrl = await this.exportAsPNG(element, options);

		const a = document.createElement('a');
		a.href = dataUrl;
		a.download = `${filename}.png`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}

	static async exportAsAnimatedGIF(
		element: HTMLElement,
		pattern: KolamPattern,
		options: ExportOptions & { frameCount?: number; delay?: number } = { format: 'gif' }
	): Promise<Blob> {
		const gif = new GIF({
			workers: 2,
			quality: 10,
			width: pattern.dimensions.width,
			height: pattern.dimensions.height,
		});

		const frameCount = options.frameCount || 20;
		const delay = options.delay || 200;

		// Create frames by progressively showing elements
		for (let frame = 0; frame <= frameCount; frame++) {
			// Temporarily modify the element to show progressive animation
			const progressPercentage = frame / frameCount;
			const dotsToShow = Math.floor(pattern.dots.length * progressPercentage);
			const curvesToShow = Math.floor(pattern.curves.length * progressPercentage);

			// Hide elements beyond current frame
			const allDots = element.querySelectorAll('.kolam-dot, .kolam-dot-animated');
			const allCurves = element.querySelectorAll('.kolam-line, .kolam-line-animated, .kolam-curve, .kolam-curve-animated');

			allDots.forEach((dot, index) => {
				(dot as HTMLElement).style.opacity = index < dotsToShow ? '1' : '0';
			});

			allCurves.forEach((curve, index) => {
				(curve as HTMLElement).style.opacity = index < curvesToShow ? '1' : '0';
			});

			// Capture frame
			const canvas = await html2canvas(element, {
				backgroundColor: options.backgroundColor || '#ffffff',
				scale: options.scale || 1,
				useCORS: true,
			});

			gif.addFrame(canvas, { delay });
		}

		// Reset element visibility
		const allElements = element.querySelectorAll('.kolam-dot, .kolam-dot-animated, .kolam-line, .kolam-line-animated, .kolam-curve, .kolam-curve-animated');
		allElements.forEach(el => {
			(el as HTMLElement).style.opacity = '1';
		});

		return new Promise((resolve, _) => {
			gif.on('finished', resolve);
			gif.render();
		});
	}

	static async downloadAnimatedGIF(
		element: HTMLElement,
		pattern: KolamPattern,
		filename: string,
		options: ExportOptions & { frameCount?: number; delay?: number } = { format: 'gif' }
	): Promise<void> {
		try {
			const blob = await this.exportAsAnimatedGIF(element, pattern, options);
			const url = URL.createObjectURL(blob);

			const a = document.createElement('a');
			a.href = url;
			a.download = `${filename}.gif`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Error creating animated GIF:', error);
			throw error;
		}
	}

	static async getEmbedCode(pattern: KolamPattern, options: { width?: number; height?: number } = {}): Promise<string> {
		const svgString = await this.exportAsSVG(pattern);
		const encodedSvg = encodeURIComponent(svgString);
		const width = options.width || pattern.dimensions.width;
		const height = options.height || pattern.dimensions.height;

		return `<img src="data:image/svg+xml,${encodedSvg}" width="${width}" height="${height}" alt="${pattern.name}" />`;
	}
}
