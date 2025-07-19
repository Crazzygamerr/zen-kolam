const fs = require('fs');
const path = require('path');

// Read the numerical data file
const inputFile = path.join(__dirname, '.', 'kolam_data_numerical.txt');
const outputFile = path.join(__dirname, '..', 'src', 'data', 'kolamPatternsData.json');

function parseKolamData() {
	try {
		const content = fs.readFileSync(inputFile, 'utf8');
		const lines = content.split('\n');

		const patterns = [];
		let currentPattern = null;
		let currentPoints = [];

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i].trim();

			// Detect pattern start
			if (line.startsWith('--- Pattern')) {
				// Save previous pattern if exists
				if (currentPattern && currentPoints.length > 0) {
					patterns.push({
						id: currentPattern.id,
						points: [...currentPoints],
						numPoints: currentPoints.length
					});
				}

				// Start new pattern
				const patternMatch = line.match(/--- Pattern (\d+) ---/);
				if (patternMatch) {
					currentPattern = {
						id: parseInt(patternMatch[1])
					};
					currentPoints = [];
					console.log(`Processing Pattern ${currentPattern.id}...`);
				}
			}

			// Parse coordinate points
			else if (line.includes('Point') && line.includes('x=') && line.includes('y=')) {
				const coordMatch = line.match(/x=([-\d\.]+),\s*y=([-\d\.]+)/);
				if (coordMatch) {
					const x = parseFloat(coordMatch[1]);
					const y = parseFloat(coordMatch[2]);
					currentPoints.push({ x, y });
				}
			}
		}

		// Don't forget the last pattern
		if (currentPattern && currentPoints.length > 0) {
			patterns.push({
				id: currentPattern.id,
				points: [...currentPoints],
				numPoints: currentPoints.length
			});
		}

		console.log(`\nExtracted ${patterns.length} patterns:`);
		patterns.forEach(p => {
			console.log(`Pattern ${p.id}: ${p.numPoints} points`);
		});

		// Create the JSON structure
		const kolamData = {
			description: "Kolam curve patterns extracted",
			extractedAt: new Date().toISOString(),
			totalPatterns: patterns.length,
			patterns: patterns.map(pattern => ({
				id: pattern.id,
				points: pattern.points,
				// Determine connections based on pattern analysis
				hasDownConnection: determineDownConnection(pattern),
				hasRightConnection: determineRightConnection(pattern)
			}))
		};

		// Write to JSON file
		fs.writeFileSync(outputFile, JSON.stringify(kolamData, null, 2));
		console.log(`\n✅ Successfully wrote patterns to: ${outputFile}`);

		return kolamData;

	} catch (error) {
		console.error('Error parsing kolam data:', error);
		throw error;
	}
}

function determineDownConnection(pattern) {
	// Simple heuristic: if the pattern extends significantly in the Y direction
	const points = pattern.points;
	if (points.length === 0) return false;

	const minY = Math.min(...points.map(p => p.y));
	const maxY = Math.max(...points.map(p => p.y));
	const yRange = maxY - minY;

	// If Y range > 0.3 and ends with positive Y, likely has down connection
	return yRange > 0.3 && points[points.length - 1].y > 0.1;
}

function determineRightConnection(pattern) {
	// Simple heuristic: if the pattern extends significantly in the X direction
	const points = pattern.points;
	if (points.length === 0) return false;

	const minX = Math.min(...points.map(p => p.x));
	const maxX = Math.max(...points.map(p => p.x));
	const xRange = maxX - minX;

	// If X range > 0.3 and ends with positive X, likely has right connection
	return xRange > 0.3 && points[points.length - 1].x > 0.1;
}

// Export for use
if (require.main === module) {
	console.log('🔄 Converting kolam data to JSON...\n');
	parseKolamData();
} else {
	module.exports = { parseKolamData };
}
