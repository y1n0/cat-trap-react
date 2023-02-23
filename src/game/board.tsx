import { randomInt, SquareState, Coods } from "./utils";

export class Board {
	size: number;
	boardState: SquareState[][];
	catPosition: Coods = [-1, -1];
	private onUpdate?: (newBoard: SquareState[][]) => void;
	constructor(size: number, onUpdate?: (newBoard: SquareState[][]) => void) {
		this.size = size;
		this.boardState = this.generateMatrix(size, size);
		this.onUpdate = onUpdate;
	}

	protected generateMatrix(
		size: number,
		blockadesNumber: number = 0
	): SquareState[][] {
		return new Array(size)
			.fill(undefined)
			.map(() =>
				new Array(size)
					.fill(SquareState.UNFLAGGED)
					.map(() => this.randomBlockades(blockadesNumber))
			);
	}

	private randomBlockades(number: number): SquareState {
		return randomInt(number) === number - 1
			? SquareState.FLAGGED
			: SquareState.UNFLAGGED;
	}

	reset() {
		this.boardState = this.generateMatrix(this.size, this.size);
		this.catPosition;
		this.onUpdate?.(this.boardState);
	}

	updateCatPosition(newCatPosition: Coods) {
		this.catPosition = newCatPosition;
	}

	isFlaged([x, y]: Coods): boolean {
		return this.boardState[y][x] === SquareState.FLAGGED;
	}

	flag(
		[x, y]: Coods,
		flagType: SquareState = SquareState.FLAGGED
	): SquareState[][] {
		const newBoard: SquareState[][] = structuredClone(this.boardState);
		newBoard[y][x] = flagType;
		this.boardState = newBoard;
		this.onUpdate?.(this.boardState);
		return this.boardState;
	}

	flugUnflagSquare(coord: Coods): SquareState[][] {
		if (this.isFlaged(coord)) this.flag(coord, SquareState.UNFLAGGED);
		else this.flag(coord, SquareState.FLAGGED);
		return this.boardState;
	}
}
