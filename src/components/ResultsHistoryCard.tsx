import { Button, Card, Chip, ScrollShadow } from "@heroui/react";
import { CrosshairSimpleIcon, TrashSimpleIcon } from "@phosphor-icons/react";

import type {
	HistoryItem,
	ResolvedHistoryData,
} from "../stores/history.store";

interface ResultsHistoryCardProps {
	resultsHistory: ResolvedHistoryData;
	setFormData: (historyData: HistoryItem) => void;
}

export function ResultsHistoryCard({
	resultsHistory,
	setFormData,
}: ResultsHistoryCardProps) {
	return (
		<Card>
			<Card.Header className="flex flex-row items-center justify-between">
				<Card.Title className="text-lg font-semibold">History</Card.Title>
				<Card.Description className="flex gap-1">
					<Button
						size="sm"
						variant="danger-soft"
						onClick={() => resultsHistory.clearHistory()}
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
								<h1>firing from {resolution.coords.start}</h1>
								{resolution.coords.startAltitude && (
									<h1>{resolution.coords.startAltitude}m</h1>
								)}
							</div>
							<div className="flex gap-1">
								<h1>to {resolution.coords.end}</h1>
								{resolution.coords.endAltitude && (
									<h1>{resolution.coords.endAltitude}m</h1>
								)}
							</div>
							<h1>distance of {resolution.resolution.distance}m</h1>
						</div>
						<div className="w-full flex justify-between gap-1">
							<div className="flex gap-1">
								<h1>{resolution.resolution.rings} rings</h1>
								<h1> · </h1>
								<h1>azimuth {resolution.resolution.azimuth} mil</h1>
								<h1> · </h1>
								<h1>elevation {resolution.resolution.elevation} mil</h1>
								<h1> · </h1>
								<h1>Time of flight {resolution.resolution.timeOfFlight}s</h1>
							</div>
							<div className="flex gap-1">
								<Button
									isIconOnly
									size="sm"
									variant="outline"
									onClick={() => setFormData(resolution)}
								>
									<CrosshairSimpleIcon size={32} />
								</Button>
								<Button
									isIconOnly
									size="sm"
									variant="outline"
									onClick={() =>
										resultsHistory.removeFromHistory(resolution.id)
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
