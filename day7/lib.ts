import { getLines } from "../utils";

/**
 * Model of the input line
 * @prop testValue
 * @prop operands
 */
export interface CalibrationEquation {
    testValue: number;
    operands: number[];
}

/**
 * Parses line to produce calibration equation
 * @param line original line from file
 * @returns resulting calibration equation
 */
export function parseLine(line: string): CalibrationEquation {
    const colonSplit = line.split(":", 2);
    const testValue = Number.parseInt(colonSplit[0].trim());
    if (testValue >= Number.MAX_SAFE_INTEGER)
        throw new Error(`${colonSplit[0].trim()} exceeds max integer`);
    const operands = colonSplit[1]
        .split(" ")
        .map((snum) => {
            return Number.parseInt(snum.trim());
        })
        .filter((v) => !Number.isNaN(v));
    return { testValue, operands };
}

/**
 * Produces an initialised function to determine if a solution is valid
 * @param ce input calibration equation
 * @returns whether its legit
 */
export function determineLegit(ce: CalibrationEquation): boolean {
    /**
     * Recursive function performing the check
     * @param acc total running accumulated value
     * @param vals remaining operands to check
     * @returns whether the Calibration Equation meets the requirements
     */
    const findMatch = (acc: number, vals: number[]) => {
        // The ultimate goal
        if (vals.length === 0 && acc === ce.testValue) return true;

        // If we've gone over the test value or no more operands, bail out
        if (acc > ce.testValue || vals.length === 0) return false;

        // attempt to add
        if (findMatch(acc + vals[0], [...vals.slice(1)])) return true;

        // try out multiplication
        if (findMatch(acc * vals[0], [...vals.slice(1)])) return true;

        // give up
        return false;
    };
    return findMatch(ce.operands[0], [...ce.operands.slice(1)]);
}

export function part1(filename: string): number {
    return getLines(filename)
        .map(parseLine)
        .filter(determineLegit)
        .reduceRight((acc, ce) => acc + ce.testValue, 0);
}
