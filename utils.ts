import fs from "node:fs";

/**
 * Retrieves lines of a given file
 * @param filename - name of file
 * @returns string[]
 */
export function getLines(filename: string): string[] {
	let lines: string[] = [];
	const data = fs.readFileSync(filename, "utf8");
	lines = data.split("\n").filter((s) => s.length > 0);
	return lines;
}

