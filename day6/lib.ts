import { getLines } from "../utils";
import { strict as assert } from "node:assert";

/**
 * Represents a position on the map
 * @property i row
 * @property j col
 */
interface Coordinate {
	i: number;
	j: number;
}

export enum Direction {
	Up = 1,
	Down = 2,
	Left = 3,
	Right = 4,
}

/**
 * Contains the map and internal operations
 * @property map the map
 * @prop _guardStartPoint cached value for the guard start point
 */
export class SituationMap {
	map: string[];
	private _guardStartPoint?: Coordinate;

	constructor(lines: string[]) {
		this.map = lines;
	}

	get guardStartPoint(): Coordinate {
		if (this._guardStartPoint !== undefined) {
			return this._guardStartPoint;
		}
		for (let i = 0; i < this.map.length; i++) {
			const line = this.map[i];
			for (let j = 0; j < line.length; j++) {
				if (line[j] === "^") {
					this._guardStartPoint = { i, j };
					return this._guardStartPoint;
				}
			}
		}
		// Gotta check for undefined situation
		if (this._guardStartPoint === undefined) {
			throw new Error("Guard start point should be defined");
		}

		// put this here to shutup a linting error
		return this._guardStartPoint;
	}
}

/**
 * Represents the guard
 * @property curPosition the current position of the guard
 * @property totalMoves the points visited by the guard
 * @prop direction the direction the guard is pointing
 * @prop smap situation map relating to the guard's path
 */
export class Guard {
	curPosition: Coordinate;
	totalMoves: number;
	direction: Direction;
	smap: SituationMap;
	visited: Record<string, true>;

	/**
	 * Initialise parameters for new object
	 * @param startPoint where the guard starts from
	 */
	constructor(map: SituationMap) {
		this.smap = map;
		const startPoint = map.guardStartPoint;
		this.curPosition = {
			i: startPoint.i,
			j: startPoint.j,
		};
		this.visited = {};
		this.addVisit(startPoint.i, startPoint.j);
		this.totalMoves = 1;
		this.direction = Direction.Up;
	}

	/**
	 * Move the guard to the next obstruction
	 */
	moveToObstruction() {
		switch (this.direction) {
			case Direction.Up: {
				const j = this.curPosition.j;
				for (let i = this.curPosition.i; i >= 0; i--) {
					if (this.smap.map[i][j] === "#") {
						this.curPosition = { i: i + 1, j };
						this.direction = Direction.Right;
						break;
					}
					this.addVisit(i, j);
					if (i === 0) {
						this.curPosition.i = 0;
						break;
					}
					this.totalMoves++;
				}
				break;
			}
			case Direction.Down: {
				const j = this.curPosition.j;
				for (let i = this.curPosition.i; i < this.smap.map.length; i++) {
					if (this.smap.map[i][j] === "#") {
						this.curPosition = { i: i - 1, j };
						this.direction = Direction.Left;
						break;
					}
					this.addVisit(i, j);
					if (i === this.smap.map.length - 1) {
						this.curPosition = { i, j };
						break;
					}
					this.totalMoves++;
				}
				break;
			}
			case Direction.Left: {
				const i = this.curPosition.i;
				for (let j = this.curPosition.j; j >= 0; j--) {
					if (this.smap.map[i][j] === "#") {
						this.curPosition = { i, j: j + 1 };
						this.direction = Direction.Up;
						break;
					}
					this.addVisit(i, j);
					if (j === 0) {
						this.curPosition.j = j;
						break;
					}
					this.totalMoves++;
				}
				break;
			}
			case Direction.Right: {
				const i = this.curPosition.i;
				for (let j = this.curPosition.j; j < this.smap.map[0].length; j++) {
					if (this.smap.map[i][j] === "#") {
						this.curPosition = { i, j: j - 1 };
						this.direction = Direction.Down;
						break;
					}
					this.addVisit(i, j);
					if (j === this.smap.map[0].length - 1) {
						this.curPosition.j = j;
						break;
					}
					this.totalMoves++;
				}
				break;
			}
			default:
				throw new Error(
					`Current direction not in those available got; ${this.direction}`,
				);
		}
		// if not at the edge then we reduce the count to avoid double
		// counting points
		if (!this.atEdge) {
			this.totalMoves--;
		}
	}

	get atEdge(): boolean {
		if ([0, this.smap.map.length - 1].includes(this.curPosition.i)) {
			return true;
		}
		if ([0, this.smap.map[0].length - 1].includes(this.curPosition.j)) {
			return true;
		}
		return false;
	}

	addVisit(i: number, j: number) {
		this.visited[`${i}|${j}`] = true;
	}

	get totalDistinctPoints(): number {
		return Object.keys(this.visited).length
	}
}

/**
 * Performs all necessary operations for part1
 * @param filename file containing original map
 * @returns total visited spots by the guard
 */
export function part1(filename: string): number {
	const lines = getLines(filename);
	const smap = new SituationMap(lines);
	const guard = new Guard(smap);

	while (!guard.atEdge) {
		guard.moveToObstruction();
	}

	return guard.totalDistinctPoints;
}
