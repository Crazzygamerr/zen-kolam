// Kolam generator for traditional South Indian geometric patterns
import { KOLAM_CURVE_PATTERNS } from '@/data/kolamPatterns';
import { CurvePoint, Dot, KolamPattern, Line } from '@/types/kolam';

export class KolamGenerator {
	private static readonly CELL_SPACING = 60;

	// Core constants for kolam generation
	// pt_dn=[0 1 0 0 0 1 0 0 1 0 1 1 1 0 1 1];
	private static readonly pt_dn = [0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1];

	// pt_rt=[0 0 1 0 0 1 1 0 0 1 0 1 1 1 0 1];
	private static readonly pt_rt = [0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1];

	// mate_pt_dn{1}=[2 3 5 6 9 10 12];
	// mate_pt_dn{2}=setdiff(2:16,mate_pt_dn{1});
	private static readonly mate_pt_dn = {
		1: [2, 3, 5, 6, 9, 10, 12],
		2: [4, 7, 8, 11, 13, 14, 15, 16]  // setdiff(2:16, mate_pt_dn{1})
	};

	// mate_pt_rt{1}=[2 3 4 6 7 11 13];
	// mate_pt_rt{2}=setdiff(2:16,mate_pt_rt{1});
	private static readonly mate_pt_rt = {
		1: [2, 3, 4, 6, 7, 11, 13],
		2: [5, 8, 9, 10, 12, 14, 15, 16]  // setdiff(2:16, mate_pt_rt{1})
	};

	// h_inv=[1 2 5 4 3 9 8 7 6 10 11 12 15 14 13 16];
	private static readonly h_inv = [1, 2, 5, 4, 3, 9, 8, 7, 6, 10, 11, 12, 15, 14, 13, 16];

	// v_inv=[1 4 3 2 5 7 6 9 8 10 11 14 13 12 15 16];
	private static readonly v_inv = [1, 4, 3, 2, 5, 7, 6, 9, 8, 10, 11, 14, 13, 12, 15, 16];

	// h_self=find(h_inv==1:16);
	private static readonly h_self = this.findSelfInverse(this.h_inv);

	// v_self=find(v_inv==1:16);
	private static readonly v_self = this.findSelfInverse(this.v_inv);

	/**
	 * Find self-inverse elements: find(h_inv==1:16)
	 */
	private static findSelfInverse(inv: number[]): number[] {
		const result: number[] = [];
		for (let i = 0; i < inv.length; i++) {
			if (inv[i] === i + 1) {  // 1-indexed array handling
				result.push(i + 1);
			}
		}
		return result;
	}

	/**
	 * Array intersection function
	 */
	private static intersect(arr1: number[], arr2: number[]): number[] {
		return arr1.filter(x => arr2.includes(x));
	}

	/**
	 * Random array element selector
	 */
	private static randomChoice(arr: number[]): number {
		if (arr.length === 0) return 1;  // Default fallback
		return arr[Math.floor(Math.random() * arr.length)];
	}

	/**
	 * Create matrix filled with ones: ones(size)
	 */
	private static ones(size: number): number[][] {
		const matrix: number[][] = [];
		for (let i = 0; i < size; i++) {
			matrix[i] = new Array(size).fill(1);
		}
		return matrix;
	}

	/**
	 * Literal translation of propose_kolam1D.m
	 */
	static proposeKolam1D(size_of_kolam: number): number[][] {
		// odd = (mod(size_of_kolam,2)~=0);
		const odd = (size_of_kolam % 2) !== 0;

		// if odd
		//     hp=fix((size_of_kolam-1)/2);
		// else
		//     hp=size_of_kolam/2;
		// end
		let hp: number;
		if (odd) {
			hp = Math.floor((size_of_kolam - 1) / 2);
		} else {
			hp = size_of_kolam / 2;
		}

		// Mat=ones(hp+1);
		const Mat = this.ones(hp + 2);  // Need hp+2 for the algorithm

		// for i=2:hp+1
		//     for j=2:hp+1
		for (let i = 1; i <= hp; i++) {  // Grid iteration
			for (let j = 1; j <= hp; j++) {  // Grid iteration
				// Valid_by_Up=mate_pt_dn{pt_dn(Mat(i-1,j))+1};
				const ptDnValue = this.pt_dn[Mat[i - 1][j] - 1];  // Convert to 0-indexed
				const Valid_by_Up = this.mate_pt_dn[ptDnValue + 1 as keyof typeof this.mate_pt_dn];

				// Valid_by_Lt=mate_pt_rt{pt_rt(Mat(i,j-1))+1};
				const ptRtValue = this.pt_rt[Mat[i][j - 1] - 1];  // Convert to 0-indexed
				const Valid_by_Lt = this.mate_pt_rt[ptRtValue + 1 as keyof typeof this.mate_pt_rt];

				// Valids=intersect(Valid_by_Up,Valid_by_Lt);
				const Valids = this.intersect(Valid_by_Up, Valid_by_Lt);

				// try
				//     V=Valids(ceil(rand*length(Valids)));
				//     Mat(i,j)=V;
				// catch
				//     Mat(i,j)=1;
				// end
				try {
					const V = this.randomChoice(Valids);
					Mat[i][j] = V;
				} catch {
					Mat[i][j] = 1;
				}
			}
		}

		// Mat(hp+2,1)=1;
		// Mat(1,hp+2)=1;
		Mat[hp + 1][0] = 1;  // Convert to 0-indexed
		Mat[0][hp + 1] = 1;  // Convert to 0-indexed

		// for j=2:hp+1
		for (let j = 1; j <= hp; j++) {  // Grid column iteration
			// Valid_by_Up=mate_pt_dn{pt_dn(Mat(hp+1,j))+1};
			const ptDnValue = this.pt_dn[Mat[hp][j] - 1];  // Convert to 0-indexed
			const Valid_by_Up = this.mate_pt_dn[ptDnValue + 1 as keyof typeof this.mate_pt_dn];

			// Valid_by_Lt=mate_pt_rt{pt_rt(Mat(hp+2,j-1))+1};
			const ptRtValue = this.pt_rt[Mat[hp + 1][j - 1] - 1];  // Convert to 0-indexed
			const Valid_by_Lt = this.mate_pt_rt[ptRtValue + 1 as keyof typeof this.mate_pt_rt];

			// Valids=intersect(Valid_by_Up,Valid_by_Lt);
			let Valids = this.intersect(Valid_by_Up, Valid_by_Lt);

			// Valids=intersect(Valids,v_self);
			Valids = this.intersect(Valids, this.v_self);

			// try
			//     V=Valids(ceil(rand*length(Valids)));
			//     Mat(hp+2,j)=V;
			// catch
			//     Mat(hp+2,j)=1;
			// end
			try {
				const V = this.randomChoice(Valids);
				Mat[hp + 1][j] = V;
			} catch {
				Mat[hp + 1][j] = 1;
			}
		}

		// for i=2:hp+1
		for (let i = 1; i <= hp; i++) {
			// Valid_by_Up=mate_pt_dn{pt_dn(Mat(i-1,hp+2))+1};
			const ptDnValue = this.pt_dn[Mat[i - 1][hp + 1] - 1];  // Convert to 0-indexed
			const Valid_by_Up = this.mate_pt_dn[ptDnValue + 1 as keyof typeof this.mate_pt_dn];

			// Valid_by_Lt=mate_pt_rt{pt_rt(Mat(i,hp+1))+1};
			const ptRtValue = this.pt_rt[Mat[i][hp] - 1];  // Convert to 0-indexed
			const Valid_by_Lt = this.mate_pt_rt[ptRtValue + 1 as keyof typeof this.mate_pt_rt];

			// Valids=intersect(Valid_by_Up,Valid_by_Lt);
			let Valids = this.intersect(Valid_by_Up, Valid_by_Lt);

			// Valids=intersect(Valids,h_self);
			Valids = this.intersect(Valids, this.h_self);

			// try
			//     V=Valids(ceil(rand*length(Valids)));
			//     Mat(i,hp+2)=V;
			// catch
			//     Mat(i,hp+2)=1;
			// end
			try {
				const V = this.randomChoice(Valids);
				Mat[i][hp + 1] = V;
			} catch {
				Mat[i][hp + 1] = 1;
			}
		}

		// Valid_by_Up=mate_pt_dn{pt_dn(Mat(hp+1,hp+2))+1};
		const ptDnValue = this.pt_dn[Mat[hp][hp + 1] - 1];  // Convert to 0-indexed
		const Valid_by_Up = this.mate_pt_dn[ptDnValue + 1 as keyof typeof this.mate_pt_dn];

		// Valid_by_Lt=mate_pt_rt{pt_rt(Mat(hp+2,hp+1))+1};
		const ptRtValue = this.pt_rt[Mat[hp + 1][hp] - 1];  // Convert to 0-indexed
		const Valid_by_Lt = this.mate_pt_rt[ptRtValue + 1 as keyof typeof this.mate_pt_rt];

		// Valids=intersect(Valid_by_Up,Valid_by_Lt);
		let Valids = this.intersect(Valid_by_Up, Valid_by_Lt);

		// Valids=intersect(Valids,h_self);
		Valids = this.intersect(Valids, this.h_self);

		// Valids=intersect(Valids,v_self);
		Valids = this.intersect(Valids, this.v_self);

		// try
		//     V=Valids(ceil(rand*length(Valids)));
		//     Mat(hp+2,hp+2)=V;
		// catch
		//     Mat(hp+2,hp+2)=1;
		// end
		try {
			const V = this.randomChoice(Valids);
			Mat[hp + 1][hp + 1] = V;
		} catch {
			Mat[hp + 1][hp + 1] = 1;
		}

		// Mat1=Mat(2:hp+1,2:hp+1);
		const Mat1: number[][] = [];
		for (let i = 1; i <= hp; i++) {
			Mat1[i - 1] = [];
			for (let j = 1; j <= hp; j++) {
				Mat1[i - 1][j - 1] = Mat[i][j];
			}
		}

		// Mat3=v_inv(Mat1(end:-1:1,:));
		const Mat3: number[][] = [];
		for (let i = hp - 1; i >= 0; i--) {
			Mat3[hp - 1 - i] = [];
			for (let j = 0; j < hp; j++) {
				Mat3[hp - 1 - i][j] = this.v_inv[Mat1[i][j] - 1];  // v_inv and convert to 0-indexed
			}
		}

		// Mat2=h_inv(Mat1(:,end:-1:1));
		const Mat2: number[][] = [];
		for (let i = 0; i < hp; i++) {
			Mat2[i] = [];
			for (let j = hp - 1; j >= 0; j--) {
				Mat2[i][hp - 1 - j] = this.h_inv[Mat1[i][j] - 1];  // h_inv and convert to 0-indexed
			}
		}

		// Mat4=v_inv(Mat2(end:-1:1,:));
		const Mat4: number[][] = [];
		for (let i = hp - 1; i >= 0; i--) {
			Mat4[hp - 1 - i] = [];
			for (let j = 0; j < hp; j++) {
				Mat4[hp - 1 - i][j] = this.v_inv[Mat2[i][j] - 1];  // v_inv and convert to 0-indexed
			}
		}

		// Final assembly based on odd/even
		let M: number[][];
		if (odd) {
			// M=[Mat1 Mat(2:end-1,end) Mat2;
			//     Mat(end,2:end) h_inv(Mat(end,(end-1):-1:2));
			//     Mat3 v_inv(Mat((end-1):-1:2,end))' Mat4];
			const size = 2 * hp + 1;
			M = Array(size).fill(null).map(() => Array(size).fill(1));

			// Copy Mat1
			for (let i = 0; i < hp; i++) {
				for (let j = 0; j < hp; j++) {
					M[i][j] = Mat1[i][j];
				}
			}

			// Mat(2:end-1,end) -> column vector from Mat
			for (let i = 1; i < hp + 1; i++) {
				M[i - 1][hp] = Mat[i][hp + 1];
			}

			// Copy Mat2
			for (let i = 0; i < hp; i++) {
				for (let j = 0; j < hp; j++) {
					M[i][hp + 1 + j] = Mat2[i][j];
				}
			}

			// Mat(end,2:end) -> row vector from Mat
			for (let j = 1; j < hp + 2; j++) {
				M[hp][j - 1] = Mat[hp + 1][j];
			}

			// h_inv(Mat(end,(end-1):-1:2)) -> transformed row vector
			for (let j = hp; j >= 1; j--) {
				M[hp][hp + (hp - j + 1)] = this.h_inv[Mat[hp + 1][j] - 1];
			}

			// Copy Mat3
			for (let i = 0; i < hp; i++) {
				for (let j = 0; j < hp; j++) {
					M[hp + 1 + i][j] = Mat3[i][j];
				}
			}

			// v_inv(Mat((end-1):-1:2,end))' -> transformed column vector
			for (let i = hp; i >= 1; i--) {
				M[hp + (hp - i + 1)][hp] = this.v_inv[Mat[i][hp + 1] - 1];
			}

			// Copy Mat4
			for (let i = 0; i < hp; i++) {
				for (let j = 0; j < hp; j++) {
					M[hp + 1 + i][hp + 1 + j] = Mat4[i][j];
				}
			}
		} else {
			// M=[Mat1 Mat2;Mat3 Mat4];
			const size = 2 * hp;
			M = Array(size).fill(null).map(() => Array(size).fill(1));

			// Copy Mat1
			for (let i = 0; i < hp; i++) {
				for (let j = 0; j < hp; j++) {
					M[i][j] = Mat1[i][j];
				}
			}

			// Copy Mat2
			for (let i = 0; i < hp; i++) {
				for (let j = 0; j < hp; j++) {
					M[i][hp + j] = Mat2[i][j];
				}
			}

			// Copy Mat3
			for (let i = 0; i < hp; i++) {
				for (let j = 0; j < hp; j++) {
					M[hp + i][j] = Mat3[i][j];
				}
			}

			// Copy Mat4
			for (let i = 0; i < hp; i++) {
				for (let j = 0; j < hp; j++) {
					M[hp + i][hp + j] = Mat4[i][j];
				}
			}
		}

		return M;
	}

	/**
	 * Literal translation of draw_kolam.m coordinate conversion
	 */
	static drawKolam(M: number[][]): KolamPattern {
		// [m n]=size(M);
		const m = M.length;
		const n = M[0].length;

		// M=M(end:-1:1,:); - flip vertically
		const flippedM: number[][] = [];
		for (let i = m - 1; i >= 0; i--) {
			flippedM[m - 1 - i] = [...M[i]];
		}

		const dots: Dot[] = [];
		const curves: Line[] = [];

		// for i=1:m
		//     for j=1:n
		for (let i = 0; i < m; i++) {
			for (let j = 0; j < n; j++) {
				// if M(i,j)>0
				if (flippedM[i][j] > 0) {
					// Add dot at grid position
					// plot(j,i,[clr '.']) - dot at grid position
					dots.push({
						id: `dot-${i}-${j}`,
						center: {
							x: (j + 1) * this.CELL_SPACING,
							y: (i + 1) * this.CELL_SPACING
						},
						radius: 3,
						color: '#ffffff',
						filled: true
					});

					// this=pt{M(i,j)};
					// plot(j+real(this),i+imag(this),clr,'Linewidth',1.5)
					const patternIndex = flippedM[i][j] - 1;  // Convert to 0-indexed
					if (patternIndex >= 0 && patternIndex < KOLAM_CURVE_PATTERNS.length) {
						const pattern = KOLAM_CURVE_PATTERNS[patternIndex];

						// Convert pattern coordinates: j+real(this), i+imag(this)
						// Create a single curve with all points (keep curve grouped)
						const curvePoints: CurvePoint[] = pattern.points.map(point => ({
							x: ((j + 1) + point.x) * this.CELL_SPACING,  // j+real(this)
							y: ((i + 1) + point.y) * this.CELL_SPACING,  // i+imag(this)
							controlX: point.controlX !== undefined ?
								((j + 1) + point.controlX) * this.CELL_SPACING : undefined,
							controlY: point.controlY !== undefined ?
								((i + 1) + point.controlY) * this.CELL_SPACING : undefined
						}));

						curves.push({
							id: `curve-${i}-${j}`,
							start: curvePoints[0],
							end: curvePoints[curvePoints.length - 1],
							curvePoints: curvePoints,
							strokeWidth: 1.5,
							color: '#ffffff'
						});
					}
				}
			}
		}

		// Create the grid structure
		const grid = {
			size: Math.max(m, n),
			cells: Array(m).fill(null).map((_, i) =>
				Array(n).fill(null).map((_, j) => ({
					row: i,
					col: j,
					patternId: flippedM[i][j],
					dotCenter: {
						x: (j + 1) * this.CELL_SPACING,
						y: (i + 1) * this.CELL_SPACING
					}
				}))
			),
			cellSpacing: this.CELL_SPACING
		};

		return {
			id: `kolam-${m}x${n}`,
			name: `Kolam ${m}×${n}`,
			grid,
			curves,
			dots,
			symmetryType: '1D',
			dimensions: {
				width: (n + 1) * this.CELL_SPACING,
				height: (m + 1) * this.CELL_SPACING
			},
			created: new Date(),
			modified: new Date()
		};
	}

	/**
	 * Main entry point - generate kolam pattern using algorithm
	 */
	static generateKolam1D(size: number): KolamPattern {
		console.log(`🎨 Generating 1D Kolam of size ${size}`);

		const matrix = this.proposeKolam1D(size);
		console.log(`📊 Generated matrix: ${matrix.length}x${matrix[0].length}`);

		// Convert to visual kolam pattern using draw_kolam logic
		const pattern = this.drawKolam(matrix);
		console.log(`✅ Created kolam with ${pattern.dots.length} dots and ${pattern.curves.length} curves`);

		return pattern;
	}
}
