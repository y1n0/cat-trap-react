import { Directions } from "./utils";

export class OutOfBoardError extends Error {
	constructor(direction: Directions) {
		super("Can not move " + Directions[direction]);
	}
}
export class GameOver extends Error {
	constructor(outcome: "win" | "lose") {
		const messages = {
			win: "You caught the cat! You've won.",
			lose: "The cat escaped! You lost.",
		};
		super(messages[outcome]);
	}
}
