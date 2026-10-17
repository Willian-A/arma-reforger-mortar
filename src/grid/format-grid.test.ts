import { describe, expect, it } from "vitest";
import { formatGrid } from "./format-grid";

describe("formatGrid", () => {
	it("formating 6 digits with multiple spaces", () => {
		const result = formatGrid("  123  456");
		expect(result).toBe("123 456");
	});

	it("formating 6 digits without space", () => {
		const result = formatGrid("123456");
		expect(result).toBe("123 456");
	});

	it("formating 6 digits with middle space", () => {
		const result = formatGrid("123 456");
		expect(result).toBe("123 456");
	});
});
