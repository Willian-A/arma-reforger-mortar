import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { GunType, ShellType } from "../ballistics/mortar.schema";
import type { ResolvedFiringMortarData } from "../utils/resolvers";

export type MortarResolution = {
	weapon: { name: GunType; shell: ShellType };
	coords: {
		start: string;
		startHeight: string | undefined;
		end: string;
		endHeight: string | undefined;
	};
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
