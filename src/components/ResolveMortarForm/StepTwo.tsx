import { FieldError, Input, Label, TextField } from "@heroui/react";
import { Controller, useFormContext } from "react-hook-form";
import { formatGridCoords } from "../../grid/format-grid";
import type { ResolveMortarFormData } from "./resolve-mortar-form.schema";

export const StepTwo = () => {
	const { control } = useFormContext<ResolveMortarFormData>();

	return (
		<div className="flex flex-col gap-4">
			<div className="flex gap-2 w-full">
				<Controller
					control={control}
					name="start"
					render={({ field, fieldState }) => (
						<TextField
							className="w-full"
							name={field.name}
							value={field.value ?? null}
							onChange={(value) => field.onChange(formatGridCoords(value))}
							onBlur={field.onBlur}
							isInvalid={fieldState.invalid}
							maxLength={7}
						>
							<Label>Weapon position</Label>
							<Input placeholder="000 000" />
							<FieldError>{fieldState.error?.message}</FieldError>
						</TextField>
					)}
				/>
				<Controller
					control={control}
					name="startHeight"
					render={({ field, fieldState }) => (
						<div className="flex-col gap-2 w-32">
							<Label>Altitude</Label>
							<Input
								placeholder="0"
								type="number"
								{...field}
								className="w-full"
							/>
							<FieldError>{fieldState.error?.message}</FieldError>
						</div>
					)}
				/>
			</div>
			<div className="flex gap-2 w-full">
				<Controller
					control={control}
					name="end"
					render={({ field, fieldState }) => (
						<TextField
							className="w-full"
							name={field.name}
							value={field.value ?? null}
							onChange={(value) => field.onChange(formatGridCoords(value))}
							onBlur={field.onBlur}
							isInvalid={fieldState.invalid}
							maxLength={7}
						>
							<Label>Target position</Label>
							<Input placeholder="000 000" />
							<FieldError>{fieldState.error?.message}</FieldError>
						</TextField>
					)}
				/>
				<Controller
					control={control}
					name="endHeight"
					render={({ field, fieldState }) => (
						<div className="flex-col gap-2 w-32">
							<Label>Altitude</Label>
							<Input
								placeholder="0"
								type="number"
								{...field}
								className="w-full"
							/>
							<FieldError>{fieldState.error?.message}</FieldError>
						</div>
					)}
				/>
			</div>
		</div>
	);
};
