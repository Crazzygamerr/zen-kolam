import { KolamCurvePattern } from '@/types/kolam';

// The 16 kolam curve patterns with actual coordinates
export const KOLAM_CURVE_PATTERNS: KolamCurvePattern[] = [
	// Pattern 1: Quarter circle curve (100 points)
	{
		id: 1,
		points: [
			{ x: 0.2500, y: 0.0000 }, { x: 0.2495, y: 0.0159 }, { x: 0.2480, y: 0.0316 }, { x: 0.2455, y: 0.0473 },
			{ x: 0.2420, y: 0.0628 }, { x: 0.2375, y: 0.0780 }, { x: 0.2321, y: 0.0929 }, { x: 0.2257, y: 0.1074 },
			{ x: 0.2185, y: 0.1215 }, { x: 0.2103, y: 0.1352 }, { x: 0.2013, y: 0.1482 }, { x: 0.1915, y: 0.1607 },
			{ x: 0.1809, y: 0.1725 }, { x: 0.1696, y: 0.1836 }, { x: 0.1576, y: 0.1940 }, { x: 0.1450, y: 0.2036 },
			{ x: 0.1318, y: 0.2124 }, { x: 0.1181, y: 0.2204 }, { x: 0.1039, y: 0.2274 }, { x: 0.0892, y: 0.2335 },
			{ x: 0.0742, y: 0.2387 }, { x: 0.0589, y: 0.2430 }, { x: 0.0434, y: 0.2462 }, { x: 0.0277, y: 0.2485 },
			{ x: 0.0119, y: 0.2497 }, { x: -0.0040, y: 0.2500 }, { x: -0.0198, y: 0.2492 }, { x: -0.0356, y: 0.2475 },
			{ x: -0.0512, y: 0.2447 }, { x: -0.0666, y: 0.2410 }, { x: -0.0818, y: 0.2363 }, { x: -0.0966, y: 0.2306 },
			{ x: -0.1110, y: 0.2240 }, { x: -0.1250, y: 0.2165 }, { x: -0.1384, y: 0.2081 }, { x: -0.1512, y: 0.1989 },
			{ x: -0.1633, y: 0.1889 }, { x: -0.1746, y: 0.1781 }, { x: -0.1850, y: 0.1666 }, { x: -0.1945, y: 0.1544 }
		],
		hasDownConnection: true,
		hasRightConnection: false,
	},

	// Pattern 2: Vertical curve (104 points) - simplified to key points
	{
		id: 2,
		points: [
			{ x: 0.0000, y: -0.5000 }, { x: 0.0252, y: -0.4559 }, { x: 0.0528, y: -0.4118 }, { x: 0.0818, y: -0.3677 },
			{ x: 0.1112, y: -0.3236 }, { x: 0.1405, y: -0.2795 }, { x: 0.1690, y: -0.2354 }, { x: 0.1965, y: -0.1913 },
			{ x: 0.2227, y: -0.1472 }, { x: 0.2474, y: -0.1031 }, { x: 0.2704, y: -0.0590 }, { x: 0.2914, y: -0.0149 },
			{ x: 0.3101, y: 0.0292 }, { x: 0.3264, y: 0.0733 }, { x: 0.3400, y: 0.1174 }, { x: 0.3509, y: 0.1615 },
			{ x: 0.3588, y: 0.2056 }, { x: 0.3636, y: 0.2497 }, { x: 0.3653, y: 0.2938 }, { x: 0.3638, y: 0.3379 },
			{ x: 0.3591, y: 0.3820 }, { x: 0.3514, y: 0.4261 }, { x: 0.3406, y: 0.4702 }, { x: 0.3267, y: 0.5143 },
			{ x: 0.3098, y: 0.5584 }, { x: 0.2899, y: 0.6025 }, { x: 0.2670, y: 0.6466 }, { x: 0.2412, y: 0.6907 },
			{ x: 0.2126, y: 0.7348 }, { x: 0.1812, y: 0.7789 }, { x: 0.1470, y: 0.8230 }, { x: 0.1102, y: 0.8671 },
			{ x: 0.0707, y: 0.9112 }, { x: 0.0287, y: 0.9553 }, { x: -0.0157, y: 0.9994 }, { x: -0.0618, y: 1.0435 }
		],
		hasDownConnection: false,
		hasRightConnection: true,
	},

	// Pattern 3: Horizontal curve (104 points) - simplified to key points
	{
		id: 3,
		points: [
			{ x: 0.5000, y: 0.0000 }, { x: 0.4559, y: 0.0252 }, { x: 0.4118, y: 0.0528 }, { x: 0.3677, y: 0.0818 },
			{ x: 0.3236, y: 0.1112 }, { x: 0.2795, y: 0.1405 }, { x: 0.2354, y: 0.1690 }, { x: 0.1913, y: 0.1965 },
			{ x: 0.1472, y: 0.2227 }, { x: 0.1031, y: 0.2474 }, { x: 0.0590, y: 0.2704 }, { x: 0.0149, y: 0.2914 },
			{ x: -0.0292, y: 0.3101 }, { x: -0.0733, y: 0.3264 }, { x: -0.1174, y: 0.3400 }, { x: -0.1615, y: 0.3509 },
			{ x: -0.2056, y: 0.3588 }, { x: -0.2497, y: 0.3636 }, { x: -0.2938, y: 0.3653 }, { x: -0.3379, y: 0.3638 },
			{ x: -0.3820, y: 0.3591 }, { x: -0.4261, y: 0.3514 }, { x: -0.4702, y: 0.3406 }, { x: -0.5143, y: 0.3267 },
			{ x: -0.5584, y: 0.3098 }, { x: -0.6025, y: 0.2899 }, { x: -0.6466, y: 0.2670 }, { x: -0.6907, y: 0.2412 },
			{ x: -0.7348, y: 0.2126 }, { x: -0.7789, y: 0.1812 }, { x: -0.8230, y: 0.1470 }, { x: -0.8671, y: 0.1102 },
			{ x: -0.9112, y: 0.0707 }, { x: -0.9553, y: 0.0287 }, { x: -0.9994, y: -0.0157 }, { x: -1.0435, y: -0.0618 }
		],
		hasDownConnection: true,
		hasRightConnection: true,
	},

	// Pattern 4: Simple curve
	{
		id: 4,
		points: [
			{ x: 0.0, y: 0.0 }, { x: 0.1, y: 0.1 }, { x: 0.2, y: 0.15 }, { x: 0.25, y: 0.2 }, { x: 0.2, y: 0.25 }
		],
		hasDownConnection: false,
		hasRightConnection: true,
	},

	// Pattern 5: Another simple curve
	{
		id: 5,
		points: [
			{ x: 0.0, y: 0.0 }, { x: 0.05, y: 0.1 }, { x: 0.1, y: 0.2 }, { x: 0.05, y: 0.25 }, { x: 0.0, y: 0.3 }
		],
		hasDownConnection: true,
		hasRightConnection: false,
	},

	// Pattern 6: Connecting curve
	{
		id: 6,
		points: [
			{ x: 0.0, y: 0.0 }, { x: 0.1, y: 0.05 }, { x: 0.2, y: 0.1 }, { x: 0.25, y: 0.15 }, { x: 0.3, y: 0.2 }
		],
		hasDownConnection: true,
		hasRightConnection: true,
	},

	// Patterns 7-16: Simplified versions for now
	{
		id: 7,
		points: [{ x: 0.0, y: 0.0 }, { x: 0.15, y: 0.1 }, { x: 0.25, y: 0.25 }],
		hasDownConnection: false,
		hasRightConnection: true,
	},
	{
		id: 8,
		points: [{ x: 0.0, y: 0.0 }, { x: 0.1, y: 0.15 }, { x: 0.0, y: 0.25 }],
		hasDownConnection: true,
		hasRightConnection: false,
	},
	{
		id: 9,
		points: [{ x: 0.0, y: 0.0 }, { x: 0.2, y: 0.1 }, { x: 0.3, y: 0.3 }],
		hasDownConnection: true,
		hasRightConnection: true,
	},
	{
		id: 10,
		points: [{ x: 0.0, y: 0.0 }, { x: 0.0, y: 0.25 }],
		hasDownConnection: true,
		hasRightConnection: false,
	},
	{
		id: 11,
		points: [{ x: 0.0, y: 0.0 }, { x: 0.25, y: 0.0 }],
		hasDownConnection: false,
		hasRightConnection: true,
	},
	{
		id: 12,
		points: [{ x: 0.0, y: 0.0 }, { x: 0.15, y: 0.15 }, { x: 0.25, y: 0.25 }],
		hasDownConnection: true,
		hasRightConnection: true,
	},
	{
		id: 13,
		points: [{ x: 0.0, y: 0.0 }, { x: 0.1, y: 0.2 }, { x: 0.25, y: 0.15 }],
		hasDownConnection: false,
		hasRightConnection: true,
	},
	{
		id: 14,
		points: [{ x: 0.0, y: 0.0 }, { x: 0.2, y: 0.1 }, { x: 0.15, y: 0.25 }],
		hasDownConnection: true,
		hasRightConnection: false,
	},
	{
		id: 15,
		points: [{ x: 0.0, y: 0.0 }, { x: 0.1, y: 0.1 }, { x: 0.2, y: 0.2 }, { x: 0.25, y: 0.25 }],
		hasDownConnection: true,
		hasRightConnection: true,
	},
	{
		id: 16,
		points: [{ x: 0.0, y: 0.0 }, { x: 0.2, y: 0.05 }, { x: 0.25, y: 0.2 }, { x: 0.3, y: 0.25 }],
		hasDownConnection: true,
		hasRightConnection: true,
	},
];

export const CONNECTIVITY_RULES = {
	// Patterns that can connect downward
	downConnectors: new Set([1, 3, 5, 6, 8, 9, 10, 12, 14, 15, 16]),

	// Patterns that can connect rightward  
	rightConnectors: new Set([2, 3, 4, 6, 7, 9, 11, 12, 13, 15, 16]),

	compatiblePatterns: {
		1: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], // Pattern 1 can connect to most
		2: [1, 4, 5, 8, 11, 14, 15, 16],
		3: [1, 4, 5, 8, 9, 10, 12],
		4: [1, 2, 3, 6, 7, 11, 13, 14, 15, 16],
		5: [1, 2, 3, 6, 7, 11, 13, 14, 15, 16],
		6: [4, 5, 8, 9, 10, 11, 12, 14, 15, 16],
		7: [1, 4, 5, 8, 9, 10, 12],
		8: [2, 3, 6, 7, 11, 13, 14, 15, 16],
		9: [2, 3, 6, 7, 11, 13],
		10: [1, 4, 5, 8, 14, 15, 16],
		11: [4, 5, 8, 9, 10, 12, 14, 15, 16],
		12: [2, 3, 6, 7, 11, 13],
		13: [1, 4, 5, 8, 9, 10, 12, 15, 16],
		14: [1, 4, 5, 8, 9, 10, 12, 15, 16],
		15: [2, 3, 6, 7, 11, 13],
		16: [2, 3, 6, 7, 11, 13],
	} as { [key: number]: number[] }
};

export const SYMMETRY_TRANSFORMS = {
	horizontalInverse: [1, 2, 5, 4, 3, 9, 8, 7, 6, 10, 11, 12, 15, 14, 13, 16],
	verticalInverse: [1, 4, 3, 2, 5, 7, 6, 9, 8, 10, 11, 14, 13, 12, 15, 16],
	rotation90: [1, 3, 2, 5, 4, 6, 9, 8, 7, 11, 10, 13, 12, 15, 14, 16],
	diagonalSymmetric: [1, 6, 8, 16], // Patterns that are symmetric along diagonal
};
