export function sameCoords(arr1: Coods, arr2: Coods): boolean {
	return arr1[0] === arr2[0] && arr1[1] === arr2[1];
}

/**
 * @params
 * 	max: max number, not included
*/
export function randomInt(max: number = 1): number {
	return Math.floor(Math.random() * max);
}

export const enum SquareState {
	UNFLAGGED,
	FLAGGED,
}

// CW order must be kept
export enum Directions {
	NorthEast,
	East,
	SouthEast,
	SouthWest,
	West,
	NorthWest,
}

export type Coods = [x: number, y: number];

export type CatConfigType = {
	gridSize: number;
	boardState: SquareState[][];
	onMove?: (pos: Coods) => void;
};

export type SquareProps = {
	row: number;
	col: number;
	val: SquareState;
	hasCat: boolean;
	onClick: () => void;
	onRightClick?: (e: any) => void;
	escapeDirection?: ["0" | "-1" | "1", "0" | "-1" | "1"];
};
