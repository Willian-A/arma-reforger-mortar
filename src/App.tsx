import { useRef } from "react";
import { useStore } from "zustand";

import {
	ResolveMortarForm,
	type ResolveMortarFormHandle,
} from "./components/ResolveMortarForm/ResolveMortarForm";
import { ResultsHistoryCard } from "./components/ResultsHistoryCard";
import { useHistoryStore } from "./stores/history.store";

export default function App() {
	const resolvedHistory = useStore(useHistoryStore);
	const formRef = useRef<ResolveMortarFormHandle>(null);

	return (
		<section className="relative w-full h-screen">
			<div className="flex flex-row w-full justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 gap-4">
				<ResolveMortarForm ref={formRef} />
				{resolvedHistory.history.length > 0 && (
					<ResultsHistoryCard
						resultsHistory={resolvedHistory}
						onRestore={(historyData) =>
							formRef.current?.restoreFromHistory(historyData)
						}
					/>
				)}
			</div>
		</section>
	);
}
