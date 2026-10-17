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

type CurrentResolutionState = {
	mortarResolution: MortarResolution | null;
	set: (mortarResolution: MortarResolution) => void;
	clear: () => void;
};

export const useCurrentResolutionStore = create<CurrentResolutionState>()(
	persist(
		(set) => ({
			mortarResolution: null,
			set: (mortarResolution) => set({ mortarResolution }),
			clear: () => set({ mortarResolution: null }),
		}),
		{
			name: "resolved-mortar-solution",
			storage: createJSONStorage(() => sessionStorage),
			partialize: (state) => ({ mortarResolution: state.mortarResolution }),
		},
	),
);
