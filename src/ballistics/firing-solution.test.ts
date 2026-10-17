import { describe, expect, it } from "vitest";
import { resolveFiringMortarData } from "./firing-solution";

describe("resolveFiringMortarData", () => {
	it("resolves the firing mortar data correctly with 2B14", () => {
		const {
			rings,
			distance,
			elevation,
			azimuth,
			timeOfFlight,
			altitudeCorrection,
		} = resolveFiringMortarData({
			mortar: "2B14",
			origin: { grid: "050 050", altitude: "100" },
			target: { grid: "065 050", altitude: "50" },
			shellType: "HE",
		});

		expect(rings).toBe(3);
		expect(distance).toBe(1500);
		expect(elevation).toBe(1052);
		expect(azimuth).toBe(1500);
		expect(timeOfFlight).toBe(25.8);
		expect(altitudeCorrection).toBe(12);
	});

	it("resolves the firing mortar data correctly with M252", () => {
		const {
			rings,
			distance,
			elevation,
			azimuth,
			timeOfFlight,
			altitudeCorrection,
		} = resolveFiringMortarData({
			mortar: "M252",
			origin: { grid: "050 050", altitude: "100" },
			target: { grid: "065 050", altitude: "50" },
			shellType: "HE",
		});

		expect(rings).toBe(2);
		expect(distance).toBe(1500);
		expect(elevation).toBe(1031);
		expect(azimuth).toBe(1600);
		expect(timeOfFlight).toBe(22.3);
		expect(altitudeCorrection).toBe(22);
	});

	it("treats a non-numeric origin altitude as 0 instead of propagating NaN", () => {
		const { elevation, altitudeCorrection } = resolveFiringMortarData({
			mortar: "2B14",
			origin: { grid: "050 050", altitude: "undefined" },
			target: { grid: "065 050", altitude: "50" },
			shellType: "HE",
		});

		expect(altitudeCorrection).toBe(-12);
		expect(elevation).toBe(1028);
	});

	it("treats empty origin/target altitude as 0 altitude difference", () => {
		const { elevation, altitudeCorrection } = resolveFiringMortarData({
			mortar: "M252",
			origin: { grid: "050 050", altitude: "" },
			target: { grid: "065 050", altitude: "" },
			shellType: "HE",
		});

		expect(altitudeCorrection).toBe(0);
		expect(elevation).toBe(1009);
	});
});
