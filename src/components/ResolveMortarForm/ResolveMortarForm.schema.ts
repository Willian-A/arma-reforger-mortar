import { z } from "zod";
import {
	GunTypeSchema,
	ShellTypeSchema,
} from "../../mortars_data/mortars.schema";

const GRID_COORDS_REGEX = /^\d{3} \d{3}$/;
const ALTITUDE_REGEX = /^\d{0,4}$/;

export const weaponStepSchema = z.object({
	mortarGun: GunTypeSchema,
	shellType: ShellTypeSchema,
});

export const coordsStepSchema = z.object({
	start: z.string().regex(GRID_COORDS_REGEX, "Use 6 digits, e.g. 052 097"),
	startHeight: z
		.string()
		.regex(ALTITUDE_REGEX, "Use up to 4 digits")
		.optional(),
	end: z.string().regex(GRID_COORDS_REGEX, "Use 6 digits, e.g. 052 097"),
	endHeight: z
		.string()
		.regex(ALTITUDE_REGEX, "Altitude must be a number under 9999")
		.optional(),
});

export const resolveMortarFormSchema = weaponStepSchema.extend(
	coordsStepSchema.shape,
);

export type ResolveMortarFormData = z.infer<typeof resolveMortarFormSchema>;
