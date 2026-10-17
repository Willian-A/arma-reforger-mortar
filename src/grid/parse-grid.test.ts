import { describe, expect, it } from "vitest";

import { parseGrid } from "./parse-grid";

describe("parseGrid", () => {
	it("split X and Y when separated by space", () => {
		expect(parseGrid("115 130")).toEqual({ x: 115, y: 130 });
	});

	it("split X and Y when they are together", () => {
		expect(parseGrid("115130")).toEqual({ x: 115, y: 130 });
	});

	it("parse leading zeros as numbers", () => {
		expect(parseGrid("050010")).toEqual({ x: 50, y: 10 });
	});

	it("ignore leading and trailing spaces", () => {
		expect(parseGrid("  115 130  ")).toEqual({ x: 115, y: 130 });
	});
});
