// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import type { MortarModel, ShellType } from "../ballistics/mortar.schema";
import {
	type Resolution,
	useCurrentResolutionStore,
} from "./current-resolution.store";

const STORAGE_KEY = "resolved-mortar-solution";

const mockResolution: Resolution = {
	mortar: "M252",
	shell: "HE",
	origin: { grid: "050050", altitude: "0" },
	target: { grid: "059062", altitude: "0" },
	solution: {
		charge: 3,
		distanceM: 1500,
		elevationMil: 1243,
		azimuthMil: 655,
		timeOfFlightS: 30.5,
		altitudeCorrectionMil: 0,
	},
};

function readStorage() {
	const raw = sessionStorage.getItem(STORAGE_KEY);
	return raw ? JSON.parse(raw) : null;
}

describe("useCurrentResolutionStore", () => {
	beforeEach(() => {
		sessionStorage.clear();
		useCurrentResolutionStore.setState({ mortarResolution: null });
	});

	it("starts without resolution", () => {
		expect(useCurrentResolutionStore.getState().mortarResolution).toBeNull();
	});

	it("saves resolution with set", () => {
		useCurrentResolutionStore.getState().set(mockResolution);

		expect(useCurrentResolutionStore.getState().mortarResolution).toEqual(
			mockResolution,
		);
	});

	it("replaces the previous resolution", () => {
		const { set } = useCurrentResolutionStore.getState();
		const newer = {
			...mockResolution,
			mortar: "2B14" as MortarModel,
			shell: "SMOKE" as ShellType,
		};

		set(mockResolution);
		set(newer);

		expect(useCurrentResolutionStore.getState().mortarResolution).toEqual(
			newer,
		);
	});

	it("clears resolution with clear", () => {
		const { set, clear } = useCurrentResolutionStore.getState();

		set(mockResolution);
		clear();

		expect(useCurrentResolutionStore.getState().mortarResolution).toBeNull();
	});

	it("persists resolution in sessionStorage", () => {
		useCurrentResolutionStore.getState().set(mockResolution);

		expect(readStorage()?.state).toEqual({ mortarResolution: mockResolution });
	});

	it("persists clear resolution in sessionStorage", () => {
		const { set, clear } = useCurrentResolutionStore.getState();

		set(mockResolution);
		clear();

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

		await useCurrentResolutionStore.persist.rehydrate();

		expect(useCurrentResolutionStore.getState().mortarResolution).toEqual(
			mockResolution,
		);
	});
});
