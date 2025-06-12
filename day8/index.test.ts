import { getLines } from "../utils";
import * as lib from "./lib";

describe("day8 functions - test all module level functions", () => {
    test("generatePairs - generates pair combos for an array", () => {
        const input = [5, 6, 7, 8];
        const expected = [
            [5, 6],
            [5, 7],
            [5, 8],
            [6, 7],
            [6, 8],
            [7, 8],
        ];
        const actualGen = lib.generatePairs(input);
        const actualSer: string[] = [];
        for (const a of actualGen) {
            expect(expected).toContainEqual(a);
            actualSer.push(a.join());
        }
        expect(expected.filter((v) => !actualSer.includes(v.join()))).toEqual(
            [],
        );
    });
    test("part1 - works as outlined in example", () => {
        expect(lib.part1("day8/test.txt")).toBe(14);
    });
//	test("part2 - works as outlined in example", () => {
//		expect(lib.part2("day8/test.txt")).toBe(34);
//	});
});

describe("FrequencyMap", () => {
    test("constructor - new instance of frequency map constructed as expected", () => {
        const input = ["...a", ".b..", "..b.", ".a.."];
        const expectedFrequencies = {
            a: [
                [0, 3],
                [3, 1],
            ].map(([i, j]): lib.Point => {
                return { i, j };
            }),
            b: [
                [1, 1],
                [2, 2],
            ].map(([i, j]) => {
                return { i, j };
            }),
        };
        const fmap = new lib.FrequencyMap(input);
        expect(fmap.map).toEqual(input);
        expect(fmap.frequencies).toEqual(expectedFrequencies);
    });
    test("plotPoints - plots all points in expected locations", () => {
        const solnInput = [
            "......#....#",
            "...#....0...",
            "....#0....#.",
            "..#....0....",
            "....0....#..",
            ".#....A.....",
            "...#........",
            "#......#....",
            "........A...",
            ".........A..",
            "..........#.",
            "..........#.",
        ];
		const input = getLines("day8/test.txt");
        const solnFmap = new lib.FrequencyMap(solnInput);
		const cmp = (p1: lib.Point, p2: lib.Point) => {
			const nums = [p1, p2].map(({i, j}) => Number.parseInt(`${i}${j}`));
			return nums[0] - nums[1];
		}
        const expectedLocations = [
            ...solnFmap.frequencies["#"],
            { i: 5, j: 6 },
        ].sort(cmp);
		expect(expectedLocations.length).toBe(14);
		const fmap = new lib.FrequencyMap(input);
		
		let actual = [...fmap.plotPoints()].flat().sort(cmp)
		const actualStrSet = new Set(actual.map(({i, j}) => [i, j].join(" ")))
		actual = [...actualStrSet].map((str): lib.Point => {
			const nums = str.split(" ").map((n) => Number.parseInt(n))
			return {i: nums[0], j: nums[1]}
		})
			
		expect(actual).toEqual(expectedLocations);
    });
	test("plotResonants - plots all points expected", () => {
		const input = [
			"....",
			".a..",
			"..a.",
			"....",
		];
		const expected_locations = [
			{i: 0, j: 0},
			{i: 1, j: 1},
			{i: 2, j: 2},
			{i: 3, j: 3},
		]

		const fmap = new lib.FrequencyMap(input);
		for (let i = 0; i < expected_locations.length; i++) {
			const gen = fmap.plotResonants()
			const {done, value: loc} = gen.next()
			console.log(loc);
			expect(expected_locations).toContainEqual(loc);
			if (i === expected_locations.length) expect(done).toBe(true);
		}
	});
});
