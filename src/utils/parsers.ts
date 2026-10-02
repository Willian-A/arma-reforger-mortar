function gridToMeters(x: string, y: string): string[] {
	const xMeters = (parseInt(x, 10) * 100).toString();
	const yMeters = (parseInt(y, 10) * 100).toString();

	return [xMeters, yMeters];
}

function centerCoords(xMeters: string, yMeters: string): string[] {
	const centerX = (parseInt(xMeters, 10) + 50).toString();
	const centerY = (parseInt(yMeters, 10) + 50).toString();

	return [centerX, centerY];
}

function calculatePrecision(): number {
	const axis_margin = 100 / 2; // 3 digits is 100m by default
	const precision = Math.round(axis_margin * Math.SQRT2); // 71

	return precision;
}

function parseCoords(coords: string): string[] {
	const formattedCoords = coords.trim().replaceAll(" ", "");

	if (formattedCoords.length !== 6) {
		throw new Error("Invalid coords format");
	} else if (!/^[0-9 ]+$/.test(formattedCoords)) {
		throw new Error("Invalid coords characters");
	}

	const X = formattedCoords.slice(0, 3);
	const Y = formattedCoords.slice(3, 6);

	if (Number(X) < 0 || Number(Y) < 0) {
		throw new Error("Coords must be positive");
	}

	return [X, Y];
}

function calculateDistance({
	start,
	end,
}: {
	start: { x: string; y: string };
	end: { x: string; y: string };
}): number {
	const dx = parseInt(end.x, 10) - parseInt(start.x, 10);
	const dy = parseInt(end.y, 10) - parseInt(start.y, 10);
	const distance = Math.sqrt(dx * dx + dy * dy).toFixed(2);

	return Number(distance);
}

function calculateAzimuthMils({
	start,
	end,
	faction,
}: {
	start: { x: string; y: string };
	end: { x: string; y: string };
	faction: "US" | "URSS";
}): number {
	const milsPerCircle = faction === "US" ? 6400 : 6000;

	const dx = Number(end.x) - Number(start.x);
	const dy = Number(end.y) - Number(start.y);

	const radians = Math.atan2(dx, dy);

	const normalized = (radians + 2 * Math.PI) % (2 * Math.PI);

	return (normalized / (2 * Math.PI)) * milsPerCircle;
}

export {
	calculateAzimuthMils,
	calculateDistance,
	calculatePrecision,
	centerCoords,
	gridToMeters,
	parseCoords,
};
