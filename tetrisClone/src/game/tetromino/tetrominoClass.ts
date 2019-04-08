import Tetromino from "./tetromino.js";
import IGameHooks from "../iGameHooks.js";

type TetrominoClass = new (game: IGameHooks) => Tetromino;

export default TetrominoClass;