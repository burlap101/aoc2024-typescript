import { getLines } from "../utils"

/**
 * Takes the array of strings and returns arrays of the numbers [left, right]
 * @param arr - lines to be split
 * @returns [number[], number[]] - the two arrays
 */
export function getArrays(arr: string[]): [number[], number[]] {
	const left = [];
	const right = [];
	for (const line of arr) {
		const splitted = line.split(/\s+/).map((el) => Number.parseInt(el.trim()));
		left.push(splitted[0]);
		right.push(splitted[1]);
	}
	return [left, right];
}

/**
 * Performs all operations required to answer part1
 * @param filename - name of the input file
 * @returns total distance
 */
export function part1(filename: string): number {
	const lines = getLines(filename);
	const [left, right] = getArrays(lines);
	left.sort();
	right.sort();
	let totalDistance = 0;
	for (let i = 0; i < left.length; i++) {
		totalDistance += Math.abs(left[i] - right[i]);
	}
	return totalDistance;
}

/**
 * Performs all operations required to answer part2
 * @param filename - name of the input file
 * @return answer
 */
export function part2(filename: string): number {
	const lines = getLines(filename);
	const [left, right] = getArrays(lines);
	let totalScore = 0;
	for (const id of left) {
		totalScore += id * right.filter((r) => r === id).length;
	}
	return totalScore;
}

console.log("Part1:", part1("day1/input.txt"));
console.log("Part2:", part2("day1/input.txt"));
