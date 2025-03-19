import * as lib from "./lib";
import { getLines } from "../utils";

describe("Test XmasLocator class", () => {
	test("Test findXs - finds Xs in a line", () => {
		const input = "XXSSXXSS";
		const expected = [0, 1, 4, 5];
		const xl = new lib.XmasLocator([input]);
		let result: number[] = [];
		xl.findLetters(0).then((locs) => {
			result = locs;
			expect(result).toStrictEqual(expected);
		});
	});
	test("Test searchForXs - finds Xs across lines", () => {
		const input = ["XXSSXXSS", "XIIIIIII"];
		const expected = [
			{ m: 0, n: 0 },
			{ m: 0, n: 1 },
			{ m: 0, n: 4 },
			{ m: 0, n: 5 },
			{ m: 1, n: 0 },
		];
		const xl = new lib.XmasLocator(input);
		xl.searchForLetters().then((result) => {
			expect(result).toStrictEqual(expected);
		});
	});
	test("Test isXmas - for up direction valid", () => {
		const input = ["ARST", "STAR", "MVMV", "SSXS"];
		const xLoc = { m: 3, n: 2 };
		const xl = new lib.XmasLocator(input);
		xl.isXmas(xLoc, lib.Direction.Up).then((result) => {
			expect(result).toEqual(true);
		});
	});
	test("Test isXmas - for down direction valid", () => {
		const input = ["SSXS", "MVMV", "STAR", "ARST"];
		const xLoc = { m: 0, n: 2 };
		const xl = new lib.XmasLocator(input);
		xl.isXmas(xLoc, lib.Direction.Down).then((result) => {
			expect(result).toEqual(true);
		});
	});
	test("Test isXmas - for left direction valid", () => {
		const input = ["SSXS", "MVMV", "SAMX", "ARST"];
		const xLoc = { m: 2, n: 3 };
		const xl = new lib.XmasLocator(input);
		xl.isXmas(xLoc, lib.Direction.Left).then((result) => {
			expect(result).toEqual(true);
		});
	});
	test("Test isXmas - for right direction valid", () => {
		const input = ["SSXS", "MVMV", "XMAS", "ARST"];
		const xLoc = { m: 2, n: 0 };
		const xl = new lib.XmasLocator(input);
		xl.isXmas(xLoc, lib.Direction.Right).then((result) => {
			expect(result).toEqual(true);
		});
	});
	test("Test isXmas - for up left direction valid", () => {
		const input = ["SSXS", "MASV", "SAMS", "ARSX"];
		const xLoc = { m: 3, n: 3 };
		const xl = new lib.XmasLocator(input);
		xl.isXmas(xLoc, lib.Direction.UpLeft).then((result) => {
			expect(result).toEqual(true);
		});
	});
	test("Test isXmas - for up right direction valid", () => {
		const input = ["SSXS", "MAAV", "SMAS", "XASX"];
		const xLoc = { m: 3, n: 0 };
		const xl = new lib.XmasLocator(input);
		xl.isXmas(xLoc, lib.Direction.UpRight).then((result) => {
			expect(result).toEqual(true);
		});
	});
	test("Test isXmas - for up right direction valid", () => {
		const input = ["SSXS", "MAAV", "SMAS", "XASX"];
		const xLoc = { m: 3, n: 0 };
		const xl = new lib.XmasLocator(input);
		xl.isXmas(xLoc, lib.Direction.UpRight).then((result) => {
			expect(result).toEqual(true);
		});
	});
	test("Test isXmas - for down left direction valid", () => {
		const input = ["SSXX", "MAMV", "SAAS", "SASX"];
		const xLoc = { m: 0, n: 3 };
		const xl = new lib.XmasLocator(input);
		xl.isXmas(xLoc, lib.Direction.DownLeft).then((result) => {
			expect(result).toEqual(true);
		});
	});
	test("Test isXmas - for down right direction valid", () => {
		const input = ["XSXS", "AMAV", "SAAS", "VXXS"];
		const xLoc = { m: 0, n: 0 };
		const xl = new lib.XmasLocator(input);
		xl.isXmas(xLoc, lib.Direction.DownRight).then((result) => {
			expect(result).toEqual(true);
		});
	});
	test("Test part1 - returns expected result", async () => {
		expect(await lib.part1("day4/test.txt")).toEqual(18);
	});
	test("Test searchForXs - finds all Xs in the test input", async () => {
		const input = getLines("day4/test.txt");
		const xl = new lib.XmasLocator(input);
		const xlocs = await xl.searchForLetters();
		expect(xlocs.length).toBe(19);
	});
	test("Enum access works as expected", () => {
		const firstKey = Object.keys(lib.Direction)[0];
		expect(firstKey).toBe("1");
		const dir = lib.Direction[Number.parseInt(firstKey)];
		expect(dir).toBe("Up");
		expect(lib.Direction.Up === 1).toBe(true);
	});
});

describe("Test MasXLocator class", () => {
	test("Test findLetters - finds As in a line", () => {
		const input = "AASSAASS";
		const expected = [0, 1, 4, 5];
		const mxl = new lib.MasXLocator([input]);
		let result: number[] = [];
		mxl.findLetters(0, "A").then((locs) => {
			result = locs;
			expect(result).toStrictEqual(expected);
		});
	});
	test("Test searchForLetters - finds As across lines", () => {
		const input = ["AASSAASS", "AIIIIIII"];
		const expected = [
			{ m: 0, n: 0 },
			{ m: 0, n: 1 },
			{ m: 0, n: 4 },
			{ m: 0, n: 5 },
			{ m: 1, n: 0 },
		];
		const mxl = new lib.MasXLocator(input);
		mxl.searchForLetters("A").then((result) => {
			expect(result).toStrictEqual(expected);
		});
	});
	test("Test isMasX - finds a masx", async () => {
		interface TestCase {
			input: string[];
			expected: boolean;
			point: lib.Coords;
		}
		const tests: TestCase[] = [
			{
				input: ["AMAS", "VVAV", "VMVS"],
				expected: true,
				point: { m: 1, n: 2 },
			},
			{
				input: ["SSSSS", "AAAAA", "MMMMM"],
				expected: false,
				point: { m: 0, n: 1 },
			},
			{
				input: ["SSSSS", "AAAAA", "MMMMM"],
				expected: false,
				point: { m: 4, n: 1 },
			},
			{
				input: ["SSSSS", "AAAAA", "MMMMM"],
				expected: false,
				point: { m: 4, n: 1 },
			},
			{ 
				input: ["SSSSS", "AAAAA", "MMMMM"],
				expected: false,
				point: { m: 1, n: 0 },
			},
			{ 
				input: ["SSSSS", "AAAAA", "MMMMM"],
				expected: false,
				point: { m: 1, n: 4 },
			},
			{ 
				input: ["SSSSS", "AAAAA", "MMMMM"],
				expected: true,
				point: { m: 1, n: 1 },
			},
			{ 
				input: ["SSSSS", "AAAAA", "MMMMM"],
				expected: true,
				point: { m: 1, n: 2 },
			},
			{ 
				input: ["SSSSS", "AAAAA", "MMMMM"],
				expected: true,
				point: { m: 1, n: 3 },
			},
		];
		for (const tc of tests) {
			const mxl = new lib.MasXLocator(tc.input);
			const result = await mxl.isMasX(tc.point);
			expect(result).toBe(tc.expected);
		}
	});
	test("Test occurrenceCount - returns expected occurrence count", async () => {
		interface TestCase {
			input: string[];
			expected: number;
		}
		const tests: TestCase[] = [
			{
				input: ["SSSSS", "AAAAA", "MMMMM"],
				expected: 3,
			},
			{
				input: Array(5).fill("SAM"),
				expected: 3,
			},
			{ 
				input: Array(5).fill("MAS"),
				expected: 3,
			},
			{ 
				input: ["M".repeat(5), "A".repeat(5), "S".repeat(5)],
				expected: 3,
			}
		]
		for (const tc of tests) {
			const mxl = new lib.MasXLocator(tc.input);
			const result = await mxl.occurrenceCount();
			expect(result).toBe(tc.expected);
		}
	});
	test("Test part2 - returns expected number of masx occurrences for test input", async () => {
		const result = await lib.part2("day4/test.txt");
		expect(result).toBe(9);
	});
});
