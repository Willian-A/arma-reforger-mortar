import { describe, expect, it } from "vitest";
import { NoChargeError } from "./errors";
import { calculateFiringSolution } from "./firing-solution";

describe("calculateFiringSolution", () => {
	it("resolves the firing mortar data correctly with 2B14", () => {
		const {
			charge,
			distanceM,
			elevationMil,
			azimuthMil,
			timeOfFlightS,
			altitudeCorrectionMil,
		} = calculateFiringSolution({
			mortar: "2B14",
			origin: { grid: "050 050", altitude: "100" },
			target: { grid: "065 050", altitude: "50" },
			shellType: "HE",
		});

		expect(charge).toBe(3);
		expect(distanceM).toBe(1500);
		expect(elevationMil).toBe(1052);
		expect(azimuthMil).toBe(1500);
		expect(timeOfFlightS).toBe(25.8);
		expect(altitudeCorrectionMil).toBe(12);
	});

	it("resolves the firing mortar data correctly with M252", () => {
		const {
			charge,
			distanceM,
			elevationMil,
			azimuthMil,
			timeOfFlightS,
			altitudeCorrectionMil,
		} = calculateFiringSolution({
			mortar: "M252",
			origin: { grid: "050 050", altitude: "100" },
			target: { grid: "065 050", altitude: "50" },
			shellType: "HE",
		});

		expect(charge).toBe(2);
		expect(distanceM).toBe(1500);
		expect(elevationMil).toBe(1031);
		expect(azimuthMil).toBe(1600);
		expect(timeOfFlightS).toBe(22.3);
		expect(altitudeCorrectionMil).toBe(22);
	});

	it("treats a non-numeric origin altitude as 0 instead of propagating NaN", () => {
		const { elevationMil, altitudeCorrectionMil } = calculateFiringSolution({
			mortar: "2B14",
			origin: { grid: "050 050", altitude: "undefined" },
			target: { grid: "065 050", altitude: "50" },
			shellType: "HE",
		});

		expect(altitudeCorrectionMil).toBe(-12);
		expect(elevationMil).toBe(1028);
	});

	it("treats empty origin/target altitude as 0 altitude difference", () => {
		const { elevationMil, altitudeCorrectionMil } = calculateFiringSolution({
			mortar: "M252",
			origin: { grid: "050 050", altitude: "" },
			target: { grid: "065 050", altitude: "" },
			shellType: "HE",
		});

		expect(altitudeCorrectionMil).toBe(0);
		expect(elevationMil).toBe(1009);
	});

	it("throws NoChargeError when no charge covers the distance", () => {
		expect(() =>
			calculateFiringSolution({
				mortar: "M252",
				origin: { grid: "000 000", altitude: "" },
				target: { grid: "999 999", altitude: "" },
				shellType: "HE",
			}),
		).toThrow(NoChargeError);
	});
});
