import { getLines } from "../utils";

const MAXDIFF = 3;
/**
 * Takes lines of file and returns matrix of numbers
 * @param line - raw string line from input file
 * @returns matrix of numbers
 * */
export function decodeLine(line: string): number[] {
	const mLine: number[] = [];
	for (const num of line.split(" ")) {
		mLine.push(Number.parseInt(num));
	}
	return mLine;
}

/**
 * Determines if two numbers in a row are valid
 * @param first - first number in series
 * @param second - second number in series
 * @param pos - whether gradient is positive for the set
 * @returns validity
 * */
function isValid(first: number, second: number, pos: boolean) {
	if (pos && first >= second) {
		return false;
	}
	if (!pos && first <= second) {
		return false;
	}
	if (Math.abs(first - second) > MAXDIFF) {
		return false;
	}
	return true;
}

/**
 * Takes a decoded line and determines if it's safe
 * @param vector - numbers input
 * @returns safe if true else unsafe
 */
export function isSafe(vector: number[]): boolean {
	const isPositiveGradient = vector[0] < vector[1];
	for (let i = 0; i < vector.length - 1; i++) {
		if (!isValid(vector[i], vector[i + 1], isPositiveGradient)) {
			return false;
		}
	}
	return true;
}

/**
 * Takes a decoded line and determines if it's safe with dampener added
 * @param vector - numbers input
 * @returns safe if true else unsafe
 * */
export function isSafeWithDampener(vector: number[]): boolean {
	// for special case of 2 numbers or less
	if (vector.length <= 2) {
		return true;
	}
	const gradient: boolean = vector[0] < vector[1];
	for (let i = 0; i < vector.length - 1; i++) {
		if (!isValid(vector[i], vector[i + 1], gradient)) {
			for (let j = 0; j < vector.length; j++) {
				const newVect = [...vector];
				newVect.splice(j, 1);
				if (isSafe(newVect)) {
					return true;
				}
			}
			return false;
		}
	}
	return true;
}

/**
 * Performs all operations necessary for part1
 * @param filename - path to file for input
 * @returns no. of lines deemed safe
 */
export function part1(filename: string): number {
	const lines = getLines(filename);
	let safeCount = 0;
	for (const l of lines) {
		const decoded = decodeLine(l);
		if (isSafe(decoded)) {
			safeCount++;
		}
	}
	return safeCount;
}

/**
 * Performs all operations necessary for part2
 * @param filename - path to file for input
 * @returns no. of lines deemed safe.
 */
export function part2(filename: string): number {
	const lines = getLines(filename);
	let safeCount = 0;
	for (const l of lines) {
		const decoded = decodeLine(l);
		if (isSafeWithDampener(decoded)) {
			safeCount++;
		}
	}
	return safeCount++;
}
