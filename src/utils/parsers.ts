import { toast } from "@heroui/react";

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

function parseCoords(coords: string, height: string): string[] {
	const formattedCoords = coords.trim().replaceAll(" ", "");

	if (formattedCoords.length !== 6) {
		toast("Wrong form data", {
			description: "Typed coords are using invalid format",
			variant: "warning",
			timeout: 5000,
		});
		throw new Error("Invalid coords format");
	} else if (!/^[0-9 ]+$/.test(formattedCoords)) {
		toast("Wrong form data", {
			description: "Typed coords are using invalid characters",
			variant: "warning",
			timeout: 5000,
		});
		throw new Error("Invalid coords characters");
	}

	const X = formattedCoords.slice(0, 3);
	const Y = formattedCoords.slice(3, 6);

	if (Number(X) < 0 || Number(Y) < 0) {
		toast("Wrong form data", {
			description: "Typed coords must be positive",
			variant: "warning",
			timeout: 5000,
		});
		throw new Error("Coords must be positive");
	}

	const Z = height.trim().replaceAll(" ", "");

	return [X, Y, Z];
}

export { centerCoords, gridToMeters, parseCoords };
