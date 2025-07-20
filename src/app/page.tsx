import { KolamEditor } from '@/components/KolamEditor';
import { Suspense } from 'react';

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
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
