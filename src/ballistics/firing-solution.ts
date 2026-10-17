import { toast } from "@heroui/react";
import { parseGrid } from "../grid/parse-grid";
import _2B14 from "./data/2b14.json";
import M252 from "./data/m252.json";
import { calculateAzimuth, calculateDistance } from "./geometry";
import {
	type BallisticRow,
	type Charge,
	type Mortar,
	type MortarModel,
	mortarSchema,
	type ShellType,
} from "./mortar.schema";

type FiringSolutionInput = {
	mortar: MortarModel;
	origin: { grid: string; altitude: string };
	target: { grid: string; altitude: string };
	shellType: ShellType;
};

export type FiringSolution = {
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

function findCharge(
	mortarData: Mortar,
	shellType: ShellType,
	distance: number,
): Charge {
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

	return charge;
}

function lerp(a: number, b: number, t: number): number {
	return a + t * (b - a);
}

function interpolateBallisticRow(rows: BallisticRow[], distance: number) {
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

function calculateFiringSolution({
	mortar,
	origin,
	target,
	shellType,
}: FiringSolutionInput): FiringSolution {
	const mortarData = MORTARS[mortar];
	const originPoint = parseGrid(origin.grid);
	const targetPoint = parseGrid(target.grid);

	const distance = calculateDistance({
		origin: originPoint,
		target: targetPoint,
	});

	const selectedCharge = findCharge(mortarData, shellType, distance);
	const interpolatedRow = interpolateBallisticRow(
		selectedCharge.rows,
		distance,
	);
	const altitudeDiff =
		(Number(origin.altitude) || 0) - (Number(target.altitude) || 0); // positive = target is lower
	const altitudeCorrection =
		(altitudeDiff / 100) * (interpolatedRow.dElevPer100mDrop ?? 0);
	const elevation = interpolatedRow.elevationMil + altitudeCorrection;

	const azimuth = calculateAzimuth({
		origin: originPoint,
		target: targetPoint,
		milsPerCircle: mortarData.azimuthMilsPerCircle,
	});

	return {
		charge: selectedCharge.charge,
		distanceM: Math.round(distance),
		elevationMil: Math.round(elevation),
		azimuthMil: Math.round(azimuth),
		timeOfFlightS: Number(interpolatedRow.timeOfFlightS.toFixed(1)),
		altitudeCorrectionMil: Math.round(altitudeCorrection),
	};
}

export { calculateFiringSolution };
