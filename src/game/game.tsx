import React from "react";
import c from "clsx";
import "./game.css";
import { Cat } from "./cat";
import { Board } from "./board";
import { sameCoords, SquareProps } from "./utils";

const Square = ({
	row,
	col,
	val,
	hasCat,
	onClick,
	onRightClick,
	escapeDirection,
}: SquareProps) => {
	return (
		<div
			id={`${row}x${col}`}
			className={c("square", {
				off: val,
				cat: hasCat,
				escape: !!escapeDirection,
			})}
			onClick={onClick}
			onContextMenu={onRightClick}
			style={
				{
					fontSize: 10,
					fontFamily: "monospace",
					color: "black",
					"--escape-x": escapeDirection?.[0],
					"--escape-y": escapeDirection?.[1],
				} as any
			}
		>
			{col},{row}
		</div>
	);
};

const inc = (s: number) => ++s;

export function Game({ size = 10 }) {
	const [message, setMessage] = React.useState("");
	const [tack, tick] = React.useState(0);
	const { current: board } = React.useRef(
		new Board(size, (newBoard) => {
			cat.updateBoardState(newBoard);
			tick(inc);
		})
	);
	const { current: cat } = React.useRef(
		new Cat({
			gridSize: size,
			onMove: (c) => {
				board.updateCatPosition(c);
				tick(inc);
			},
			boardState: board.boardState,
		})
	);

	(window as any).cat = cat;
	(window as any).board = board;
	const catPos = cat.position;
	const reset = () => {
		setMessage("");
		cat.reset();
		board.reset();
	};

	function handleClick(row: number, col: number) {
		if (!!message) return;
		if (sameCoords([row, col], board.catPosition)) return;
		if (board.isFlaged([row, col])) return;

		board.flag([row, col]);
		try {
			cat.move();
		} catch (e: any) {
			setMessage(e.message);
		}
	}

	return (
		<>
			<div className="announcements">
				{message && <div className="msg">{message}</div>}
				<div className="ctrl">
					{tack}
					<button onClick={reset}>reset</button>
				</div>
			</div>
			<div
				className="box"
				style={
					{
						"--size": size,
					} as any
				}
			>
				{board.boardState.map((row, rIndex) => {
					return (
						<div key={rIndex} className="row">
							{row.map((col, cIndex) => (
								<Square
									key={`${rIndex}-${cIndex}`}
									row={rIndex}
									col={cIndex}
									val={col}
									hasCat={sameCoords(catPos, [
										cIndex,
										rIndex,
									])}
									escapeDirection={
										// prettier-ignore
										!!message
											? [ cIndex === 0 ? "-1" : cIndex + 1 === size ? "1" : "0",
												rIndex === 0 ? "-1" : rIndex + 1 === size ? "1" : "0"]
											: undefined
									}
									onClick={() => handleClick(cIndex, rIndex)}
									onRightClick={(e) => {
										e.preventDefault();
										cat.position = [cIndex, rIndex];
									}}
								/>
							))}
						</div>
					);
				})}
			</div>
		</>
	);
}
