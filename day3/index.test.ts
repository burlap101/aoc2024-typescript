import * as lib from "./lib";

describe("testing lib.ts", () => {
	test("Test breakDownLine - breaks down line", () => {
		const input = "mul(11,22)binrestmul(55,465)tstrrs";
		const result = lib.breakDownLine(input);
		const expected = [
			["mul(11,22)", "11", "22"],
			["mul(55,465)", "55", "465"],
		];
		const matched = [...result];
		for (let i = 0; i < Math.max(expected.length, matched.length); i++) {
			expect(matched[i].toString()).toEqual(expected[i].toString());
		}
	});
	test("Test totalLine - adds a line up correctly", () => {
		const input = "mul(1,2)binrestmul(5,6)tstrrs";
		const arr = lib.breakDownLine(input);
		const result = lib.totalLine(arr);
		expect(result).toEqual(32);
	});
	test("Test part1 - returns expected result", () => {
		const result = lib.part1("day3/test.txt");
		expect(result).toEqual(161);
	});
	test("Test breakDownLinePart2 - breaks down line", () => {
		const input = "mul(11,22)bindon't()restmul(55,465)tsdo()trrs";
		const expected = [
			["mul(11,22)", "11", "22"],
			["don't()", undefined, undefined],
			["mul(55,465)", "55", "465"],
			["do()", undefined, undefined],
		];
		const result = lib.breakDownLinePart2(input);
		const matched = [...result];
		for (let i = 0; i < Math.max(expected.length, matched.length); i++) {
			expect(matched[i].toString()).toEqual(expected[i].toString());
		}
	});
	test("Test totaLinePart2 - adds a line up correctly", () => {
		const input = "mul(1,2)bindon't()restmul(5,6)tstdo()rrsmul(4,7)arst";
		const arr = lib.breakDownLinePart2(input);
		const result = lib.totalLinePart2(arr, true);
		expect(result).toEqual([30, true]);
	});
	test("Test part2 - returns expected result for test input", () => {
		const result = lib.part2("day3/test2.txt");
		expect(result).toEqual(48);
	});
});
