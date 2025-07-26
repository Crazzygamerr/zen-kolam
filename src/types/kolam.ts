// Core kolam data structures and types for traditional South Indian geometric patterns

export interface Point {
	x: number;
	y: number;
}

// Complex curve point with smooth coordinates for drawing curves
export interface CurvePoint {
	x: number;
	y: number;
	controlX?: number; // For Bezier curves
	controlY?: number; // For Bezier curves
}

// 16 different curve patterns for traditional kolam designs
export interface KolamCurvePattern {
	id: number; // 1-16 pattern index
	points: CurvePoint[]; // Array of curve points
	hasDownConnection: boolean; // pt_dn connectivity
	hasRightConnection: boolean; // pt_rt connectivity
}

export interface GridCell {
	row: number;
	col: number;
	patternId: number; // 1-16, corresponds to traditional patterns
	dotCenter: Point;
}

export interface KolamGrid {
	size: number; // n x n grid
	cells: GridCell[][];
	cellSpacing: number;
}

export interface Line {
	id: string;
	start: Point;
	end: Point;
	strokeWidth?: number;
	color?: string;
	curvePoints?: CurvePoint[]; // For smooth curves
}

export interface Dot {
	id: string;
	center: Point;
	radius?: number;
	color?: string;
	filled?: boolean;
}

export interface KolamPattern {
	id: string;
	name: string;
	grid: KolamGrid;
	curves: Line[]; // Generated from grid patterns
	dots: Dot[];
	symmetryType: '1D' | '2D' | 'none';
	dimensions: {
		width: number;
		height: number;
	};
	created: Date;
	modified: Date;
}

export interface AnimationStep {
	elementId: string;
	elementType: 'dot' | 'curve';
	delay: number;
	duration: number;
	drawOrder: number; // Order in which elements should be drawn
}

export interface KolamAnimation {
	id: string;
	patternId: string;
	steps: AnimationStep[];
	totalDuration: number;
	loop: boolean;
}

export type KolamExportFormat = 'svg' | 'png' | 'gif' | 'json';

export interface ExportOptions {
	format: KolamExportFormat;
	includeAnimation?: boolean;
	backgroundColor?: string;
	scale?: number;
}

// Connectivity rules for pattern matching in traditional kolam generation
export interface ConnectivityRules {
	downConnectors: Set<number>; // Patterns that connect downward
	rightConnectors: Set<number>; // Patterns that connect rightward
	compatiblePatterns: { [key: number]: number[] }; // Valid neighbors for each pattern
}
