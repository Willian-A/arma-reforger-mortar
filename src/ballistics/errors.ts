export class NoChargeError extends Error {
	readonly distanceM: number;

	constructor(distanceM: number) {
		super(`No mortar shell charge for ${distanceM}m range`);
		this.name = "NoChargeError";
		this.distanceM = distanceM;
	}
}

export class OutOfRangeError extends Error {
	readonly distanceM: number;

	constructor(distanceM: number) {
		super("Distance out of range for this charge");
		this.name = "OutOfRangeError";
		this.distanceM = distanceM;
	}
}
