// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import type { MortarModel, ShellType } from "../ballistics/mortar.schema";
import {
	type MortarResolution,
	useResolvedMortarData,
} from "./current-resolution.store";

const STORAGE_KEY = "resolved-mortar-solution";

const mockResolution: MortarResolution = {
	mortar: "M252",
	shell: "HE",
	origin: { grid: "050050", altitude: "0" },
	target: { grid: "059062", altitude: "0" },
	resolution: {
		rings: 3,
		distance: 1500,
		elevation: 1243,
		azimuth: 655,
		timeOfFlight: 30.5,
		altitudeCorrection: 0,
	},
};

function readStorage() {
	const raw = sessionStorage.getItem(STORAGE_KEY);
	return raw ? JSON.parse(raw) : null;
}

describe("useResolvedMortarData", () => {
	beforeEach(() => {
		sessionStorage.clear();
		useResolvedMortarData.setState({ mortarResolution: null });
	});

	it("starts without resolution", () => {
		expect(useResolvedMortarData.getState().mortarResolution).toBeNull();
	});

	it("saves resolution with updateResolution", () => {
		useResolvedMortarData.getState().updateResolution(mockResolution);

		expect(useResolvedMortarData.getState().mortarResolution).toEqual(
			mockResolution,
		);
	});

	it("replaces the previous resolution", () => {
		const { updateResolution } = useResolvedMortarData.getState();
		const newer = {
			...mockResolution,
			mortar: "2B14" as MortarModel,
			shell: "SMOKE" as ShellType,
		};

		updateResolution(mockResolution);
		updateResolution(newer);

		expect(useResolvedMortarData.getState().mortarResolution).toEqual(newer);
	});

	it("clears resolution with clearResolution", () => {
		const { updateResolution, clearResolution } =
			useResolvedMortarData.getState();

		updateResolution(mockResolution);
		clearResolution();

		expect(useResolvedMortarData.getState().mortarResolution).toBeNull();
	});

	it("persists resolution in sessionStorage", () => {
		useResolvedMortarData.getState().updateResolution(mockResolution);

		expect(readStorage()?.state).toEqual({ mortarResolution: mockResolution });
	});

	it("persists clear resolution in sessionStorage", () => {
		const { updateResolution, clearResolution } =
			useResolvedMortarData.getState();

		updateResolution(mockResolution);
		clearResolution();

		expect(readStorage()?.state).toEqual({ mortarResolution: null });
	});

	it("restores saved resolution from sessionStorage", async () => {
		sessionStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({
				state: { mortarResolution: mockResolution },
				version: 0,
			}),
		);

		await useResolvedMortarData.persist.rehydrate();

		expect(useResolvedMortarData.getState().mortarResolution).toEqual(
			mockResolution,
		);
	});
});
