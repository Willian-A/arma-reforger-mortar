function parseGrid(grid: string): { x: number; y: number } {
	const digits = grid.replaceAll(" ", "");

	return { x: Number(digits.slice(0, 3)), y: Number(digits.slice(3, 6)) };
}

export { parseGrid };
