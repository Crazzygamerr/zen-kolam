import { KolamCurvePattern } from '@/types/kolam';
import kolamData from './kolamPatternsData.json';

// Convert the JSON data to our pattern format
export const KOLAM_CURVE_PATTERNS: KolamCurvePattern[] = kolamData.patterns.map(pattern => ({
	id: pattern.id,
	points: pattern.points,
	hasDownConnection: pattern.hasDownConnection,
	hasRightConnection: pattern.hasRightConnection,
}));

// Updated based on actual pattern analysis
export const CONNECTIVITY_RULES = {
	// Patterns that can connect downward
	downConnectors: new Set(
		KOLAM_CURVE_PATTERNS
			.filter(p => p.hasDownConnection)
			.map(p => p.id)
	),

	// Patterns that can connect rightward  
	rightConnectors: new Set(
		KOLAM_CURVE_PATTERNS
			.filter(p => p.hasRightConnection)
			.map(p => p.id)
	),

	compatiblePatterns: generateCompatibilityMatrix()
};

function generateCompatibilityMatrix(): { [key: number]: number[] } {
	const matrix: { [key: number]: number[] } = {};

	// For each pattern, determine which patterns it can connect to
	for (let i = 1; i <= 16; i++) {
		const currentPattern = KOLAM_CURVE_PATTERNS.find(p => p.id === i);
		if (!currentPattern) continue;

		const compatible: number[] = [];

		// A pattern can connect to another if:
		// 1. Current has right connection AND target has left connection capability
		// 2. Current has down connection AND target has up connection capability
		// 3. Both are empty/simple patterns

		for (let j = 1; j <= 16; j++) {
			const targetPattern = KOLAM_CURVE_PATTERNS.find(p => p.id === j);
			if (!targetPattern) continue;

			// Simple compatibility logic - can be refined based on actual testing
			if (i === j) continue; // Don't connect to self

			// If current pattern has connections, target should be compatible
			if (currentPattern.hasRightConnection || currentPattern.hasDownConnection) {
				if (targetPattern.hasRightConnection || targetPattern.hasDownConnection || j === 1) {
					compatible.push(j);
				}
			} else {
				// If current is simple, can connect to most patterns
				compatible.push(j);
			}
		}

		matrix[i] = compatible;
	}

	return matrix;
}

// Symmetry transformations (h_inv, v_inv)
export const SYMMETRY_TRANSFORMS = {
	horizontalInverse: [1, 2, 5, 4, 3, 9, 8, 7, 6, 10, 11, 12, 15, 14, 13, 16],
	verticalInverse: [1, 4, 3, 2, 5, 7, 6, 9, 8, 10, 11, 14, 13, 12, 15, 16],
	rotation90: [1, 3, 2, 5, 4, 6, 9, 8, 7, 11, 10, 13, 12, 15, 14, 16],
	diagonalSymmetric: [1, 6, 8, 16], // Patterns that are symmetric along diagonal
};

// Export pattern statistics for debugging
export const PATTERN_STATS = {
	totalPatterns: kolamData.totalPatterns,
	extractedAt: kolamData.extractedAt,
	description: kolamData.description,
	pointCounts: KOLAM_CURVE_PATTERNS.map(p => ({ id: p.id, points: p.points.length })),
	connectionCounts: {
		downConnectors: CONNECTIVITY_RULES.downConnectors.size,
		rightConnectors: CONNECTIVITY_RULES.rightConnectors.size,
	}
};
