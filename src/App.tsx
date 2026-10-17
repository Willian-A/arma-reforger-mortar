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
import { useResolvedMortarData } from "./stores/current-resolution.store";
import { type HistoryItem, useResolvedHistory } from "./stores/history.store";

export default function App() {
	const cachedData = useStore(useResolvedMortarData);
	const resolvedHistory = useStore(useResolvedHistory);
	const [step, setStep] = useState(cachedData.mortarResolution ? 1 : 0);

	function handleDefaultValues() {
		if (cachedData.mortarResolution) {
			return {
				mortarGun: cachedData.mortarResolution.weapon.name,
				shellType: cachedData.mortarResolution.weapon.shell,
				start: cachedData.mortarResolution.coords.start,
				startHeight: cachedData.mortarResolution.coords.startHeight,
				end: cachedData.mortarResolution.coords.end,
				endHeight: cachedData.mortarResolution.coords.endHeight,
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
			mortar: data.mortarGun,
			coords: {
				start: data.start,
				end: data.end,
				startZ: String(data.startHeight),
				endZ: String(data.endHeight),
			},
			shell_type: data.shellType,
		});

		const resolutionData = {
			weapon: { name: data.mortarGun, shell: data.shellType },
			coords: {
				start: data.start,
				startHeight: data.startHeight,
				end: data.end,
				endHeight: data.endHeight,
			},
			resolution: resolvedMortarSolution,
		};

		cachedData.updateResolution(resolutionData);
		resolvedHistory.addToHistory(resolutionData);
	};

	const handleNextStep = () => {
		const isUsingSameGun =
			cachedData.mortarResolution?.weapon.name !==
			methods.getValues("mortarGun");
		const isUsingSameShellType =
			cachedData.mortarResolution?.weapon.shell !==
			methods.getValues("shellType");

		if (isUsingSameGun || isUsingSameShellType) {
			cachedData.clearResolution();
			methods.resetDefaultValues({});
			methods.resetField("end");
			methods.resetField("endHeight");
			methods.resetField("start");
			methods.resetField("startHeight");
		}

		setStep(1);
	};

	const hasBasicInfo = methods.watch("mortarGun") && methods.watch("shellType");

	function setFormDataFromHistory(historyData: HistoryItem) {
		const { setValues } = methods;
		const { weapon, coords } = historyData;

		setValues({
			mortarGun: weapon.name,
			start: coords.start,
			startHeight: coords.startHeight,
			end: coords.end,
			endHeight: coords.endHeight,
			shellType: weapon.shell,
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
											<Chip>{methods.watch("mortarGun")}</Chip>
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
