import { z } from "zod";

export const shellTypeSchema = z.enum(
	["HE", "SMOKE", "ILLUMINATION", "PRACTICE"],
	"Shell type is required",
);

export const mortarModelSchema = z.enum(["M252", "2B14"], "Mortar is required");

export const factionSchema = z.enum(["US", "USSR"]);

export const ballisticRowSchema = z.strictObject({
	rangeM: z.number().int().positive(),
	elevationMil: z.number().int().min(700).max(1600),
	timeOfFlightS: z.number().positive(),
	dElevPer100mDrop: z.number().int().positive().nullable(),
	verified: z.boolean(),
});

export const chargeSchema = z.strictObject({
	charge: z.number().int().min(0),
	averageDispersionM: z.number().positive(),
	minRangeM: z.number().int().positive(),
	maxRangeM: z.number().int().positive(),
	rows: z.array(ballisticRowSchema).min(2),
});

export const shellSchema = z.strictObject({
	id: z.string().regex(/^[a-z0-9-]+$/),
	name: z.string().min(1),
	type: shellTypeSchema,
	charges: z.array(chargeSchema).min(1),
});

export const mortarSchema = z.strictObject({
	id: z.string().regex(/^[a-z0-9-]+$/),
	name: z.string().min(1),
	faction: factionSchema,
	caliberMm: z.number().positive(),
	azimuthMilsPerCircle: z.union([z.literal(6000), z.literal(6400)]),
	shells: z.array(shellSchema).min(1),
});

export type ShellType = z.infer<typeof shellTypeSchema>;
export type Faction = z.infer<typeof factionSchema>;
export type BallisticRow = z.infer<typeof ballisticRowSchema>;
export type Charge = z.infer<typeof chargeSchema>;
export type Shell = z.infer<typeof shellSchema>;
export type Mortar = z.infer<typeof mortarSchema>;
export type MortarModel = z.infer<typeof mortarModelSchema>;
