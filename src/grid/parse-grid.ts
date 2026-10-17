import { toast } from "@heroui/react";

function parseGrid(grid: string, altitude: string): string[] {
	const formattedGrid = grid.trim().replaceAll(" ", "");

	if (formattedGrid.length !== 6) {
		toast("Wrong form data", {
			description: "Typed coords are using invalid format",
			variant: "warning",
			timeout: 5000,
		});
		throw new Error("Invalid coords format");
	} else if (!/^[0-9 ]+$/.test(formattedGrid)) {
		toast("Wrong form data", {
			description: "Typed coords are using invalid characters",
			variant: "warning",
			timeout: 5000,
		});
		throw new Error("Invalid coords characters");
	}

	const X = formattedGrid.slice(0, 3);
	const Y = formattedGrid.slice(3, 6);

	if (Number(X) < 0 || Number(Y) < 0) {
		toast("Wrong form data", {
			description: "Typed coords must be positive",
			variant: "warning",
			timeout: 5000,
		});
		throw new Error("Coords must be positive");
	}

	const normalizedAltitude = altitude.trim().replaceAll(" ", "");

	return [X, Y, normalizedAltitude];
}

export { parseGrid };
