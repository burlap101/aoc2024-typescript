import * as lib from "./lib";

describe("Test lib", () => {
	test("determineLegit - returns true when expected", () => {
		const inputs: lib.CalibrationEquation[] = [
			{
				testValue: 190,
				operands: [10, 19],
			},
			{
				testValue: 3267,
				operands: [81, 40, 27],
			},
			{
				testValue: 292,
				operands: [11, 6, 16, 20],
			},
			{
				testValue: 3606365,
				operands: [4, 491, 367, 385, 8, 92, 5, 1],
			}
		]
		for (const ce of inputs) {
			expect(lib.determineLegit(ce)).toBe(true);
		}
	});
	test("determineLegit - returns false when expected", () => {
		const inputs: lib.CalibrationEquation[] = [
			{
				testValue: 161011,
				operands: [16, 10, 13],
			},
			{
				testValue: 21037,
				operands: [9, 7, 18, 13],
			},
		]
		for (const ce of inputs) {
			expect(lib.determineLegit(ce)).toBe(false);
		}
	});
	test("parseLine - returns calibration equation", () => {
		const tests: [string, lib.CalibrationEquation][] = [
			["190: 10 19", {testValue: 190, operands: [10, 19]}],
			["3267: 81 40 27", {testValue: 3267, operands: [81, 40, 27]}]
		];
		for (const test of tests) {
			expect(lib.parseLine(test[0])).toEqual(test[1]);
		}
	});
	test("part1 - returns expected result for test input", () => {
		expect(lib.part1("day7/test.txt")).toBe(3749);
	});
});
