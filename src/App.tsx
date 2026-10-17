import { Button, Card, Chip, Form } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useStore } from "zustand";

import { resolveFiringMortarData } from "./ballistics/firing-solution";
import {
	type ResolveMortarFormData,
	resolveMortarFormSchema,
} from "./components/ResolveMortarForm/resolve-mortar-form.schema";
import { StepOne } from "./components/ResolveMortarForm/StepOne";
import { StepTwo } from "./components/ResolveMortarForm/StepTwo";
import { ResultsHistoryCard } from "./components/ResultsHistoryCard";
import { useCurrentResolutionStore } from "./stores/current-resolution.store";
import { type HistoryItem, useHistoryStore } from "./stores/history.store";

export default function App() {
	const currentResolution = useStore(useCurrentResolutionStore);
	const resolvedHistory = useStore(useHistoryStore);
	const [step, setStep] = useState(currentResolution.mortarResolution ? 1 : 0);

	function handleDefaultValues() {
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
		defaultValues: handleDefaultValues(),
	});

	const onSubmit = (data: ResolveMortarFormData) => {
		const resolvedMortarSolution = resolveFiringMortarData({
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
			resolution: resolvedMortarSolution,
		};

		currentResolution.set(resolutionData);
		resolvedHistory.add(resolutionData);
	};

	const handleNextStep = () => {
		const isUsingSameGun =
			currentResolution.mortarResolution?.mortar !== methods.getValues("mortar");
		const isUsingSameShellType =
			currentResolution.mortarResolution?.shell !== methods.getValues("shellType");

		if (isUsingSameGun || isUsingSameShellType) {
			currentResolution.clear();
			methods.resetDefaultValues({});
			methods.resetField("target");
			methods.resetField("targetAltitude");
			methods.resetField("origin");
			methods.resetField("originAltitude");
		}

		setStep(1);
	};

	const hasBasicInfo = methods.watch("mortar") && methods.watch("shellType");

	function setFormDataFromHistory(historyData: HistoryItem) {
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

	return (
		<section className="relative w-full h-screen">
			<FormProvider {...methods}>
				<Form onSubmit={methods.handleSubmit(onSubmit)}>
					<div className="flex flex-row w-full justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 gap-4">
						<Card className="h-min min-h-77 w-77">
							<Card.Header className="gap-2">
								<Card.Title className="text-lg font-semibold">
									Mortar Firing Resolution
								</Card.Title>
								<Card.Description className="flex gap-1">
									{hasBasicInfo && step === 1 && (
										<>
											<Chip>{methods.watch("mortar")}</Chip>
											<Chip>{methods.watch("shellType")}</Chip>
										</>
									)}
								</Card.Description>
							</Card.Header>
							<Card.Content>
								{step === 0 && <StepOne />}
								{step === 1 && <StepTwo />}
							</Card.Content>
							<Card.Footer className="mt-4 flex flex-col gap-2">
								{step === 0 && (
									<Button
										className="w-full"
										type="button"
										onClick={handleNextStep}
									>
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
						{resolvedHistory.history.length > 0 && (
							<ResultsHistoryCard
								resultsHistory={resolvedHistory}
								setFormData={setFormDataFromHistory}
							/>
						)}
					</div>
				</Form>
			</FormProvider>
		</section>
	);
}
