import { toast } from "@heroui/react";
import _2B14 from "../mortars_data/2b14.json";
import M252 from "../mortars_data/m252.json";
import {
	type BallisticRow,
	type GunType,
	type Mortar,
	MortarSchema,
	type ShellType,
} from "../mortars_data/mortars.schema";
import { calculateAzimuthMils, calculateDistance } from "./calculators";
import { parseCoords } from "./parsers";

type FiringMortarData = {
	mortar: GunType;
	coords: { start: string; startZ: string; end: string; endZ: string };
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
	if (!charge) {
		toast("No mortar shell found", {
			description: `No mortar shell charge for ${distance}m range`,
			variant: "warning",
			timeout: 5000,
		});
		throw new Error(`No mortar shell charge for ${distance}m range`);
	}

	return [charge.charge, charge.rows];
}

function lerp(a: number, b: number, t: number): number {
	return a + t * (b - a);
}

function interpolateRow(rows: BallisticRow[], distance: number) {
	const first = rows[0];
	const last = rows[rows.length - 1];

	if (distance < first.rangeM || distance > last.rangeM) {
		toast("Out of charge range", {
			description: "Distance out of range for this charge",
			variant: "warning",
			timeout: 5000,
		});
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
	coords,
	shell_type,
}: FiringMortarData): ResolvedFiringMortarData {
	const mortarData = MORTARS[mortar];
	const [startX, startY, startZ] = parseCoords(coords.start, coords.startZ);
	const [endX, endY, endZ] = parseCoords(coords.end, coords.endZ);

	const distance = calculateDistance({
		start: { x: Number(startX), y: Number(startY) },
		end: { x: Number(endX), y: Number(endY) },
	});

	const [rings, rows] = resolveShellCharges(mortarData, shell_type, distance);
	if (!rows) {
		toast("Out of firing range", {
			description: `No charge reaches ${Math.round(distance)}m with ${shell_type}`,
			variant: "warning",
			timeout: 5000,
		});
		throw new Error(
			`No charge reaches ${Math.round(distance)}m with ${shell_type}`,
		);
	}

	const solution = interpolateRow(rows, distance);
	const altitudeDiff = (Number(startZ) || 0) - (Number(endZ) || 0); // positive = target is lower
	const altitudeCorrection =
		(altitudeDiff / 100) * (solution.dElevPer100mDrop ?? 0);
	const elevation = solution.elevationMil + altitudeCorrection;

	const azimuth = calculateAzimuthMils({
		start: { x: Number(startX), y: Number(startY) },
		end: { x: Number(endX), y: Number(endY) },
		mortar,
	});

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
