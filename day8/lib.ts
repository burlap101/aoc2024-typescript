import { getLines } from "../utils";

export interface Point {
    i: number;
    j: number;
}

/**
 * Generate all combinations of elements for the supplied array
 */
export function* generatePairs<T>(arr: T[]): Generator<[T, T]> {
    if (arr.length === 2) {
        yield [arr[0], arr[1]];
        return;
    }
    for (const a of arr.slice(1)) {
        yield [arr[0], a];
    }
    for (const a of generatePairs(arr.slice(1))) {
        yield a;
    }
}

/**
 * Contains all operations and state related to the supplied map
 */
export class FrequencyMap {
    /**
     * original supplied map
     */
    readonly map: string[];
    /**
     * dictionary of frequencies and their locations
     */
    readonly frequencies: Record<string, Point[]>;

    /**
     * @param lines input lines from file
     */
    constructor(lines: string[]) {
        this.map = [...lines];
        this.frequencies = this.indexFrequencies();
    }

    /**
     * Populates the frequencies property
     */
    private indexFrequencies(): Record<string, Point[]> {
        const result: Record<string, Point[]> = {};
        for (const is in this.map) {
            for (const js in this.map[is].split("")) {
                const [i, j] = [is, js].map((v) => Number.parseInt(v));
                const ch = this.map[i][j];
                if (ch === ".") continue;
                if (result[ch] === undefined) {
                    result[ch] = [];
                }
                result[ch].push({ i, j });
            }
        }
        return result;
    }

    /**
     * Finds all frequency pairs on the map
     */
    private *findPairs(): Generator<[string, [Point, Point]]> {
        for (const freq in this.frequencies) {
            for (const pair of generatePairs(this.frequencies[freq])) {
                yield [freq, pair];
            }
        }
    }

    /**
     * Provides the locations of all the antinodes
     */
    *plotPoints(): Generator<Point[]> {
        for (const [_, [p1, p2]] of this.findPairs()) {
            const idiff = p2.i - p1.i;
            const jdiff = p2.j - p1.j;
            const candidates: [Point, Point] = [
                { i: p1.i + 2 * idiff, j: p1.j + 2 * jdiff },
                { i: p1.i - idiff, j: p1.j - jdiff },
            ];
            yield candidates.filter(({ i, j }) => {
                const iCheck = i < this.map.length && i >= 0;
                const jCheck = j < this.map[0].length && j >= 0;
                return iCheck && jCheck;
            });
        }
    }

    /**
     * Plots the resonant antinodes, including the original frequencies
     */
//    *plotResonants(): Generator<Point> {
//        const inBounds = ({ i, j }: Point): boolean => {
//            const iCheck = i < this.map.length && i >= 0;
//            const jCheck = j < this.map[0].length && j >= 0;
//            return iCheck && jCheck;
//        };
//        for (const [_, [p1, p2]] of this.findPairs()) {
//            const idiff = p2.i - p1.i;
//            const jdiff = p2.j - p1.j;
//            // Positive direction first
//            let candidate = { ...p1 };
//			let mul = 0
//            while (inBounds(candidate)) {
//                yield candidate;
//				mul++;
//                candidate = { i: p1.i + mul * idiff, j: p1.j + mul * jdiff };
//            }
//			// Now negative dirn
//            candidate = { ...p1 };
//			mul = 0;
//            while (inBounds(candidate)) {
//				mul++;
//                candidate = { i: p1.i - mul * idiff, j: p1.j - mul * jdiff };
//                yield candidate;
//            }
//        }
//    }

	*plotResonants(): Generator<Point> {
		const inBounds = ({ i, j }: Point): boolean => {
			const iCheck = i < this.map.length && i >= 0;
			const jCheck = j < this.map[0].length && j >= 0;
			return iCheck && jCheck;
		};

		for (const [_, [p1, p2]] of this.findPairs()) {
			const idiff = p2.i - p1.i;
			const jdiff = p2.j - p1.j;

			let candidate = { ...p1 };
			let mul = 1; // Start multiplier at 1

			// Positive direction
			while (true) {
				candidate = { i: p1.i + mul * idiff, j: p1.j + mul * jdiff };
				if (!inBounds(candidate)) break;
				yield candidate;
				mul++;
			}

			candidate = { ...p1 };
			mul = 1;

			// Negative direction
			while (true) {
				candidate = { i: p1.i - mul * idiff, j: p1.j - mul * jdiff };
				if (!inBounds(candidate)) break;
				yield candidate;
				mul++;
			}
		}
	}
}

/**
 * All operations necessary for part1
 * @param filename path to input file
 * @return count of antinodes
 */
export function part1(filename: string): number {
    const lines = getLines(filename);
    const fmap = new FrequencyMap(lines);
    const points = [...fmap.plotPoints()].flat();
    const pointsStrSet = new Set(points.map(({ i, j }) => `${i} ${j}`));
    return pointsStrSet.size;
}

/**
 * @param filename path to input file
 * @return count of antinodes
 */
export function part2(filename: string): number {
    const lines = getLines(filename);
    const fmap = new FrequencyMap(lines);
    const points = [...fmap.plotResonants()].flat();
    return new Set(points.map((v) => v.toString())).size;
}
