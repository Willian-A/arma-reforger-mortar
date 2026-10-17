import { describe, expect, it } from "vitest";

import { parseGrid } from "./parse-grid";

describe("parseGrid", () => {
	it("split X and Y when separated by space", () => {
		expect(parseGrid("115 130", "0")).toEqual(["115", "130", "0"]);
	});

	it("split X and Y when they are together", () => {
		expect(parseGrid("115130", "0")).toEqual(["115", "130", "0"]);
	});

	it("keep leading zeros", () => {
		expect(parseGrid("050010", "0")).toEqual(["050", "010", "0"]);
	});

	it("ignore leading and trailing spaces", () => {
		expect(parseGrid("  115 130  ", "0")).toEqual(["115", "130", "0"]);
	});

	it("reject more than 6 digits", () => {
		expect(() => parseGrid("12345678", "0")).toThrow("Invalid coords format");
	});

	it("reject less than 6 digits", () => {
		expect(() => parseGrid("05010", "0")).toThrow("Invalid coords format");
	});

	it("reject non-numeric characters", () => {
		expect(() => parseGrid("abcdef", "0")).toThrow(
			"Invalid coords characters",
		);
	});
});
