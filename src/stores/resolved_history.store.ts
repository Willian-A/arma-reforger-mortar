import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { MortarResolution } from "./resolved_mortar.store";

export type HistoryItem = MortarResolution & { id: string };

export type ResolvedHistoryData = {
	history: HistoryItem[];
	addToHistory: (resolution: MortarResolution) => void;
	removeFromHistory: (id: string) => void;
	clearHistory: () => void;
};

export const useResolvedHistory = create<ResolvedHistoryData>()(
	persist(
		(set) => ({
			history: [],
			addToHistory: (resolution) =>
				set((state) => ({
					history: [
						...state.history,
						{ ...resolution, id: crypto.randomUUID() },
					],
				})),
			removeFromHistory: (id) =>
				set((state) => ({
					history: state.history.filter((item) => item.id !== id),
				})),
			clearHistory: () => set({ history: [] }),
		}),
		{
			name: "resolved-solution-history",
			storage: createJSONStorage(() => sessionStorage),
			partialize: (state) => ({ history: state.history }),
		},
	),
);
