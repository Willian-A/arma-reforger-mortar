import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ResolvedFiringMortarData } from "../ballistics/firing-solution";
import type { MortarModel, ShellType } from "../ballistics/mortar.schema";

export type MortarResolution = {
	mortar: MortarModel;
	shell: ShellType;
	origin: { grid: string; altitude: string | undefined };
	target: { grid: string; altitude: string | undefined };
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
