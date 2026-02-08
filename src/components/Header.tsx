import Link from 'next/link';

interface HeaderProps {
	title: string;
	subtitle?: string;
	showBackButton?: boolean;
	backButtonHref?: string;
	backButtonText?: string;
	className?: string;
}

export const Header: React.FC<HeaderProps> = ({
	title,
	subtitle,
	showBackButton = false,
	backButtonHref = '/',
	backButtonText = '← Back',
	className = ''
}) => {
	return (
		<header className={`p-6 text-white ${className}`} style={{ backgroundColor: '#5ba293' }}>
			<div className="max-w-6xl mx-auto">
				{showBackButton && (
					<div className="mb-4">
						<Link 
							href={backButtonHref}
							className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white/90 hover:text-white"
						>
							{backButtonText}
						</Link>
					</div>
				)}
				
				<h1 className="text-4xl font-bold text-center tracking-wide">
					{title}
				</h1>
				
				{subtitle && (
					<p className="text-center mt-2 text-lg opacity-90">
						{subtitle}
					</p>
				)}
			</div>
		</header>
	);
};
