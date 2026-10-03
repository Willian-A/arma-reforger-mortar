import _2B14 from "../mortars_data/2b14.json";
import M252 from "../mortars_data/m252.json";
import {
	type BallisticRow,
	type Mortar,
	MortarSchema,
} from "../mortars_data/mortars.schema";
import { calculateAzimuthMils, calculateDistance } from "./calculators";

type ShellType = "HE" | "SMOKE" | "ILLUMINATION";
type MortarType = "2B14" | "M252";

type FiringMortarData = {
	mortar: MortarType;
	positions: {
		start: { x: number; y: number; z: number };
		end: { x: number; y: number; z: number };
	};
	shell_type: ShellType;
};

export type ResolvedFiringMortarData = {
	rings: number;
	distance: number;
	elevation: number;
	azimuth: number;
	timeOfFlight: number;
	altitudeCorrection: number;
};

const MORTARS = {
	M252: MortarSchema.parse(M252),
	"2B14": MortarSchema.parse(_2B14),
} satisfies Record<string, Mortar>;

function resolveShellCharges(
	mortarData: Mortar,
	shell_type: ShellType,
	distance: number,
): [number, BallisticRow[]] {
	const shell = mortarData.shells.find((shell) => shell.type === shell_type);
	if (!shell) throw new Error(`No mortar shell found for ${shell_type}`);

	const charge = shell.charges.find(
		(charge) => charge.minRangeM <= distance && distance <= charge.maxRangeM,
	);
	if (!charge) throw new Error(`No mortar shell charge for ${distance}m range`);

	return [charge.charge, charge.rows];
}

function lerp(a: number, b: number, t: number): number {
	return a + t * (b - a);
}

function interpolateRow(rows: BallisticRow[], distance: number) {
	const first = rows[0];
	const last = rows[rows.length - 1];

	if (distance < first.rangeM || distance > last.rangeM) {
		throw new Error("Distance out of range for this charge");
	}

	const nextIndex = rows.findIndex((row) => row.rangeM >= distance);
	const next = rows[nextIndex];

	if (next.rangeM === distance) {
		return { ...next, rangeM: distance };
	}

	const prev = rows[nextIndex - 1];
	const t = (distance - prev.rangeM) / (next.rangeM - prev.rangeM);

	return {
		rangeM: distance,
		elevationMil: lerp(prev.elevationMil, next.elevationMil, t),
		timeOfFlightS: lerp(prev.timeOfFlightS, next.timeOfFlightS, t),
		dElevPer100mDrop:
			next.dElevPer100mDrop === null
				? prev.dElevPer100mDrop
				: lerp(
						prev.dElevPer100mDrop ?? next.dElevPer100mDrop,
						next.dElevPer100mDrop,
						t,
					),
	};
}

function resolveFiringMortarData({
	mortar,
	positions,
	shell_type,
}: FiringMortarData): ResolvedFiringMortarData {
	const mortarData = MORTARS[mortar];
	const { start, end } = positions;

	const distance = calculateDistance({
		start: start,
		end: end,
	});

	const [rings, rows] = resolveShellCharges(mortarData, shell_type, distance);
	if (!rows) {
		throw new Error(
			`No charge reaches ${Math.round(distance)}m with ${shell_type}`,
		);
	}

	const solution = interpolateRow(rows, distance);

	const altitudeDiff = (start.z ?? 0) - (end.z ?? 0); // positive = target is lower
	const altitudeCorrection =
		(altitudeDiff / 100) * (solution.dElevPer100mDrop ?? 0);
	const elevation = solution.elevationMil + altitudeCorrection;

	const azimuth = calculateAzimuthMils({ start, end, mortar });

	return {
		rings,
		distance: Math.round(distance),
		elevation: Math.round(elevation),
		azimuth: Math.round(azimuth),
		timeOfFlight: Number(solution.timeOfFlightS.toFixed(1)),
		altitudeCorrection: Math.round(altitudeCorrection),
	};
}

export { resolveFiringMortarData };
