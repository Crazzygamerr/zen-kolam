import { useSearchParams } from 'next/navigation';

export interface KolamURLParams {
	size: number;
	duration: number; // milliseconds for animation duration (UI only)
	background: string; // background color for API
	brush: string; // brush/stroke color for API
	initialAutoAnimate: boolean; // whether to auto-animate on initial load and generate
}

export const useKolamURLParams = (): KolamURLParams => {
	const searchParams = useSearchParams();

	return {
		size: Math.max(3, Math.min(15, parseInt(searchParams.get('size') || '7'))),
		duration: Math.max(1000, Math.min(30000, parseInt(searchParams.get('duration') || '10000'))),
		background: searchParams.get('background') || '#fef3c7',
		brush: searchParams.get('brush') || '#92400e',
		initialAutoAnimate: searchParams.get('initial-auto-animate') === 'true' // defaults to true unless explicitly set to false
	};
};

export const updateURL = (params: Partial<KolamURLParams>) => {
	if (typeof window === 'undefined') return;

	const url = new URL(window.location.href);
	const searchParams = url.searchParams;

	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null) {
			// Convert camelCase to kebab-case for URL parameters
			const urlKey = key === 'initialAutoAnimate' ? 'initial-auto-animate' : key;
			searchParams.set(urlKey, value.toString());
		}
	});

	window.history.replaceState({}, '', url.toString());
};

export const generateEmbedURL = (params: Partial<KolamURLParams>, baseURL?: string): string => {
	const base = baseURL || (typeof window !== 'undefined' ? window.location.origin : '');
	const url = new URL(`${base}/api/kolam`);

	// Set default values
	const defaults: KolamURLParams = {
		size: 7,
		duration: 10000, // Not used by API, but kept for interface consistency
		background: '#fef3c7',
		brush: '#92400e',
		initialAutoAnimate: false
	};

	const finalParams = { ...defaults, ...params };

	// Only add relevant parameters for the API
	url.searchParams.set('size', finalParams.size.toString());
	url.searchParams.set('background', finalParams.background);
	url.searchParams.set('brush', finalParams.brush);

	return url.toString();
};// Convert speed (1-10) to duration in milliseconds for backward compatibility
export const speedToDuration = (speed: number): number => {
	const minMs = 7500;
	const maxMs = 15000;
	const normalized = (speed - 1) / 9;
	const inverted = 1 - normalized;
	return Math.round(minMs + (maxMs - minMs) * inverted);
};

// Convert duration to speed for UI display
export const durationToSpeed = (duration: number): number => {
	const minMs = 7500;
	const maxMs = 15000;
	const inverted = (duration - minMs) / (maxMs - minMs);
	const normalized = 1 - inverted;
	return Math.round(1 + normalized * 9);
};