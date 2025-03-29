import * as lib from "./lib";
import { getLines } from "../utils";

const getTestLines = (): string[] => {
	return getLines("day6/test.txt");
};
const getTestSMap = (): lib.SituationMap => {
	const lines = getTestLines();
	return new lib.SituationMap(lines);
};

describe("Test SituationMap", () => {
	test("Test constructor - generates a map from lines", () => {
		const lines = getTestLines();
		const expected = [
			"....#.....",
			".........#",
			"..........",
			"..#.......",
			".......#..",
			"..........",
			".#..^.....",
			"........#.",
			"#.........",
			"......#...",
		];
		const smap = new lib.SituationMap(lines);

		expect(smap.map).toEqual(expected);
	});

	test("Test guardStartPoint - correct position returned", () => {
		const smap = getTestSMap();
		expect(smap.guardStartPoint).toEqual({ i: 6, j: 4 });
	});
});

describe("Test Guard", () => {
	const getTestGuard = (): lib.Guard => {
		const smap = getTestSMap();
		return new lib.Guard(smap);
	};
	test("Test constructor - initializes a guard correctly", () => {
		const guard = getTestGuard();
		expect(guard.curPosition).toEqual({ i: 6, j: 4 });
		expect(guard.direction).toBe(lib.Direction.Up);
		expect(guard.totalMoves).toBe(1);
	});
	test("Test moveToObstruction - moves guard to next obstacle", () => {
		const guard = getTestGuard();
		guard.moveToObstruction();
		expect(guard.curPosition).toEqual({ i: 1, j: 4 });
		expect(guard.direction).toBe(lib.Direction.Right);
		expect(guard.totalMoves).toBe(6);
	});
	test("Test moveToObstruction - when guard goes to edge count is correct", () => {
		const guard = getTestGuard();
		// move the guard to a column where it can reach the edge after move
		guard.curPosition.j++;
		guard.moveToObstruction();
		expect(guard.totalMoves).toBe(7);
	});
});

describe("Test lib module functions", () => {
	test("part1 - returns expected test result", () => {
		expect(lib.part1("day6/test.txt")).toBe(41);
	})
})
