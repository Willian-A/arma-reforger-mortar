import { describe, expect, it } from "vitest";

import { calculateAzimuth, calculateDistance } from "./geometry";

describe("calculateDistance", () => {
	it("calculates distance between two points", () => {
		const result = calculateDistance({
			origin: { x: 100, y: 200 },
			target: { x: 300, y: 400 },
		});
		expect(result).toBeCloseTo(28284);
	});
});

describe("calculateAzimuth", () => {
	const origin = { x: 500, y: 500 };

	it.each([
		["norte", { x: 500, y: 600 }, 0],
		["leste", { x: 600, y: 500 }, 1600],
		["sul", { x: 500, y: 400 }, 3200],
		["oeste", { x: 400, y: 500 }, 4800],
	])(
		"calculates azimuth between two points with M252 mortar",
		(_, target, expected) => {
			expect(
				calculateAzimuth({ origin, target, mortar: "M252" }),
			).toBeCloseTo(expected);
		},
	);

	it.each([
		["norte", { x: 500, y: 600 }, 0],
		["leste", { x: 600, y: 500 }, 1500],
		["sul", { x: 500, y: 400 }, 3000],
		["oeste", { x: 400, y: 500 }, 4500],
	])(
		"calculates azimuth between two points with 2B14 mortar",
		(_, target, expected) => {
			expect(
				calculateAzimuth({ origin, target, mortar: "2B14" }),
			).toBeCloseTo(expected);
		},
	);
});
