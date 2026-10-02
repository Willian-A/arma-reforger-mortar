import { describe, expect, it } from "vitest";

import {
	calculateAzimuthMils,
	calculateDistance,
	calculatePrecision,
	centerCoords,
	gridToMeters,
	parseCoords,
} from "./parsers";

describe("gridToMeters", () => {
	it("converts grid coordinates to meters", () => {
		const result = gridToMeters("005", "010");
		expect(result).toEqual(["500", "1000"]);
	});
});

describe("centerCoords", () => {
	it("converts grid coordinates to center meters", () => {
		const result = centerCoords("200", "300");
		expect(result).toEqual(["250", "350"]);
	});
});

describe("calculatePrecision", () => {
	it("calculates precision in meters based on grid size", () => {
		const result = calculatePrecision();
		expect(result).toEqual(71);
	});
});

describe("parseCoords", () => {
	it("split X and Y when separated by space", () => {
		expect(parseCoords("115 130")).toEqual(["115", "130"]);
	});

	it("split X and Y when they are together", () => {
		expect(parseCoords("115130")).toEqual(["115", "130"]);
	});

	it("keep leading zeros", () => {
		expect(parseCoords("050010")).toEqual(["050", "010"]);
	});

	it("ignore leading and trailing spaces", () => {
		expect(parseCoords("  115 130  ")).toEqual(["115", "130"]);
	});

	it("reject more than 6 digits", () => {
		expect(() => parseCoords("12345678")).toThrow("Invalid coords format");
	});

	it("reject less than 6 digits", () => {
		expect(() => parseCoords("05010")).toThrow("Invalid coords format");
	});

	it("reject non-numeric characters", () => {
		expect(() => parseCoords("abcdef")).toThrow("Invalid coords characters");
	});
});

describe("calculateDistance", () => {
	it("calculates distance between two points", () => {
		const result = calculateDistance({
			start: { x: "100", y: "200" },
			end: { x: "300", y: "400" },
		});
		expect(result).toBeCloseTo(282.84);
	});
});

describe("calculateAzimuthMils", () => {
	const origin = { x: "500", y: "500" };

	it.each([
		["norte", { x: "500", y: "600" }, 0],
		["leste", { x: "600", y: "500" }, 1600],
		["sul", { x: "500", y: "400" }, 3200],
		["oeste", { x: "400", y: "500" }, 4800],
	])(
		"calculates azimuth between two points with US faction",
		(_, end, expected) => {
			expect(
				calculateAzimuthMils({ start: origin, end, faction: "US" }),
			).toBeCloseTo(expected);
		},
	);

	it.each([
		["norte", { x: "500", y: "600" }, 0],
		["leste", { x: "600", y: "500" }, 1500],
		["sul", { x: "500", y: "400" }, 3000],
		["oeste", { x: "400", y: "500" }, 4500],
	])(
		"calculates azimuth between two points with URSS faction",
		(_, end, expected) => {
			expect(
				calculateAzimuthMils({ start: origin, end, faction: "URSS" }),
			).toBeCloseTo(expected);
		},
	);
});
