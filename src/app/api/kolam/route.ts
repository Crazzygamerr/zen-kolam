import { KolamGenerator } from '@/utils/kolamGenerator';
import { generateKolamSVG } from '@/utils/svgGenerator';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);

		// Parse parameters with defaults
		const size = Math.max(3, Math.min(15, parseInt(searchParams.get('size') || '7')));
		const background = searchParams.get('background') || '#7b3306'; // amber-900
		const brush = searchParams.get('brush') || '#ffffff'; // white

		// Generate the kolam pattern
		const pattern = KolamGenerator.generateKolam1D(size);

		// Generate SVG using the utility function
		const svgContent = generateKolamSVG(pattern, {
			background,
			brush,
		});

		return new NextResponse(svgContent, {
			headers: {
				'Content-Type': 'image/svg+xml',
				'Cache-Control': 'public, max-age=3600',
			},
		});

	} catch (error) {
		console.error('Error generating kolam SVG:', error);
		return NextResponse.json(
			{ error: 'Failed to generate kolam pattern' },
			{ status: 500 }
		);
	}
}
