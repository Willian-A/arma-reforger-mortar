import { create, type ExtractState } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ShellType } from "../mortars_data/mortars.schema";
import type { ResolvedFiringMortarData } from "../utils/resolvers";

type Position = { x: number; y: number; z: number };

export type MortarResolution = {
	weapon: { name: string; shell: ShellType };
	coords: { start: Position; end: Position };
	resolution: ResolvedFiringMortarData;
};

type ResolvedMortarData = {
	mortarResolution: MortarResolution | null;
	updateResolution: (mortarResolution: MortarResolution) => void;
	clearResolution: () => void;
};

export const useResolvedMortarData = create<ResolvedMortarData>()(
	persist(
		(set) => ({
			mortarResolution: null,
			updateResolution: (mortarResolution) => set({ mortarResolution }),
			clearResolution: () => set({ mortarResolution: null }),
		}),
		{
			name: "resolved-mortar-solution",
			storage: createJSONStorage(() => sessionStorage),
			partialize: (state) => ({ mortarResolution: state.mortarResolution }),
		},
	),
);

export type ResolvedMortarState = ExtractState<typeof useResolvedMortarData>;
