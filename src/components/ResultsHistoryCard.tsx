import { Button, Card, Chip, ScrollShadow } from "@heroui/react";
import { CrosshairSimpleIcon, TrashSimpleIcon } from "@phosphor-icons/react";

import type {
	HistoryItem,
	HistoryState,
} from "../stores/history.store";

interface ResultsHistoryCardProps {
	resultsHistory: HistoryState;
	onRestore: (historyData: HistoryItem) => void;
}

export function ResultsHistoryCard({
	resultsHistory,
	onRestore,
}: ResultsHistoryCardProps) {
	return (
		<Card>
			<Card.Header className="flex flex-row items-center justify-between">
				<Card.Title className="text-lg font-semibold">History</Card.Title>
				<Card.Description className="flex gap-1">
					<Button
						size="sm"
						variant="danger-soft"
						onClick={() => resultsHistory.clear()}
					>
						Clear all history
					</Button>
				</Card.Description>
			</Card.Header>
			<ScrollShadow className="w-full min-w-[650px] max-h-[525px] flex flex-col gap-4 pr-2 pl-0.5">
				{resultsHistory.history.toReversed().map((resolution) => (
					<div
						key={resolution.id}
						className="w-full border border-zinc-800 p-3 rounded-xl transition hover:border-zinc-700"
					>
						<div className="flex gap-2">
							<Chip>{resolution.mortar}</Chip>
							<Chip>{resolution.shell}</Chip>
						</div>
						<div className="flex gap-4">
							<div className="flex gap-1">
								<h1>firing from {resolution.origin.grid}</h1>
								{resolution.origin.altitude && (
									<h1>{resolution.origin.altitude}m</h1>
								)}
							</div>
							<div className="flex gap-1">
								<h1>to {resolution.target.grid}</h1>
								{resolution.target.altitude && (
									<h1>{resolution.target.altitude}m</h1>
								)}
							</div>
							<h1>distance of {resolution.solution.distanceM}m</h1>
						</div>
						<div className="w-full flex justify-between gap-1">
							<div className="flex gap-1">
								<h1>{resolution.solution.charge} rings</h1>
								<h1> · </h1>
								<h1>azimuth {resolution.solution.azimuthMil} mil</h1>
								<h1> · </h1>
								<h1>elevation {resolution.solution.elevationMil} mil</h1>
								<h1> · </h1>
								<h1>Time of flight {resolution.solution.timeOfFlightS}s</h1>
							</div>
							<div className="flex gap-1">
								<Button
									isIconOnly
									size="sm"
									variant="outline"
									onClick={() => onRestore(resolution)}
								>
									<CrosshairSimpleIcon size={32} />
								</Button>
								<Button
									isIconOnly
									size="sm"
									variant="outline"
									onClick={() =>
										resultsHistory.remove(resolution.id)
									}
								>
									<TrashSimpleIcon size={32} />
								</Button>
							</div>
						</div>
					</div>
				))}
			</ScrollShadow>
		</Card>
	);
}
