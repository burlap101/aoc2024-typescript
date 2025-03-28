import * as lib from "./lib";

describe("Test OrderingRules - tests the OrderingRules class", () => {
	test("Test addRule - adds a rule to rules as expected", () => {
		const orules = new lib.OrderingRules();
		orules.addRule(1, 4);
		orules.addRule(1, 5);
		orules.addRule(2, 6);
		const expected = { 
			1: [4, 5],
			2: [6],
		}
		expect(orules.rules).toEqual(expected);
	});
	test("Test constructor - creates ruleset in object when supplied string array", () => {
		const input = ["1 | 2", "1 | 3", "2 | 4"];
		const or = new lib.OrderingRules(input);
		const expected = {
			1: [2, 3],
			2: [4],
		};
		expect(or.rules).toEqual(expected);
	});
});

describe("Test functions - tests module functions", () => {
	test("Test part1 - ensure correct result for test input", () => {
		expect(lib.part1("day5/test.txt")).toBe(143);
	});
});
