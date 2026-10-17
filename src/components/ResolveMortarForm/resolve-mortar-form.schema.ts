import { z } from "zod";
import {
	MortarModelSchema,
	ShellTypeSchema,
} from "../../ballistics/mortar.schema";

const GRID_COORDS_REGEX = /^\d{3} \d{3}$/;
const ALTITUDE_REGEX = /^\d{0,4}$/;

export const mortarStepSchema = z.object({
	mortar: MortarModelSchema,
	shellType: ShellTypeSchema,
});

export const coordsStepSchema = z.object({
	start: z
		.string("Required field")
		.regex(GRID_COORDS_REGEX, "Use 6 digits, e.g. 052 097"),
	startAltitude: z
		.string()
		.regex(ALTITUDE_REGEX, "Use up to 4 digits")
		.optional(),
	end: z
		.string("Required field")
		.regex(GRID_COORDS_REGEX, "Use 6 digits, e.g. 052 097"),
	endAltitude: z
		.string()
		.regex(ALTITUDE_REGEX, "Altitude must be a number under 9999")
		.optional(),
});

export const resolveMortarFormSchema = mortarStepSchema.extend(
	coordsStepSchema.shape,
);

export type ResolveMortarFormData = z.infer<typeof resolveMortarFormSchema>;
