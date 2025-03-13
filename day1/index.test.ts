import * as index from "./index";
import { getLines } from "../utils";

describe("testing index.ts", () => {
	test("getLines - returns lines from file", () => {
		const expected = ["3   4", "4   3", "2   5", "1   3", "3   9", "3   3"];
		expect(getLines("day1/test.txt")).toStrictEqual(expected);
	});
	test("getArrays - returns arrays from lines", () => {
		const lExpected = [3, 4, 2, 1, 3, 3];
		const rExpected = [4, 3, 5, 3, 9, 3];
		const arr = getLines("day1/test.txt");
		const [left, right] = index.getArrays(arr);
		expect(left).toStrictEqual(lExpected);
		expect(right).toStrictEqual(rExpected);
	});
	test("part1 - returns total distance", () => {
		expect(index.part1("day1/test.txt")).toBe(11);
	});
	test("part2 - returns total score", () => {
		expect(index.part2("day1/test.txt")).toBe(31);
	});
});
