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

export function performChecks(
	ruler: OrderingRules,
): (fst: number, snd: number) => boolean {
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

export function checkTest(
	test: number[],
	checker: (fst: number, snd: number) => boolean,
): boolean {
	for (let i = 0; i < test.length; i++) {
		for (let j = i + 1; j < test.length; j++) {
			if (!checker(test[i], test[j])) {
				return false;
			}
		}
	}
	return true;
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

	let total = 0;
	for (const test of tests) {
		if (checkTest(test, checker)) {
			total += test[Math.floor(test.length / 2)];
		}
	}
	return total;
}
