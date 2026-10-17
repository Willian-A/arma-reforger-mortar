import { FieldError, Label, ListBox, Select } from "@heroui/react";
import { Controller, useFormContext } from "react-hook-form";
import type { ResolveMortarFormData } from "./resolve-mortar-form.schema";

export const MortarStep = () => {
	const { control } = useFormContext<ResolveMortarFormData>();

	return (
		<div className="flex flex-col gap-4">
			<Controller
				control={control}
				name="mortar"
				render={({ field, fieldState }) => (
					<Select
						placeholder="Select one"
						name={field.name}
						value={field.value ?? null}
						onChange={(key) => field.onChange(key)}
						onBlur={field.onBlur}
						isInvalid={fieldState.invalid}
					>
						<Label>Weapon</Label>
						<Select.Trigger>
							<Select.Value />
							<Select.Indicator />
						</Select.Trigger>
						<Select.Popover>
							<ListBox>
								<ListBox.Item id="M252" textValue="M252">
									M252
									<ListBox.ItemIndicator />
								</ListBox.Item>
								<ListBox.Item id="2B14" textValue="2B14">
									2B14
									<ListBox.ItemIndicator />
								</ListBox.Item>
							</ListBox>
						</Select.Popover>
						<FieldError>{fieldState.error?.message}</FieldError>
					</Select>
				)}
			/>
			<Controller
				control={control}
				name="shellType"
				render={({ field, fieldState }) => (
					<Select
						placeholder="Select one"
						name={field.name}
						value={field.value ?? null}
						onChange={(key) => field.onChange(key)}
						onBlur={field.onBlur}
						isInvalid={fieldState.invalid}
					>
						<Label>Shell type</Label>
						<Select.Trigger>
							<Select.Value />
							<Select.Indicator />
						</Select.Trigger>
						<Select.Popover>
							<ListBox>
								<ListBox.Item id="HE" textValue="HE">
									HE
									<ListBox.ItemIndicator />
								</ListBox.Item>
								<ListBox.Item id="SMOKE" textValue="Smoke">
									Smoke
									<ListBox.ItemIndicator />
								</ListBox.Item>
								<ListBox.Item id="ILLUMINATION" textValue="Illumination">
									Illumination
									<ListBox.ItemIndicator />
								</ListBox.Item>
							</ListBox>
						</Select.Popover>
						<FieldError>{fieldState.error?.message}</FieldError>
					</Select>
				)}
			/>
		</div>
	);
};
