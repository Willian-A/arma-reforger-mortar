import { describe, expect, it } from "vitest";

import { calculateAzimuthMils, calculateDistance } from "./geometry";

describe("calculateDistance", () => {
	it("calculates distance between two points", () => {
		const result = calculateDistance({
			start: { x: 100, y: 200 },
			end: { x: 300, y: 400 },
		});
		expect(result).toBeCloseTo(28284);
	});
});

describe("calculateAzimuthMils", () => {
	const origin = { x: 500, y: 500 };

	it.each([
		["norte", { x: 500, y: 600 }, 0],
		["leste", { x: 600, y: 500 }, 1600],
		["sul", { x: 500, y: 400 }, 3200],
		["oeste", { x: 400, y: 500 }, 4800],
	])(
		"calculates azimuth between two points with M252 mortar",
		(_, end, expected) => {
			expect(
				calculateAzimuthMils({ start: origin, end, mortar: "M252" }),
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
		(_, end, expected) => {
			expect(
				calculateAzimuthMils({ start: origin, end, mortar: "2B14" }),
			).toBeCloseTo(expected);
		},
	);
});
