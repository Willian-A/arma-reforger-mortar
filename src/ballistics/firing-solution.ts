import { toast } from "@heroui/react";
import { parseGrid } from "../grid/parse-grid";
import _2B14 from "./data/2b14.json";
import M252 from "./data/m252.json";
import { calculateAzimuthMils, calculateDistance } from "./geometry";
import {
	type BallisticRow,
	type Mortar,
	type MortarModel,
	mortarSchema,
	type ShellType,
} from "./mortar.schema";

type FiringMortarData = {
	mortar: MortarModel;
	origin: { grid: string; altitude: string };
	target: { grid: string; altitude: string };
	shellType: ShellType;
};

export type ResolvedFiringMortarData = {
	charge: number;
	distanceM: number;
	elevationMil: number;
	azimuthMil: number;
	timeOfFlightS: number;
	altitudeCorrectionMil: number;
};

const MORTARS = {
	M252: mortarSchema.parse(M252),
	"2B14": mortarSchema.parse(_2B14),
} satisfies Record<string, Mortar>;

function resolveShellCharges(
	mortarData: Mortar,
	shellType: ShellType,
	distance: number,
): [number, BallisticRow[]] {
	const shell = mortarData.shells.find((shell) => shell.type === shellType);
	if (!shell) throw new Error(`No mortar shell found for ${shellType}`);

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
	origin,
	target,
	shellType,
}: FiringMortarData): ResolvedFiringMortarData {
	const mortarData = MORTARS[mortar];
	const [originX, originY, originAltitude] = parseGrid(
		origin.grid,
		origin.altitude,
	);
	const [targetX, targetY, targetAltitude] = parseGrid(
		target.grid,
		target.altitude,
	);

	const distance = calculateDistance({
		origin: { x: Number(originX), y: Number(originY) },
		target: { x: Number(targetX), y: Number(targetY) },
	});

	const [charge, rows] = resolveShellCharges(mortarData, shellType, distance);
	if (!rows) {
		toast("Out of firing range", {
			description: `No charge reaches ${Math.round(distance)}m with ${shellType}`,
			variant: "warning",
			timeout: 5000,
		});
		throw new Error(
			`No charge reaches ${Math.round(distance)}m with ${shellType}`,
		);
	}

	const solution = interpolateRow(rows, distance);
	const altitudeDiff =
		(Number(originAltitude) || 0) - (Number(targetAltitude) || 0); // positive = target is lower
	const altitudeCorrection =
		(altitudeDiff / 100) * (solution.dElevPer100mDrop ?? 0);
	const elevation = solution.elevationMil + altitudeCorrection;

	const azimuth = calculateAzimuthMils({
		origin: { x: Number(originX), y: Number(originY) },
		target: { x: Number(targetX), y: Number(targetY) },
		mortar,
	});

	return {
		charge,
		distanceM: Math.round(distance),
		elevationMil: Math.round(elevation),
		azimuthMil: Math.round(azimuth),
		timeOfFlightS: Number(solution.timeOfFlightS.toFixed(1)),
		altitudeCorrectionMil: Math.round(altitudeCorrection),
	};
}

export { resolveFiringMortarData };
