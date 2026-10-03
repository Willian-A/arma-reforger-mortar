function calculatePrecision(): number {
	const axis_margin = 100 / 2; // 3 digits is 100m by default
	const precision = Math.round(axis_margin * Math.SQRT2); // 71

	return precision;
}

function calculateDistance({
	start,
	end,
}: {
	start: { x: number; y: number };
	end: { x: number; y: number };
}): number {
	const dx = (end.x - start.x) * 100; // convert to meters
	const dy = (end.y - start.y) * 100; // convert to meters
	const distance = Math.sqrt(dx * dx + dy * dy).toFixed(0);

	return Number(distance);
}

function calculateAzimuthMils({
	start,
	end,
	mortar,
}: {
	start: { x: number; y: number };
	end: { x: number; y: number };
	mortar: "M252" | "2B14";
}): number {
	const milsPerCircle = mortar === "M252" ? 6400 : 6000;

	const dx = end.x - start.x;
	const dy = end.y - start.y;

	const radians = Math.atan2(dx, dy);

	const normalized = (radians + 2 * Math.PI) % (2 * Math.PI);

	return Number(((normalized / (2 * Math.PI)) * milsPerCircle).toFixed(0));
}

export { calculateAzimuthMils, calculateDistance, calculatePrecision };
