import * as lib from "./lib";

describe("testing index.ts", () => {
	test("decodeLines - returns matrix of numbers from raw lines.", () => {
		const input = "1 2 3 10 8 9";
		const expected = [1, 2, 3, 10, 8, 9];
		expect(lib.decodeLine(input)).toStrictEqual(expected);
	});
	test("isSafe - returns true for increasing set.", () => {
		const input = [1, 2, 3, 6];
		expect(lib.isSafe(input)).toBe(true);
	});
	test("isSafe - returns true for decreasing set.", () => {
		const input = [10, 9, 6, 5];
		expect(lib.isSafe(input)).toBe(true);
	});
	test("isSafe - returns false for set with equal values.", () => {
		const input = [8, 6, 4, 4, 1];
		expect(lib.isSafe(input)).toBe(false);
	});
	test("isSafe - returns false for set with difference > 3.", () => {
		const input = [1, 2, 10, 11];
		expect(lib.isSafe(input)).toBe(false);
	});
	test("isSafe - returns false for set with increase and decrease.", () => {
		const input = [1, 3, 2, 4, 5];
		expect(lib.isSafe(input)).toBe(false);
	});
	test("isSafeWithDampener - returns true for set with decrease too big at start.", () => {
		const input = [10, 6, 5, 4];
		expect(lib.isSafeWithDampener(input)).toBe(true);
	});
	test("isSafeWithDampener - returns true for set with decrease too big at start then goes positive gradient.", () => {
		const input = [10, 1, 2, 3];
		expect(lib.isSafeWithDampener(input)).toBe(true);
	});
	test("isSafeWithDampener - returns true for set of two nums.", () => {
		const input = [1, 100];
		expect(lib.isSafeWithDampener(input)).toBe(true);
	});
	test("isSafeWithDampener - returns true for set with positive gradient then neg at end.", () => {
		const input = [10, 11, 12, 11];
		expect(lib.isSafeWithDampener(input)).toBe(true);
	});
	test("isSafeWithDampener - returns false for set with initial invalid value, positive gradient then neg at end.", () => {
		const input = [11, 10, 11, 12, 11];
		expect(lib.isSafeWithDampener(input)).toBe(false);
	});
	test("part1 - returns correct answer for test input.", () => {
		const filename = "day2/test.txt";
		expect(lib.part1(filename)).toBe(2);
	});
	test("part2 - returns correct answer for test input.", () => {
		const filename = "day2/test.txt";
		expect(lib.part2(filename)).toBe(4);
	});
});
