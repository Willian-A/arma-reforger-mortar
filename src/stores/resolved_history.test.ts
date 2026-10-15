// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import type { MortarResolution } from "./resolved_mortar.store";
import { useResolvedHistory } from "./resolved_history.store";

const STORAGE_KEY = "resolved-solution-history";

const mockResolution: MortarResolution = {
	weapon: { name: "M252", shell: "HE" },
	coords: {
		start: "050 050",
		startHeight: undefined,
		end: "059 062",
		endHeight: undefined,
	},
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

describe("useResolvedHistory", () => {
	beforeEach(() => {
		sessionStorage.clear();
		useResolvedHistory.setState({ history: [] });
	});

	it("starts with empty history", () => {
		expect(useResolvedHistory.getState().history).toEqual([]);
	});

	it("adds resolution to history with addToHistory", () => {
		useResolvedHistory.getState().addToHistory(mockResolution);

		const { history } = useResolvedHistory.getState();
		expect(history).toHaveLength(1);
		expect(history[0]).toMatchObject(mockResolution);
		expect(history[0].id).toBeTruthy();
	});

	it("assigns a unique id to each added item", () => {
		const { addToHistory } = useResolvedHistory.getState();

		addToHistory(mockResolution);
		addToHistory(mockResolution);

		const [first, second] = useResolvedHistory.getState().history;
		expect(first.id).not.toEqual(second.id);
	});

	it("appends new items keeping previous ones", () => {
		const { addToHistory } = useResolvedHistory.getState();
		const newer = { ...mockResolution, weapon: { name: "2B14", shell: "SMOKE" } };

		addToHistory(mockResolution);
		addToHistory(newer);

		const { history } = useResolvedHistory.getState();
		expect(history).toHaveLength(2);
		expect(history[0]).toMatchObject(mockResolution);
		expect(history[1]).toMatchObject(newer);
	});

	it("removes an item from history with removeFromHistory", () => {
		const { addToHistory, removeFromHistory } = useResolvedHistory.getState();

		addToHistory(mockResolution);
		const [added] = useResolvedHistory.getState().history;

		removeFromHistory(added.id);

		expect(useResolvedHistory.getState().history).toEqual([]);
	});

	it("keeps other items when removing one from history", () => {
		const { addToHistory, removeFromHistory } = useResolvedHistory.getState();

		addToHistory(mockResolution);
		addToHistory({ ...mockResolution, weapon: { name: "2B14", shell: "SMOKE" } });
		const [first, second] = useResolvedHistory.getState().history;

		removeFromHistory(first.id);

		expect(useResolvedHistory.getState().history).toEqual([second]);
	});

	it("clears history with clearHistory", () => {
		const { addToHistory, clearHistory } = useResolvedHistory.getState();

		addToHistory(mockResolution);
		clearHistory();

		expect(useResolvedHistory.getState().history).toEqual([]);
	});

	it("persists history in sessionStorage", () => {
		useResolvedHistory.getState().addToHistory(mockResolution);

		const { history } = useResolvedHistory.getState();
		expect(readStorage()?.state).toEqual({ history });
	});

	it("persists cleared history in sessionStorage", () => {
		const { addToHistory, clearHistory } = useResolvedHistory.getState();

		addToHistory(mockResolution);
		clearHistory();

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

		await useResolvedHistory.persist.rehydrate();

		expect(useResolvedHistory.getState().history).toEqual([savedItem]);
	});
});
