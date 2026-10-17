import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { FiringSolution } from "../ballistics/firing-solution";
import type { MortarModel, ShellType } from "../ballistics/mortar.schema";

export type Resolution = {
	mortar: MortarModel;
	shell: ShellType;
	origin: { grid: string; altitude: string | undefined };
	target: { grid: string; altitude: string | undefined };
	solution: FiringSolution;
};

type CurrentResolutionState = {
	mortarResolution: Resolution | null;
	set: (mortarResolution: Resolution) => void;
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
