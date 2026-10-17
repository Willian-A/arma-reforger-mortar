function calculateDistance({
	origin,
	target,
}: {
	origin: { x: number; y: number };
	target: { x: number; y: number };
}): number {
	const dx = (target.x - origin.x) * 100; // convert to meters
	const dy = (target.y - origin.y) * 100; // convert to meters
	const distance = Math.sqrt(dx * dx + dy * dy).toFixed(0);

	return Number(distance);
}

function calculateAzimuthMils({
	origin,
	target,
	mortar,
}: {
	origin: { x: number; y: number };
	target: { x: number; y: number };
	mortar: "M252" | "2B14";
}): number {
	const milsPerCircle = mortar === "M252" ? 6400 : 6000;

	const dx = target.x - origin.x;
	const dy = target.y - origin.y;

	const radians = Math.atan2(dx, dy);

	const normalized = (radians + 2 * Math.PI) % (2 * Math.PI);

	return Number(((normalized / (2 * Math.PI)) * milsPerCircle).toFixed(0));
}

export { calculateAzimuthMils, calculateDistance };
