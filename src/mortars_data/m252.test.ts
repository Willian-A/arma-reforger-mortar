import { describe, expect, it } from "vitest";
import data from "./m252.json";
import { MortarSchema, type Shell } from "./mortars.schema";

const mortar = MortarSchema.parse(data);

const expectedShells = [
	{ id: "m821", name: "M821 HE", type: "HE", charges: [0, 1, 2, 3, 4] },
	{ id: "m819", name: "M819 Smoke", type: "SMOKE", charges: [1, 2, 3, 4] },
	{
		id: "m853a1",
		name: "M853A1 Illumination",
		type: "ILLUMINATION",
		charges: [1, 2, 3, 4],
	},
	{
		id: "m879",
		name: "M879 Practice",
		type: "PRACTICE",
		charges: [0, 1, 2, 3, 4],
	},
] as const;

function getShell(id: string): Shell {
	const shell = mortar.shells.find((s) => s.id === id);
	if (!shell) throw new Error(`Munição ${id} não encontrada no JSON`);
	return shell;
}

describe("m252", () => {
	it("follows the schema", () => {
		expect(() => MortarSchema.parse(data)).not.toThrow();
	});

	it("has the basic information", () => {
		expect(mortar).toMatchObject({
			id: "m252",
			name: "M252",
			faction: "US",
			caliberMm: 81,
			azimuthMilsPerCircle: 6400,
		});
	});

	it("has exactly the expected shells", () => {
		expect(mortar.shells.map((s) => s.id)).toEqual(
			expectedShells.map((s) => s.id),
		);
	});

	describe.each(expectedShells)("$name", (expected) => {
		const shell = getShell(expected.id);

		it("has correct name and type", () => {
			expect(shell.name).toBe(expected.name);
			expect(shell.type).toBe(expected.type);
		});

		it("has the expected charges in order", () => {
			expect(shell.charges.map((c) => c.charge)).toEqual(expected.charges);
		});

		describe.each(shell.charges)("charge $charge", (charge) => {
			const { rows } = charge;

			it("minRangeM and maxRangeM match the first and last row", () => {
				expect(charge.minRangeM).toBe(rows[0].rangeM);
				expect(charge.maxRangeM).toBe(rows[rows.length - 1].rangeM);
			});

			it("distance increases and elevation decreases on each row", () => {
				for (let i = 1; i < rows.length; i++) {
					expect(rows[i].rangeM).toBeGreaterThan(rows[i - 1].rangeM);
					expect(rows[i].elevationMil).toBeLessThan(rows[i - 1].elevationMil);
				}
			});

			it("only the last row has altitude correction", () => {
				const last = rows[rows.length - 1];
				expect(last.dElevPer100mDrop).toBeNull();
				for (const row of rows.slice(0, -1)) {
					expect(row.dElevPer100mDrop).not.toBeNull();
				}
			});
		});
	});
});
