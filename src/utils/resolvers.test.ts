import { describe, expect, it } from "vitest";
import { resolveFiringMortarData } from "./resolvers";

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
			coords: {
				start: "050 050",
				startZ: "100",
				end: "065 050",
				endZ: "50",
			},
			shell_type: "HE",
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
			coords: {
				start: "050 050",
				startZ: "100",
				end: "065 050",
				endZ: "50",
			},
			shell_type: "HE",
		});

		expect(rings).toBe(2);
		expect(distance).toBe(1500);
		expect(elevation).toBe(1031);
		expect(azimuth).toBe(1600);
		expect(timeOfFlight).toBe(22.3);
		expect(altitudeCorrection).toBe(22);
	});
});
