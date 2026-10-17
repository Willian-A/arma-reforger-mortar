import { Button, Card, Chip, Form, toast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Ref, useImperativeHandle, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useStore } from "zustand";

import { NoChargeError, OutOfRangeError } from "../../ballistics/errors";
import { calculateFiringSolution } from "../../ballistics/firing-solution";
import { useCurrentResolutionStore } from "../../stores/current-resolution.store";
import { type HistoryItem, useHistoryStore } from "../../stores/history.store";
import { MortarStep } from "./MortarStep";
import { PositionsStep } from "./PositionsStep";
import {
	type ResolveMortarFormData,
	resolveMortarFormSchema,
} from "./resolve-mortar-form.schema";

export type ResolveMortarFormHandle = {
	restoreFromHistory: (historyData: HistoryItem) => void;
};

function notifyFiringError(error: unknown) {
	if (error instanceof NoChargeError) {
		toast("No mortar shell found", {
			description: error.message,
			variant: "warning",
			timeout: 5000,
		});
		return;
	}

	if (error instanceof OutOfRangeError) {
		toast("Out of charge range", {
			description: error.message,
			variant: "warning",
			timeout: 5000,
		});
		return;
	}

	throw error;
}

export function ResolveMortarForm({
	ref,
}: {
	ref?: Ref<ResolveMortarFormHandle>;
}) {
	const currentResolution = useStore(useCurrentResolutionStore);
	const addToHistory = useHistoryStore((state) => state.add);
	const [step, setStep] = useState(currentResolution.mortarResolution ? 1 : 0);

	function getDefaultValues() {
		if (currentResolution.mortarResolution) {
			return {
				mortar: currentResolution.mortarResolution.mortar,
				shellType: currentResolution.mortarResolution.shell,
				origin: currentResolution.mortarResolution.origin.grid,
				originAltitude: currentResolution.mortarResolution.origin.altitude,
				target: currentResolution.mortarResolution.target.grid,
				targetAltitude: currentResolution.mortarResolution.target.altitude,
			};
		}

		return undefined;
	}

	const methods = useForm<ResolveMortarFormData>({
		resolver: zodResolver(resolveMortarFormSchema),
		reValidateMode: "onChange",
		defaultValues: getDefaultValues(),
	});

	const onSubmit = (data: ResolveMortarFormData) => {
		try {
			const solution = calculateFiringSolution({
				mortar: data.mortar,
				origin: { grid: data.origin, altitude: String(data.originAltitude) },
				target: { grid: data.target, altitude: String(data.targetAltitude) },
				shellType: data.shellType,
			});

			const resolutionData = {
				mortar: data.mortar,
				shell: data.shellType,
				origin: { grid: data.origin, altitude: data.originAltitude },
				target: { grid: data.target, altitude: data.targetAltitude },
				solution,
			};

			currentResolution.set(resolutionData);
			addToHistory(resolutionData);
		} catch (error) {
			notifyFiringError(error);
		}
	};

	const handleNextStep = () => {
		const hasMortarChanged =
			currentResolution.mortarResolution?.mortar !==
			methods.getValues("mortar");
		const hasShellChanged =
			currentResolution.mortarResolution?.shell !==
			methods.getValues("shellType");

		if (hasMortarChanged || hasShellChanged) {
			currentResolution.clear();
			methods.resetDefaultValues({});
			methods.resetField("target");
			methods.resetField("targetAltitude");
			methods.resetField("origin");
			methods.resetField("originAltitude");
		}

		setStep(1);
	};

	const hasMortarAndShell =
		methods.watch("mortar") && methods.watch("shellType");

	function restoreFromHistory(historyData: HistoryItem) {
		const { setValues } = methods;
		const { mortar, shell, origin, target } = historyData;

		setValues({
			mortar,
			origin: origin.grid,
			originAltitude: origin.altitude,
			target: target.grid,
			targetAltitude: target.altitude,
			shellType: shell,
		});
	}

	useImperativeHandle(ref, () => ({ restoreFromHistory }));

	return (
		<FormProvider {...methods}>
			<Form onSubmit={methods.handleSubmit(onSubmit)}>
				<Card className="h-min min-h-77 w-77">
					<Card.Header className="gap-2">
						<Card.Title className="text-lg font-semibold">
							Mortar Firing Resolution
						</Card.Title>
						<Card.Description className="flex gap-1">
							{hasMortarAndShell && step === 1 && (
								<>
									<Chip>{methods.watch("mortar")}</Chip>
									<Chip>{methods.watch("shellType")}</Chip>
								</>
							)}
						</Card.Description>
					</Card.Header>
					<Card.Content>
						{step === 0 && <MortarStep />}
						{step === 1 && <PositionsStep />}
					</Card.Content>
					<Card.Footer className="mt-4 flex flex-col gap-2">
						{step === 0 && (
							<Button className="w-full" type="button" onClick={handleNextStep}>
								Next
							</Button>
						)}
						{step === 1 && (
							<div className="w-full flex gap-2">
								<Button
									className="w-1/2"
									type="button"
									variant="outline"
									onClick={() => setStep(0)}
								>
									Back
								</Button>
								<Button className="w-full" type="submit">
									Calculate
								</Button>
							</div>
						)}
					</Card.Footer>
				</Card>
			</Form>
		</FormProvider>
	);
}
