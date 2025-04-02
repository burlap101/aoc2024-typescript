import { getLines } from "../utils";

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
	temporaryObstacle?: Coordinate;
	private _guardStartPoint?: Coordinate;

	constructor(lines: string[]) {
		this.map = [...lines];
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

	/**
	 * Add an obstacle to the map
	 * @param i row
	 * @param j col
	 */
	addTemporaryObstacle({ i, j }: Coordinate) {
		const line = this.map[i];
		let newLine = line.slice(0, j);
		newLine += "#";
		newLine += line.slice(j + 1);
		this.map[i] = newLine;
		this.temporaryObstacle = { i, j };
	}

	/**
	 * Remove an obstacle from the map
	 * If temporary obstacle isn't set then doesn't do anything
	 */
	removeTemporaryObstacle(): void {
		if (this.temporaryObstacle === undefined) {
			return;
		}
		const { i, j } = this.temporaryObstacle;
		const line = this.map[i];
		let newLine = line.slice(0, j);
		newLine += ".";
		newLine += line.slice(j + 1);
		this.map[i] = newLine;
	}
}

/**
 * Represents the guard
 * @property curPosition the current position of the guard
 * @property totalMoves the points visited by the guard
 * @prop direction the direction the guard is pointing
 * @prop smap situation map relating to the guard's path
 * @prop visited set of all visited points
 */
export class Guard {
	curPosition: Coordinate;
	direction: Direction;
	smap: SituationMap;
	visited: Record<string, Direction[]>;
	firstObstacleHit?: {
		at: Coordinate;
		direction: Direction;
	};

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
					if (i === 0) {
						this.curPosition.i = 0;
						this.addVisit();
						break;
					}
					this.addVisit(i, j);
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
					if (i === this.smap.map.length - 1) {
						this.curPosition = { i, j };
						this.addVisit();
						break;
					}
					this.addVisit(i, j);
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
					if (j === 0) {
						this.curPosition.j = j;
						this.addVisit();
						break;
					}
					this.addVisit(i, j);
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
					if (j === this.smap.map[0].length - 1) {
						this.curPosition.j = j;
						this.addVisit();
						break;
					}
					this.addVisit(i, j);
				}
				break;
			}
			default:
				throw new Error(
					`Current direction not in those available got; ${this.direction}`,
				);
		}

		// Set the first obstacle hit object
		if (this.firstObstacleHit === undefined) {
			const { i, j } = this.curPosition;
			this.firstObstacleHit = {
				at: { i, j },
				direction: this.direction,
			};
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

	/**
	 * Converts Coordinate to a point string
	 * @param i row
	 * @param j columnp
	 * @returns point string
	 */
	static pointString({ i, j }: Coordinate) {
		return `${i}|${j}`;
	}

	addVisit(i?: number, j?: number) {
		const pointStr =
			i && j
				? Guard.pointString({ i, j })
				: Guard.pointString(this.curPosition);
		if (this.visited[pointStr] === undefined) {
			this.visited[pointStr] = [this.direction];
			return;
		}
		this.visited[pointStr].push(this.direction);
	}

	get totalDistinctPoints(): number {
		return Object.keys(this.visited).length;
	}

	/**
	 * Determines if a loop has been performed based on duplicate entries
	 * within a visited record value array.
	 */
	get performedLoop(): boolean {
		// cover the case of just starting
		if (Object.keys(this.visited).length <= 1) {
			return false;
		}
		if (this.atEdge) {
			return false;
		}
		for (const pointString in this.visited) {
			const visited = this.visited[pointString];
			if (new Set(visited).size !== visited?.length) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Takes a point string of form `i|j` and transforms it into a Coordinate
	 * @param visited point string
	 * @returns corresponding Coordinate object
	 */
	static toCoordinate(visited: string): Coordinate {
		const snums = visited.split("|", 2);
		return { i: Number.parseInt(snums[0]), j: Number.parseInt(snums[1]) };
	}

	resetPosition() {
		this.curPosition = this.smap.guardStartPoint;
		this.direction = Direction.Up;
		this.visited = {};
	}
}

export class Parter {
	smap: SituationMap;
	guard: Guard;
	private _filename: string

	constructor(filename: string) {
		this._filename = filename
		this.smap = new SituationMap(this.lines);
		this.guard = new Guard(this.smap);
	}

	get lines(): string[] {
		return getLines(this._filename);
	}

	/**
	 * Performs all necessary operations for part1
	 * @returns total visited distinct spots by the guard
	 */
	part1(): number {
		const guard = this.guard;
		guard.visited = {};
		guard.addVisit(guard.curPosition.i, guard.curPosition.j);
		while (!guard.atEdge) {
			guard.moveToObstruction();
		}
		return this.guard.totalDistinctPoints;
	}

	part2(): number {
		const originalGuard = this.guard;
		// Ensure part1 has been called already
		if (originalGuard.totalDistinctPoints <= 1) {
			this.part1();
		}
		let totalLoops = 0;

		for (const spoint in originalGuard.visited) {
			// Can't put obstacle on the start position
			if (spoint === Guard.pointString(this.smap.guardStartPoint)) {
				continue;
			}
			const newSmap = new SituationMap(this.lines);
			const guard = new Guard(newSmap);
			newSmap.addTemporaryObstacle(Guard.toCoordinate(spoint));
			while (true) {
				guard.moveToObstruction();
				if (guard.atEdge) {
					break;
				}
				if (guard.performedLoop) {
					totalLoops++;
					break;
				}
			}
			newSmap.removeTemporaryObstacle();
		}
		return totalLoops;
	}
}
