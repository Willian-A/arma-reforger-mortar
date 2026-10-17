import { Button, Card, Chip, ScrollShadow } from "@heroui/react";
import { CrosshairSimpleIcon, TrashSimpleIcon } from "@phosphor-icons/react";

import { type HistoryItem, useHistoryStore } from "../stores/history.store";

interface ResultsHistoryCardProps {
	onRestore: (historyData: HistoryItem) => void;
}

export function ResultsHistoryCard({ onRestore }: ResultsHistoryCardProps) {
	const history = useHistoryStore((state) => state.history);
	const remove = useHistoryStore((state) => state.remove);
	const clear = useHistoryStore((state) => state.clear);

	if (history.length === 0) return null;

	return (
		<Card>
			<Card.Header className="flex flex-row items-center justify-between">
				<Card.Title className="text-lg font-semibold">History</Card.Title>
				<Card.Description className="flex gap-1">
					<Button size="sm" variant="danger-soft" onClick={() => clear()}>
						Clear all history
					</Button>
				</Card.Description>
			</Card.Header>
			<ScrollShadow className="w-full min-w-[650px] max-h-[525px] flex flex-col gap-4 pr-2 pl-0.5">
				{history.toReversed().map((resolution) => (
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
								<span>firing from {resolution.origin.grid}</span>
								{resolution.origin.altitude && (
									<span>{resolution.origin.altitude}m</span>
								)}
							</div>
							<div className="flex gap-1">
								<span>to {resolution.target.grid}</span>
								{resolution.target.altitude && (
									<span>{resolution.target.altitude}m</span>
								)}
							</div>
							<span>distance of {resolution.solution.distanceM}m</span>
						</div>
						<div className="w-full flex justify-between gap-1">
							<span>
								{[
									`${resolution.solution.charge} rings`,
									`azimuth ${resolution.solution.azimuthMil} mil`,
									`elevation ${resolution.solution.elevationMil} mil`,
									`Time of flight ${resolution.solution.timeOfFlightS}s`,
								].join(" · ")}
							</span>
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
									onClick={() => remove(resolution.id)}
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
