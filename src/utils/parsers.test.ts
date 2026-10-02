import { describe, expect, it } from "vitest";

import { centerCoords, gridToMeters, parseCoords } from "./parsers";

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
