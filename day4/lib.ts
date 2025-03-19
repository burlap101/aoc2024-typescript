import { getLines } from "../utils";

/** Coordinate object definition */
export interface Coords {
	m: number;
	n: number;
}

interface DirectionError extends Error {}

interface DirectionErrorConstructor extends ErrorConstructor {
	new (message?: string): DirectionError;
	(message?: string): DirectionError;
	readonly prototype: DirectionError;
}

export let DirectionError: DirectionErrorConstructor;

export enum Direction {
	Up = 1,
	Down = 2,
	Left = 3,
	Right = 4,
	UpLeft = 5,
	UpRight = 6,
	DownLeft = 7,
	DownRight = 8,
}

/**
 * Contains all operations needed to solve the problem
 * @property lines loaded from input file
 * @property xLocs all locations that Xs are found
 */
export class XmasLocator {
	lines: string[];
	WORD = "XMAS";

	constructor(lines: string[]) {
		this.lines = lines;
	}

	/**
	 * Takes a line and returns an array of where all the xs are
	 * @param line line being inspected
	 * @returns Promise that will resolve with all locations x occurs
	 */
	async findLetters(lineNum: number, letter = this.WORD[0]): Promise<number[]> {
		return new Promise((resolve) => {
			const line = this.lines[lineNum];
			const locs: number[] = [];
			for (let i = 0; i < line.length; i++) {
				if (line[i] === letter) {
					locs.push(i);
				}
			}
			resolve(locs);
		});
	}

	/**
	 * Finds all Xs within the supplied input
	 * @param letter letter to be found
	 * @returns promis that will resolve with all coords for xs
	 */
	async searchForLetters(letter = this.WORD[0]): Promise<Coords[]> {
		const linePromises: Promise<number[]>[] = [];
		for (const i in this.lines) {
			const lineNum = Number.parseInt(i);
			linePromises.push(this.findLetters(lineNum, letter));
		}
		return new Promise((resolve) => {
			const result: Coords[] = [];
			Promise.all(linePromises).then((results) => {
				for (const i in results) {
					const m = Number.parseInt(i);
					for (const n of results[i]) {
						result.push({ m, n });
					}
				}
				resolve(result);
			});
		});
	}

	/**
	 * Determines if the X location contains an XMAS
	 * @param xloc coordinates of the X in the input
	 * @param direction direction of search
	 * @returns resolves to true if XMAS found else false
	 */
	async isXmas(xloc: Coords, direction: Direction): Promise<boolean> {
		return new Promise(
			(
				resolve: (b: boolean) => void,
				reject: (reason?: DirectionError) => void,
			) => {
				switch (direction) {
					case Direction.Up:
						for (let i = 1; i < this.WORD.length; i++) {
							if (
								this.lines[xloc.m - i] === undefined ||
								this.WORD[i] !== this.lines[xloc.m - i][xloc.n]
							) {
								resolve(false);
							}
						}
						resolve(true);
						break;
					case Direction.Down:
						for (let i = 1; i < this.WORD.length; i++) {
							if (
								this.lines[xloc.m + i] === undefined ||
								this.WORD[i] !== this.lines[xloc.m + i][xloc.n]
							) {
								resolve(false);
							}
						}
						resolve(true);
						break;
					case Direction.Left:
						for (let i = 1; i < this.WORD.length; i++) {
							if (
								this.lines[xloc.m] === undefined ||
								this.WORD[i] !== this.lines[xloc.m][xloc.n - i]
							) {
								resolve(false);
							}
						}
						resolve(true);
						break;
					case Direction.Right:
						for (let i = 1; i < this.WORD.length; i++) {
							if (
								this.lines[xloc.m] === undefined ||
								this.WORD[i] !== this.lines[xloc.m][xloc.n + i]
							) {
								resolve(false);
							}
						}
						resolve(true);
						break;
					case Direction.UpLeft:
						for (let i = 1; i < this.WORD.length; i++) {
							if (
								this.lines[xloc.m - i] === undefined ||
								this.WORD[i] !== this.lines[xloc.m - i][xloc.n - i]
							) {
								resolve(false);
							}
						}
						resolve(true);
						break;
					case Direction.UpRight:
						for (let i = 1; i < this.WORD.length; i++) {
							if (
								this.lines[xloc.m - i] === undefined ||
								this.WORD[i] !== this.lines[xloc.m - i][xloc.n + i]
							) {
								resolve(false);
							}
						}
						resolve(true);
						break;
					case Direction.DownLeft:
						for (let i = 1; i < this.WORD.length; i++) {
							if (
								this.lines[xloc.m + i] === undefined ||
								this.WORD[i] !== this.lines[xloc.m + i][xloc.n - i]
							) {
								resolve(false);
							}
						}
						resolve(true);
						break;
					case Direction.DownRight:
						for (let i = 1; i < this.WORD.length; i++) {
							if (
								this.lines[xloc.m + i] === undefined ||
								this.WORD[i] !== this.lines[xloc.m + i][xloc.n + i]
							) {
								resolve(false);
							}
						}
						resolve(true);
						break;
					default:
						reject(new Error("a direction not covered was passed in"));
						break;
				}
			},
		);
	}

	async occurrenceCount(): Promise<number> {
		let total = 0;
		const xlocs = await this.searchForLetters();
		const confirmPromises: Promise<boolean>[] = [];
		for (const loc of xlocs) {
			for (const k of Object.keys(Direction).filter(
				(v) => !Number.isNaN(Number.parseInt(v)),
			)) {
				const dir = Number.parseInt(k);
				confirmPromises.push(this.isXmas(loc, dir));
			}
		}
		const results = await Promise.all(confirmPromises);
		for (const r of results) {
			if (r) {
				total++;
			}
		}
		return total;
	}
}

export class MasXLocator extends XmasLocator {
	WORD = "MAS";
	async isMasX(aloc: Coords): Promise<boolean> {
		return new Promise((resolve) => {
			// Check each of the diagonal letters and count Ms and Ss
			let mCount = 0;
			let sCount = 0;
			// Resolve false if the A is located on an edge.
			if (aloc.m <= 0 || aloc.n <= 0) {
				resolve(false);
			}
			if (
				aloc.m >= this.lines.length - 1 ||
				aloc.n >= this.lines[0].length - 1
			) {
				resolve(false);
			}

			const allCoords: Coords[] = [
				{ m: aloc.m - 1, n: aloc.n - 1 },
				{ m: aloc.m - 1, n: aloc.n + 1 },
				{ m: aloc.m + 1, n: aloc.n + 1 },
				{ m: aloc.m + 1, n: aloc.n - 1 },
			];
			let diagLetters = "";
			for (const ac of allCoords) {
				diagLetters += this.lines[ac.m][ac.n];
			}
			// Count of Ms and Ss should be 2 each
			if (["MMSS", "SMMS", "SSMM", "MSSM"].includes(diagLetters)) {
				resolve(true);
			}
			resolve(false);
		});
	}

	async occurrenceCount(): Promise<number> {
		let total = 0;
		const alocs = await this.searchForLetters("A");
		const confirmPromises: Promise<boolean>[] = [];
		for (const loc of alocs) {
			confirmPromises.push(this.isMasX(loc));
		}
		const results = await Promise.all(confirmPromises);
		for (const r of results) {
			if (r) {
				total++;
			}
		}
		return total;
	}
}

export async function part1(filename: string): Promise<number> {
	const lines = getLines(filename);
	const xmasLocator = new XmasLocator(lines);
	return await xmasLocator.occurrenceCount();
}

export async function part2(filename: string): Promise<number> {
	const lines = getLines(filename);
	const masXLocator = new MasXLocator(lines);
	return await masXLocator.occurrenceCount();
}
