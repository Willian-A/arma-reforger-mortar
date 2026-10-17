import { z } from "zod";

export const ShellTypeSchema = z.enum(
	["HE", "SMOKE", "ILLUMINATION", "PRACTICE"],
	"Shell type is required",
);

export const MortarModelSchema = z.enum(["M252", "2B14"], "Mortar is required");

export const FactionSchema = z.enum(["US", "USSR"]);

export const BallisticRowSchema = z.strictObject({
	rangeM: z.number().int().positive(),
	elevationMil: z.number().int().min(700).max(1600),
	timeOfFlightS: z.number().positive(),
	dElevPer100mDrop: z.number().int().positive().nullable(),
	verified: z.boolean(),
});

export const ChargeSchema = z.strictObject({
	charge: z.number().int().min(0),
	averageDispersionM: z.number().positive(),
	minRangeM: z.number().int().positive(),
	maxRangeM: z.number().int().positive(),
	rows: z.array(BallisticRowSchema).min(2),
});

export const ShellSchema = z.strictObject({
	id: z.string().regex(/^[a-z0-9-]+$/),
	name: z.string().min(1),
	type: ShellTypeSchema,
	charges: z.array(ChargeSchema).min(1),
});

export const MortarSchema = z.strictObject({
	id: z.string().regex(/^[a-z0-9-]+$/),
	name: z.string().min(1),
	faction: FactionSchema,
	caliberMm: z.number().positive(),
	azimuthMilsPerCircle: z.union([z.literal(6000), z.literal(6400)]),
	shells: z.array(ShellSchema).min(1),
});

export type ShellType = z.infer<typeof ShellTypeSchema>;
export type Faction = z.infer<typeof FactionSchema>;
export type BallisticRow = z.infer<typeof BallisticRowSchema>;
export type Charge = z.infer<typeof ChargeSchema>;
export type Shell = z.infer<typeof ShellSchema>;
export type Mortar = z.infer<typeof MortarSchema>;
export type MortarModel = z.infer<typeof MortarModelSchema>;
