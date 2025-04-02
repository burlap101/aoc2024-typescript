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

	const smapWithObstacle = () => {
		const smap = getTestSMap();
		smap.addTemporaryObstacle({ i: 5, j: 4 });
		return smap;
	};
	test("Test addObstacle - adds obstacle to map in correct position", () => {
		const smap = smapWithObstacle();
		const expected = [
			"....#.....",
			".........#",
			"..........",
			"..#.......",
			".......#..",
			"....#.....",
			".#..^.....",
			"........#.",
			"#.........",
			"......#...",
		];
		expect(smap.map).toEqual(expected);
	});
	test("Test removeObstacle - removes obstacle from map in correct position", () => {
		const smap = smapWithObstacle();
		smap.removeTemporaryObstacle();
		expect(smap.map[5][4]).toBe(".");
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
	});
	test("Test moveToObstruction - moves guard to next obstacle", () => {
		const guard = getTestGuard();
		guard.moveToObstruction();
		expect(guard.curPosition).toEqual({ i: 1, j: 4 });
		expect(guard.direction).toBe(lib.Direction.Right);
		expect(guard.totalDistinctPoints).toBe(6);
	});
	test("Test moveToObstruction - when guard goes to edge count is correct", () => {
		const guard = getTestGuard();
		// move the guard to a column where it can reach the edge after move
		guard.visited = {};
		guard.curPosition.j++;
		guard.addVisit(guard.curPosition.i, guard.curPosition.j);
		guard.moveToObstruction();
		expect(guard.totalDistinctPoints).toBe(7);
	});
	test("Test moveToObstruction - when guard starts infront of a obstruction", () => {
		const guard = getTestGuard();
		guard.visited = {};
		guard.curPosition = { i: 5, j: 7 };
		guard.addVisit(guard.curPosition.i, guard.curPosition.j);
		guard.moveToObstruction();
		expect(guard.totalDistinctPoints).toBe(1);
		expect(guard.direction).toBe(lib.Direction.Right);
	});
	test("Test pointString - produces expected string representation of a point", () => {
		expect(lib.Guard.pointString({ i: 6464, j: 777 })).toBe("6464|777");
	});
	test("Test visitedKeyToCoordinate - produces coordinate from point string", () => {
		expect(lib.Guard.toCoordinate("6464|777")).toEqual({
			i: 6464,
			j: 777,
		});
	});
	test("Test performedLoop - detects a loop has been performed", () => {
		const guard = getTestGuard();
		guard.smap.addTemporaryObstacle({ i: 6, j: 3 });
		expect(guard.performedLoop).toBe(false);
		for (let iter = 0; iter <= 4; iter++) {
			guard.moveToObstruction();
		}
		expect(guard.performedLoop).toBe(true);
	});
	test("Test performedLoop - doesn't return true for the known obstruction", () => {
		const tests = [
			{
				obstacle: { i: 1, j: 4 },
				expectedPositions: [
					{ i: 2, j: 4 },
					{ i: 2, j: 9 },
				],
			},
			{
				obstacle: {i: 3, j: 4},
				expectedPositions: [
					{i: 4, j: 4},
					{i: 4, j: 6},
					{i: 8, j: 6},
					{i: 8, j: 1},
					{i: 7, j: 1},
					{i: 7, j: 7},
					{i: 9, j: 7},
				]
			}
		];
		for (const tc of tests) {
			const guard = getTestGuard();
			guard.smap.addTemporaryObstacle(tc.obstacle);
			let brokenByPerformedLoop = false;
			let iterations = 0;
			while (true) {
				const expectedPosition = tc.expectedPositions[iterations];
				iterations++;
				guard.moveToObstruction();
				expect(guard.curPosition).toEqual(expectedPosition);
				expect(guard.performedLoop).toBe(false);
				if (guard.atEdge) break;
				if (guard.performedLoop) {
					brokenByPerformedLoop = true;
					break;
				}
			}
			expect(iterations).toBe(tc.expectedPositions.length);
			expect(brokenByPerformedLoop).toBe(false);
		}
	});
});

describe("Test Parter", () => {
	const parter = new lib.Parter("day6/test.txt");
	test("part1 - returns expected test result", () => {
		expect(parter.part1()).toBe(41);
	});
	test("part2 - return expected test result", () => {
		expect(parter.part2()).toBe(6);
	});
});
