import { describe, expect, it } from "vitest";
import { formatGridCoords } from "./format-grid";

describe("formatGridCoords", () => {
	it("formating 6 digits with multiple spaces", () => {
		const result = formatGridCoords("  123  456");
		expect(result).toBe("123 456");
	});

	it("formating 6 digits without space", () => {
		const result = formatGridCoords("123456");
		expect(result).toBe("123 456");
	});

	it("formating 6 digits with middle space", () => {
		const result = formatGridCoords("123 456");
		expect(result).toBe("123 456");
	});
});
