import { KolamEditor } from '@/components/KolamEditor';
import { Suspense } from 'react';

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
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
			
			<Suspense fallback={
				<div className="flex items-center justify-center min-h-screen">
					<div className="text-lg">Loading kolam editor...</div>
				</div>
			}>
				<KolamEditor />
			</Suspense>
		</div>
	);
}
