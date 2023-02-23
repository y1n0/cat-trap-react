import {
	Coods,
	randomInt,
	SquareState,
	Directions,
	CatConfigType,
} from "./utils";
import { OutOfBoardError, GameOver } from "./exceptions";

// once a direction is blocked, do not suggest it again

export class Cat {
	private gridSize: number;
	x: number;
	y: number;
	onMove?: (pos: Coods) => void;
	protected boardState: SquareState[][];
	private DIRECTIONS_NUMBER = Object.keys(Directions).length / 2;
	private firstMove = true;

	constructor({ gridSize, onMove, boardState }: CatConfigType) {
		[this.x, this.y] = this.generateCatInitialPos(gridSize);
		this.onMove = onMove;
		this.gridSize = gridSize;
		this.boardState = boardState;
	}

	private generateCatInitialPos(size: number): number[] {
		let even = false;
		if (size % 2 === 0) even = true;
		const randomness = randomInt(2);

		let mid = size / 2;
		mid = Math.floor(mid);

		if (even) return randomness === 1 ? [mid - 1, mid] : [mid, mid - 1];
		else return [mid, mid];
	}

	set position(pos: Coods) {
		[this.x, this.y] = pos;
		this.onMove?.([this.x, this.y]);
	}

	get position() {
		return [this.x, this.y];
	}

	get isOffset() {
		// whether the current row the cat is on is off set along the x axis
		return this.y % 2 === 1;
	}

	reset() {
		[this.x, this.y] = this.generateCatInitialPos(this.gridSize);
		this.firstMove = true;
		this.onMove?.(this.position);
	}

	public updateBoardState(newBoardState: SquareState[][]) {
		// console.log("updating bord");
		this.boardState = newBoardState;
	}

	private isBlocked(direction: Directions): boolean {
		const oldPosition = this.position;
		try {
			this.moveIndirection(direction);
		} catch (e: any) {
			// this is game over. but report false nevertheless,
			// the exception will be caught later to annouce game over
			if (e instanceof OutOfBoardError) return false;
			else throw e;
		}
		const [newX, newY] = this.position;
		[this.x, this.y] = oldPosition;
		// console.log(`test square `, newX, newY, `is blocked? `, this.boardState[newX][newY]);
		return this.boardState[newY][newX] === SquareState.FLAGGED;
	}

	move() {
		let direction: Directions;
		if (this.firstMove)
			direction = this.getRandomDirection();
		else
			direction = this.findClosestEdge();

		let failedDirectionsCount = 0;

		while (
			this.isBlocked(direction) &&
			failedDirectionsCount < this.DIRECTIONS_NUMBER
		) {
			direction = this.getNextCWDirection(direction);
			failedDirectionsCount++;
		}

		if (failedDirectionsCount === this.DIRECTIONS_NUMBER) {
			// game over
			throw new GameOver("win");
		} else {
			try {
				this.moveIndirection(direction);
			} catch (e: any) {
				if (e instanceof OutOfBoardError) throw new GameOver("lose");
				else throw e;
			}
			this.firstMove = false;
			this.onMove?.([this.x, this.y]);
		}
	}

	findClosestEdge(): Directions {
		let closestEdge: Directions;

		// closest edge along X axis
		if (this.x <= this.gridSize / 2 - 1) closestEdge = Directions.West;
		else closestEdge = Directions.East;

		// closest edge along Y xis
		if (this.y <= this.gridSize / 2 - 1) {
			if (closestEdge === Directions.West)
				closestEdge = Directions.NorthWest;
			else closestEdge = Directions.NorthEast;
		} else {
			if (closestEdge === Directions.West)
				closestEdge = Directions.SouthWest;
			else closestEdge = Directions.SouthEast;
		}

		return closestEdge;
	}

	findNextClosestEdgeDirection() {}

	getRandomDirection(): Directions {
		const randomDirectionIndex = randomInt(this.DIRECTIONS_NUMBER);
		return randomDirectionIndex;
	}

	moveIndirection(direction: Directions) {
		// console.log(`moving `, Directions[direction]);
		(this as any)["move" + Directions[direction]]();
	}

	getNextCWDirection(direction: Directions): Directions {
		if (direction === this.DIRECTIONS_NUMBER - 1) return 0;
		return direction + 1;
	}

	moveEast() {
		if (this.x === this.gridSize - 1)
			throw new OutOfBoardError(Directions.East);
		this.x += 1;
	}
	moveWest() {
		if (this.x === 0) throw new OutOfBoardError(Directions.West);

		this.x -= 1;
	}

	moveNorthEast() {
		if ((this.x === this.gridSize - 1 && this.isOffset) || this.y === 0)
			throw new OutOfBoardError(Directions.NorthEast);
		if (this.isOffset) this.x += 1;
		this.y -= 1;
	}
	moveSouthEast() {
		if (
			(this.x === this.gridSize - 1 && this.isOffset) ||
			this.y === this.gridSize - 1
		)
			throw new OutOfBoardError(Directions.SouthEast);
		if (this.isOffset) this.x += 1;
		this.y += 1;
	}

	moveNorthWest() {
		if ((this.x === 0 && !this.isOffset) || this.y === 0)
			throw new OutOfBoardError(Directions.NorthWest);
		if (!this.isOffset) this.x -= 1;
		this.y -= 1;
	}
	moveSouthWest() {
		if ((this.x === 0 && !this.isOffset) || this.y === this.gridSize - 1)
			throw new OutOfBoardError(Directions.SouthWest);
		if (!this.isOffset) this.x -= 1;
		this.y += 1;
	}
}
