import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { MortarResolution } from "./current-resolution.store";

export type HistoryItem = MortarResolution & { id: string };

export type HistoryState = {
	history: HistoryItem[];
	add: (resolution: MortarResolution) => void;
	remove: (id: string) => void;
	clear: () => void;
};

export const useHistoryStore = create<HistoryState>()(
	persist(
		(set) => ({
			history: [],
			add: (resolution) =>
				set((state) => ({
					history: [
						...state.history,
						{ ...resolution, id: crypto.randomUUID() },
					],
				})),
			remove: (id) =>
				set((state) => ({
					history: state.history.filter((item) => item.id !== id),
				})),
			clear: () => set({ history: [] }),
		}),
		{
			name: "resolved-solution-history",
			storage: createJSONStorage(() => sessionStorage),
			partialize: (state) => ({ history: state.history }),
		},
	),
);
