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

export { calculatePrecision, centerCoords, gridToMeters, parseCoords };
