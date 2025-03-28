import { getLines } from "../utils";

export class OrderingRules {
	rules: Record<number, number[]>;

	/**
	 * Transforms supplied lines into rules, adds them to object
	 * and returns it
	 * @param lines - optional text lines from input containing rules
	 * @returns initialised object
	 */
	constructor(lines?: string[]) {
		// Init rules
		this.rules = {};
		if (!lines) {
			return;
		}
		for (const line of lines) {
			const nums = line.split("|", 2);
			if (nums.length !== 2) {
				return;
			}
			this.addRule(Number.parseInt(nums[0]), Number.parseInt(nums[1]));
		}
	}

	/**
	 * Adds a rule to the object
	 * @param first the first number of the rule
	 * @param second the second number of the rule
	 */
	addRule(first: number, second: number) {
		if (this.rules[first] === undefined) {
			this.rules[first] = [second];
			return;
		}
		this.rules[first].push(second);
	}

	/**
	 * Performs a check to see if the ordering of the
	 * two supplied numbers fits within the rules
	 * @param first the first number in the check sequence
	 * @param second the second number in the check sequence
	 * @returns true if valid else false
	 */
	check(first: number, second: number): boolean {
		if (this.rules[first] === undefined) {
			return false;
		}
		return this.rules[first].includes(second);
	}
}

export type CheckerFn = (fst: number, snd: number) => boolean;

export function performChecks(ruler: OrderingRules): CheckerFn {
	const calls: Record<number, Record<number, boolean>> = {};
	return (fst: number, snd: number) => {
		if (calls[fst] !== undefined && calls[fst][snd] !== undefined) {
			return calls[fst][snd];
		}
		const result = ruler.check(fst, snd);
		if (calls[fst] === undefined) {
			calls[fst] = {};
		}
		calls[fst][snd] = result;
		return result;
	};
}

export function createTest(line: string): number[] {
	const result = [];
	const strNums = line.split(",");
	for (const sn of strNums) {
		result.push(Number.parseInt(sn));
	}
	return result;
}

/**
 * Takes a single test and determines if it matches rules
 * @param test array of numbers to test
 * @param checker instance of performChecks function
 * @return true if valid else false
 */
export function checkTest(test: number[], checker: CheckerFn): boolean {
	for (let i = 0; i < test.length; i++) {
		for (let j = i + 1; j < test.length; j++) {
			if (!checker(test[i], test[j])) {
				return false;
			}
		}
	}
	return true;
}

/**
 * Object for holding the values of each tests after being classified
 */
export interface ClassifiedTests {
	valid: number[][];
	invalid: number[][];
}

export function classifyTests(
	tests: number[][],
	checker: CheckerFn,
): ClassifiedTests {
	const result: ClassifiedTests = { valid: [], invalid: [] };
	for (const test of tests) {
		if (checkTest(test, checker)) {
			result.valid.push([...test]);
		} else {
			result.invalid.push([...test]);
		}
	}
	return result;
}

/**
 * Takes an invalid test and reworks it until it's valid
 * @param test invalid test candidate
 * @param checker checker function instance
 * @returns valid test
 */
export function reorderTest(test: number[], checker: CheckerFn): number[] {
	let result = [...test];
	for (let i = 0; i < result.length; i++) {
		for (let j = i + 1; j < result.length; j++) {
			if (!checker(result[i], result[j])) {
				const head = result.slice(0, i);
				const currJ = result.splice(j, 1);
				head.push(currJ[0]);
				result = head.concat(result.slice(i));
				i--;
				break;
			}
		}
	}
	return result;
}

export function part1(filename: string): number {
	const lines = getLines(filename);
	const ruler = new OrderingRules(lines);
	const checker = performChecks(ruler);

	const tests: number[][] = [];
	for (const line of lines) {
		if (line.includes(",")) {
			tests.push(createTest(line));
		}
	}

	const cts = classifyTests(tests, checker);
	let total = 0;
	for (const test of cts.valid) {
		total += test[Math.floor(test.length / 2)];
	}
	return total;
}

export function part2(filename: string): number {
	const lines = getLines(filename);
	const ruler = new OrderingRules(lines);
	const checker = performChecks(ruler);

	const tests: number[][] = [];
	for (const line of lines) {
		if (line.includes(",")) {
			tests.push(createTest(line));
		}
	}

	const cts = classifyTests(tests, checker);
	const reorderedTests: number[][] = [];

	for (const test of cts.invalid) {
		const valid = reorderTest(test, checker);
		reorderedTests.push(valid);
	}

	let total = 0;
	for (const test of reorderedTests) {
		total += test[Math.floor(test.length / 2)];
	}
	return total;
}
