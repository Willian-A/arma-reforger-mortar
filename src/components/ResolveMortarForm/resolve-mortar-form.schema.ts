import { z } from "zod";
import {
	MortarModelSchema,
	ShellTypeSchema,
} from "../../ballistics/mortar.schema";

const GRID_REGEX = /^\d{3} \d{3}$/;
const ALTITUDE_REGEX = /^\d{0,4}$/;

export const mortarStepSchema = z.object({
	mortar: MortarModelSchema,
	shellType: ShellTypeSchema,
});

export const positionsStepSchema = z.object({
	origin: z
		.string("Required field")
		.regex(GRID_REGEX, "Use 6 digits, e.g. 052 097"),
	originAltitude: z
		.string()
		.regex(ALTITUDE_REGEX, "Use up to 4 digits")
		.optional(),
	target: z
		.string("Required field")
		.regex(GRID_REGEX, "Use 6 digits, e.g. 052 097"),
	targetAltitude: z
		.string()
		.regex(ALTITUDE_REGEX, "Altitude must be a number under 9999")
		.optional(),
});

export const resolveMortarFormSchema = mortarStepSchema.extend(
	positionsStepSchema.shape,
);

export type ResolveMortarFormData = z.infer<typeof resolveMortarFormSchema>;
