// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import type { MortarModel, ShellType } from "../ballistics/mortar.schema";
import type { MortarResolution } from "./current-resolution.store";
import { useHistoryStore } from "./history.store";

const STORAGE_KEY = "resolved-solution-history";

const mockResolution: MortarResolution = {
	mortar: "M252",
	shell: "HE",
	origin: { grid: "050 050", altitude: undefined },
	target: { grid: "059 062", altitude: undefined },
	resolution: {
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

describe("useHistoryStore", () => {
	beforeEach(() => {
		sessionStorage.clear();
		useHistoryStore.setState({ history: [] });
	});

	it("starts with empty history", () => {
		expect(useHistoryStore.getState().history).toEqual([]);
	});

	it("adds resolution to history with add", () => {
		useHistoryStore.getState().add(mockResolution);

		const { history } = useHistoryStore.getState();
		expect(history).toHaveLength(1);
		expect(history[0]).toMatchObject(mockResolution);
		expect(history[0].id).toBeTruthy();
	});

	it("assigns a unique id to each added item", () => {
		const { add } = useHistoryStore.getState();

		add(mockResolution);
		add(mockResolution);

		const [first, second] = useHistoryStore.getState().history;
		expect(first.id).not.toEqual(second.id);
	});

	it("appends new items keeping previous ones", () => {
		const { add } = useHistoryStore.getState();
		const newer = {
			...mockResolution,
			mortar: "2B14" as MortarModel,
			shell: "SMOKE" as ShellType,
		};

		add(mockResolution);
		add(newer);

		const { history } = useHistoryStore.getState();
		expect(history).toHaveLength(2);
		expect(history[0]).toMatchObject(mockResolution);
		expect(history[1]).toMatchObject(newer);
	});

	it("removes an item from history with remove", () => {
		const { add, remove } = useHistoryStore.getState();

		add(mockResolution);
		const [added] = useHistoryStore.getState().history;

		remove(added.id);

		expect(useHistoryStore.getState().history).toEqual([]);
	});

	it("keeps other items when removing one from history", () => {
		const { add, remove } = useHistoryStore.getState();

		add(mockResolution);
		add({
			...mockResolution,
			mortar: "2B14",
			shell: "SMOKE",
		});
		const [first, second] = useHistoryStore.getState().history;

		remove(first.id);

		expect(useHistoryStore.getState().history).toEqual([second]);
	});

	it("clears history with clear", () => {
		const { add, clear } = useHistoryStore.getState();

		add(mockResolution);
		clear();

		expect(useHistoryStore.getState().history).toEqual([]);
	});

	it("persists history in sessionStorage", () => {
		useHistoryStore.getState().add(mockResolution);

		const { history } = useHistoryStore.getState();
		expect(readStorage()?.state).toEqual({ history });
	});

	it("persists cleared history in sessionStorage", () => {
		const { add, clear } = useHistoryStore.getState();

		add(mockResolution);
		clear();

		expect(readStorage()?.state).toEqual({ history: [] });
	});

	it("restores saved history from sessionStorage", async () => {
		const savedItem = { ...mockResolution, id: "fixed-id" };
		sessionStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({
				state: { history: [savedItem] },
				version: 0,
			}),
		);

		await useHistoryStore.persist.rehydrate();

		expect(useHistoryStore.getState().history).toEqual([savedItem]);
	});
});
