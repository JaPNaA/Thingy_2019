import Tetromino from "./tetromino.js";
import GameHooks from "../gameHooks.js";

type TetrominoClass = new (game: GameHooks) => Tetromino;

export default TetrominoClass;