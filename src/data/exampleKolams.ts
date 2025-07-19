import { KolamPattern } from '@/types/kolam';

// Example kolam patterns for demonstration
export const exampleKolams: KolamPattern[] = [
	{
		id: 'example-simple-square',
		name: 'Simple Square Pattern',
		dots: [
			{ id: 'dot1', center: { x: 100, y: 100 }, radius: 4, filled: true, color: '#8B4513' },
			{ id: 'dot2', center: { x: 150, y: 100 }, radius: 4, filled: true, color: '#8B4513' },
			{ id: 'dot3', center: { x: 200, y: 100 }, radius: 4, filled: true, color: '#8B4513' },
			{ id: 'dot4', center: { x: 100, y: 150 }, radius: 4, filled: true, color: '#8B4513' },
			{ id: 'dot5', center: { x: 150, y: 150 }, radius: 4, filled: true, color: '#8B4513' },
			{ id: 'dot6', center: { x: 200, y: 150 }, radius: 4, filled: true, color: '#8B4513' },
			{ id: 'dot7', center: { x: 100, y: 200 }, radius: 4, filled: true, color: '#8B4513' },
			{ id: 'dot8', center: { x: 150, y: 200 }, radius: 4, filled: true, color: '#8B4513' },
			{ id: 'dot9', center: { x: 200, y: 200 }, radius: 4, filled: true, color: '#8B4513' },
		],
		lines: [
			{ id: 'line1', start: { x: 100, y: 100 }, end: { x: 200, y: 100 }, strokeWidth: 2, color: '#8B4513' },
			{ id: 'line2', start: { x: 200, y: 100 }, end: { x: 200, y: 200 }, strokeWidth: 2, color: '#8B4513' },
			{ id: 'line3', start: { x: 200, y: 200 }, end: { x: 100, y: 200 }, strokeWidth: 2, color: '#8B4513' },
			{ id: 'line4', start: { x: 100, y: 200 }, end: { x: 100, y: 100 }, strokeWidth: 2, color: '#8B4513' },
			{ id: 'line5', start: { x: 150, y: 100 }, end: { x: 150, y: 200 }, strokeWidth: 2, color: '#8B4513' },
			{ id: 'line6', start: { x: 100, y: 150 }, end: { x: 200, y: 150 }, strokeWidth: 2, color: '#8B4513' },
		],
		gridSize: 50,
		dimensions: { width: 300, height: 300 },
		created: new Date(),
		modified: new Date(),
	}
];

export default exampleKolams;
