import { getLines } from "../utils";

/**
 * Breaksdown a line into its mul components
 * @param line input line
 * @returns all matches in the form ["mul(x,y)", "x", "y"]
 */
export function breakDownLine(
	line: string,
): RegExpStringIterator<RegExpExecArray> {
	const regex = /mul\((\d+),(\d+)\)/g;
	const matchArray = line.matchAll(regex);
	return matchArray;
}

/**
 * Breaksdown a line according to part2 requirements
 * @param line input line
 * @returns all matches in the form ["mul(x,y), "x", "y"] or ["do()"] or ["don't()"]
 */
export function breakDownLinePart2(
	line: string,
): RegExpStringIterator<RegExpExecArray> {
	const regex = /mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g;
	const matchArray = line.matchAll(regex);
	return matchArray;
}

/**
 * Calculates the total sum of muls for a single line
 * @param lineIter Iterator representing all muls encountered on a line input
 * @returns total sum
 */
export function totalLine(
	lineIter: RegExpStringIterator<RegExpExecArray>,
): number {
	let result = 0;
	for (const mul of lineIter) {
		result += Number.parseInt(mul[1]) * Number.parseInt(mul[2]);
	}
	return result;
}

/**
 * Calculates the total sum of muls for a single line according to part2
 * @param lineIter iterator with all muls, dos and don'ts on a line input
 * @returns [totalsum, finishedEnabled]
 */
export function totalLinePart2(
	lineIter: RegExpStringIterator<RegExpExecArray>,
	startEnabled: boolean
): [number, boolean] {
	let result = 0;
	let enabled = startEnabled;
	for (const exp of lineIter) {
		if (exp[0].startsWith("mul") && enabled) {
			result += Number.parseInt(exp[1]) * Number.parseInt(exp[2]);
		} else if (exp[0].startsWith("don")) {
			enabled = false;
		} else if (exp[0].startsWith("do(")) {
			enabled = true;
		}
	}
	return [result, enabled];
}

/**
 * Performs all operations necessary for part1
 * @param filename containing input
 * @returns total result
 */
export function part1(filename: string) {
	const lines = getLines(filename);
	let total = 0;
	for (const line of lines) {
		const arr = breakDownLine(line);
		total += totalLine(arr);
	}
	return total;
}

export function part2(filename: string) {
	const lines = getLines(filename);
	let total = 0;
	let enabled = true;
	for (const line of lines) {
		const arr = breakDownLinePart2(line);
		const [result, isEnabled] = totalLinePart2(arr, enabled);
		enabled = isEnabled;
		total += result
	}
	return total;
}
