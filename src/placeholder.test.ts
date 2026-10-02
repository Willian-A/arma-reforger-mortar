import { describe, expect, it } from "vitest";

function soma(a: number, b: number) {
	return a + b;
}

describe("sanity check", () => {
	it("runs basic tests", () => {
		expect(true).toBe(true);
	});

	it("executes project code", () => {
		expect(soma(2, 3)).toBe(5);
	});

	it("supports async code", async () => {
		const valor = await Promise.resolve("ok");
		expect(valor).toBe("ok");
	});
});
